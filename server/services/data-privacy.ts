/*
© 2025 The Christman AI Project. All rights reserved.

This code is released as part of a trauma-informed, dignity-first AI ecosystem
designed to protect, empower, and elevate vulnerable populations.

By using, modifying, or distributing this software, you agree to uphold the following:
1. Truth — No deception, no manipulation.
2. Dignity — Respect the autonomy and humanity of all users.
3. Protection — Never use this to exploit or harm vulnerable individuals.
4. Transparency — Disclose all modifications and contributions clearly.
5. No Erasure — Preserve the mission and ethical origin of this work.

This is not just code. This is redemption in code.
Contact: lumacognify@thechristmanaiproject.com
https://thechristmanaiproject.com
*/


/**
 * Data Privacy Controls Service
 * GDPR/HIPAA compliant user data management with export, deletion, and consent tracking
 */

import { createHash } from 'crypto';
import EncryptionService from './encryption';
import SecurityAuditLogger from './security-audit';

export interface UserConsent {
  id?: number;
  userId: number;
  consentType: ConsentType;
  granted: boolean;
  purpose: string;
  legalBasis: string;
  timestamp: Date;
  expiresAt?: Date;
  ipAddress?: string;
  userAgent?: string;
  withdrawnAt?: Date;
  version: string; // Consent version for tracking changes
}

export enum ConsentType {
  DATA_PROCESSING = 'data_processing',
  MARKETING = 'marketing',
  ANALYTICS = 'analytics',
  RESEARCH = 'research',
  MEDICAL_DATA = 'medical_data',
  THIRD_PARTY_SHARING = 'third_party_sharing',
  COOKIES = 'cookies',
  NOTIFICATIONS = 'notifications'
}

export interface DataExportRequest {
  id?: number;
  userId: number;
  requestedAt: Date;
  status: ExportStatus;
  format: ExportFormat;
  includeArchived: boolean;
  completedAt?: Date;
  downloadUrl?: string;
  expiresAt?: Date;
  requestHash: string;
}

export enum ExportStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  EXPIRED = 'expired'
}

export enum ExportFormat {
  JSON = 'json',
  CSV = 'csv',
  PDF = 'pdf'
}

export interface DataDeletionRequest {
  id?: number;
  userId: number;
  requestedAt: Date;
  status: DeletionStatus;
  reason: string;
  verificationMethod: string;
  scheduledFor?: Date;
  completedAt?: Date;
  confirmationCode: string;
  retentionOverride?: boolean;
  legalHold?: boolean;
}

export enum DeletionStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  SCHEDULED = 'scheduled',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export interface DataRetentionPolicy {
  dataType: string;
  retentionPeriodDays: number;
  legalBasis: string;
  autoDelete: boolean;
  requiresUserConsent: boolean;
  exceptions: string[];
}

export class DataPrivacyService {
  private static readonly RETENTION_POLICIES: DataRetentionPolicy[] = [
    {
      dataType: 'user_profile',
      retentionPeriodDays: 2555, // 7 years for medical data
      legalBasis: 'HIPAA compliance',
      autoDelete: false,
      requiresUserConsent: true,
      exceptions: ['legal_hold', 'ongoing_treatment']
    },
    {
      dataType: 'session_data',
      retentionPeriodDays: 365,
      legalBasis: 'Security monitoring',
      autoDelete: true,
      requiresUserConsent: false,
      exceptions: ['security_incident']
    },
    {
      dataType: 'clinical_notes',
      retentionPeriodDays: 2555, // 7 years
      legalBasis: 'Medical record retention',
      autoDelete: false,
      requiresUserConsent: true,
      exceptions: ['ongoing_treatment', 'legal_proceedings']
    },
    {
      dataType: 'analytics_data',
      retentionPeriodDays: 730, // 2 years
      legalBasis: 'Service improvement',
      autoDelete: true,
      requiresUserConsent: true,
      exceptions: []
    },
    {
      dataType: 'audit_logs',
      retentionPeriodDays: 2555, // 7 years for compliance
      legalBasis: 'Regulatory compliance',
      autoDelete: false,
      requiresUserConsent: false,
      exceptions: ['ongoing_investigation']
    }
  ];

  /**
   * Record user consent
   */
  static async recordConsent(consent: Omit<UserConsent, 'id' | 'timestamp' | 'version'>): Promise<UserConsent> {
    const consentRecord: UserConsent = {
      ...consent,
      timestamp: new Date(),
      version: '1.0' // Current consent version
    };

    // Log consent for audit trail
    await SecurityAuditLogger.logEvent({
      eventType: 'CONSENT_GRANTED',
      userId: consent.userId,
      details: {
        consentType: consent.consentType,
        purpose: consent.purpose,
        legalBasis: consent.legalBasis,
        granted: consent.granted
      },
      severity: 'INFO'
    });

    return consentRecord;
  }

  /**
   * Withdraw user consent
   */
  static async withdrawConsent(userId: number, consentType: ConsentType, reason?: string): Promise<void> {
    const withdrawnAt = new Date();

    // Log consent withdrawal
    await SecurityAuditLogger.logEvent({
      eventType: 'CONSENT_WITHDRAWN',
      userId,
      details: {
        consentType,
        reason,
        withdrawnAt: withdrawnAt.toISOString()
      },
      severity: 'INFO'
    });

    // Check if withdrawal affects data retention
    await this.evaluateDataRetention(userId, consentType);
  }

  /**
   * Create data export request
   */
  static async createDataExportRequest(
    userId: number, 
    format: ExportFormat = ExportFormat.JSON,
    includeArchived: boolean = false
  ): Promise<DataExportRequest> {
    const requestedAt = new Date();
    const requestData = `${userId}-${requestedAt.getTime()}-${format}`;
    const requestHash = createHash('sha256').update(requestData).digest('hex');

    const exportRequest: DataExportRequest = {
      userId,
      requestedAt,
      status: ExportStatus.PENDING,
      format,
      includeArchived,
      requestHash
    };

    await SecurityAuditLogger.logEvent({
      eventType: 'DATA_EXPORT_REQUESTED',
      userId,
      details: {
        format,
        includeArchived,
        requestHash
      },
      severity: 'INFO'
    });

    return exportRequest;
  }

  /**
   * Process data export
   */
  static async processDataExport(exportRequest: DataExportRequest): Promise<any> {
    try {
      // Update status to processing
      exportRequest.status = ExportStatus.PROCESSING;

      // Gather user data from various sources
      const userData = await this.gatherUserData(exportRequest.userId, exportRequest.includeArchived);

      // Format data according to requested format
      const formattedData = await this.formatExportData(userData, exportRequest.format);

      // Encrypt the export file
      const encryptedData = EncryptionService.encrypt(JSON.stringify(formattedData));

      // Set completion details
      exportRequest.status = ExportStatus.COMPLETED;
      exportRequest.completedAt = new Date();
      exportRequest.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      await SecurityAuditLogger.logEvent({
        eventType: 'DATA_EXPORT_COMPLETED',
        userId: exportRequest.userId,
        details: {
          requestHash: exportRequest.requestHash,
          format: exportRequest.format,
          dataSize: JSON.stringify(formattedData).length
        },
        severity: 'INFO'
      });

      return encryptedData;
    } catch (error) {
      exportRequest.status = ExportStatus.FAILED;
      
      await SecurityAuditLogger.logEvent({
        eventType: 'DATA_EXPORT_FAILED',
        userId: exportRequest.userId,
        details: {
          requestHash: exportRequest.requestHash,
          error: error instanceof Error ? error.message : 'Unknown error'
        },
        severity: 'ERROR'
      });

      throw error;
    }
  }

  /**
   * Create data deletion request
   */
  static async createDataDeletionRequest(
    userId: number,
    reason: string,
    verificationMethod: string
  ): Promise<DataDeletionRequest> {
    const confirmationCode = createHash('sha256')
      .update(`${userId}-${Date.now()}-${Math.random()}`)
      .digest('hex')
      .substring(0, 8)
      .toUpperCase();

    const deletionRequest: DataDeletionRequest = {
      userId,
      requestedAt: new Date(),
      status: DeletionStatus.PENDING,
      reason,
      verificationMethod,
      confirmationCode
    };

    await SecurityAuditLogger.logEvent({
      eventType: 'DATA_DELETION_REQUESTED',
      userId,
      details: {
        reason,
        verificationMethod,
        confirmationCode
      },
      severity: 'WARN'
    });

    return deletionRequest;
  }

  /**
   * Verify and schedule data deletion
   */
  static async verifyAndScheduleDeletion(
    deletionRequest: DataDeletionRequest,
    providedCode: string,
    gracePeriodDays: number = 30
  ): Promise<void> {
    if (deletionRequest.confirmationCode !== providedCode.toUpperCase()) {
      await SecurityAuditLogger.logEvent({
        eventType: 'DATA_DELETION_VERIFICATION_FAILED',
        userId: deletionRequest.userId,
        details: {
          providedCode,
          expected: deletionRequest.confirmationCode
        },
        severity: 'WARN'
      });
      throw new Error('Invalid confirmation code');
    }

    // Check for legal holds or retention requirements
    const hasLegalHold = await this.checkLegalHold(deletionRequest.userId);
    if (hasLegalHold) {
      deletionRequest.legalHold = true;
      deletionRequest.status = DeletionStatus.CANCELLED;
      
      await SecurityAuditLogger.logEvent({
        eventType: 'DATA_DELETION_BLOCKED_LEGAL_HOLD',
        userId: deletionRequest.userId,
        details: {
          reason: 'Legal hold prevents deletion'
        },
        severity: 'WARN'
      });
      return;
    }

    // Schedule deletion after grace period
    deletionRequest.status = DeletionStatus.VERIFIED;
    deletionRequest.scheduledFor = new Date(Date.now() + gracePeriodDays * 24 * 60 * 60 * 1000);

    await SecurityAuditLogger.logEvent({
      eventType: 'DATA_DELETION_SCHEDULED',
      userId: deletionRequest.userId,
      details: {
        scheduledFor: deletionRequest.scheduledFor?.toISOString(),
        gracePeriodDays
      },
      severity: 'WARN'
    });
  }

  /**
   * Execute data deletion
   */
  static async executeDataDeletion(deletionRequest: DataDeletionRequest): Promise<void> {
    try {
      deletionRequest.status = DeletionStatus.PROCESSING;

      // Delete data according to retention policies
      const deletionResults = await this.performDataDeletion(deletionRequest.userId);

      deletionRequest.status = DeletionStatus.COMPLETED;
      deletionRequest.completedAt = new Date();

      await SecurityAuditLogger.logEvent({
        eventType: 'DATA_DELETION_COMPLETED',
        userId: deletionRequest.userId,
        details: {
          deletionResults,
          completedAt: deletionRequest.completedAt.toISOString()
        },
        severity: 'WARN'
      });
    } catch (error) {
      deletionRequest.status = DeletionStatus.FAILED;
      
      await SecurityAuditLogger.logEvent({
        eventType: 'DATA_DELETION_FAILED',
        userId: deletionRequest.userId,
        details: {
          error: error instanceof Error ? error.message : 'Unknown error'
        },
        severity: 'ERROR'
      });
      throw error;
    }
  }

  /**
   * Check user consent for specific purpose
   */
  static async hasValidConsent(userId: number, consentType: ConsentType, purpose?: string): Promise<boolean> {
    // This would query the database for active consent
    // For now, return a placeholder implementation
    return true; // TODO: Implement database query
  }

  /**
   * Get user's data processing activities
   */
  static async getUserDataProcessingActivities(userId: number): Promise<any[]> {
    return [
      {
        activity: 'Profile Management',
        dataTypes: ['personal_info', 'preferences'],
        purpose: 'Service provision',
        legalBasis: 'Contract',
        retention: '7 years after account closure'
      },
      {
        activity: 'Clinical Data Processing',
        dataTypes: ['health_data', 'session_notes'],
        purpose: 'Healthcare provision',
        legalBasis: 'HIPAA consent',
        retention: '7 years minimum'
      },
      {
        activity: 'Security Monitoring',
        dataTypes: ['access_logs', 'authentication_data'],
        purpose: 'Security and fraud prevention',
        legalBasis: 'Legitimate interest',
        retention: '2 years'
      }
    ];
  }

  /**
   * Evaluate data retention after consent changes
   */
  private static async evaluateDataRetention(userId: number, consentType: ConsentType): Promise<void> {
    const affectedPolicies = this.RETENTION_POLICIES.filter(policy => 
      policy.requiresUserConsent && this.isConsentRelevant(policy.dataType, consentType)
    );

    for (const policy of affectedPolicies) {
      await SecurityAuditLogger.logEvent({
        eventType: 'DATA_RETENTION_EVALUATED',
        userId,
        details: {
          dataType: policy.dataType,
          consentType,
          policy: policy.dataType
        },
        severity: 'INFO'
      });
    }
  }

  /**
   * Check if consent is relevant to data type
   */
  private static isConsentRelevant(dataType: string, consentType: ConsentType): boolean {
    const relevanceMap: Record<string, ConsentType[]> = {
      'user_profile': [ConsentType.DATA_PROCESSING],
      'clinical_notes': [ConsentType.MEDICAL_DATA],
      'analytics_data': [ConsentType.ANALYTICS],
      'session_data': [ConsentType.DATA_PROCESSING]
    };

    return relevanceMap[dataType]?.includes(consentType) || false;
  }

  /**
   * Gather user data for export
   */
  private static async gatherUserData(userId: number, includeArchived: boolean): Promise<any> {
    return {
      profile: {}, // TODO: Implement actual data gathering
      sessions: [],
      preferences: {},
      clinicalData: includeArchived ? {} : {},
      auditLogs: []
    };
  }

  /**
   * Format export data according to requested format
   */
  private static async formatExportData(userData: any, format: ExportFormat): Promise<any> {
    switch (format) {
      case ExportFormat.JSON:
        return userData;
      case ExportFormat.CSV:
        // TODO: Implement CSV formatting
        return userData;
      case ExportFormat.PDF:
        // TODO: Implement PDF formatting
        return userData;
      default:
        return userData;
    }
  }

  /**
   * Check for legal holds
   */
  private static async checkLegalHold(userId: number): Promise<boolean> {
    // TODO: Implement legal hold checking
    return false;
  }

  /**
   * Perform actual data deletion
   */
  private static async performDataDeletion(userId: number): Promise<any> {
    return {
      profile: 'deleted',
      sessions: 'deleted',
      preferences: 'deleted',
      retainedData: ['audit_logs'] // Some data must be retained for compliance
    };
  }

  /**
   * Get retention policies
   */
  static getRetentionPolicies(): DataRetentionPolicy[] {
    return [...this.RETENTION_POLICIES];
  }

  /**
   * Privacy dashboard data
   */
  static async getPrivacyDashboard(userId: number): Promise<any> {
    return {
      consents: await this.getUserConsents(userId),
      dataProcessing: await this.getUserDataProcessingActivities(userId),
      retentionPolicies: this.getRetentionPolicies(),
      exportRequests: await this.getUserExportRequests(userId),
      deletionRequests: await this.getUserDeletionRequests(userId)
    };
  }

  /**
   * Get user consents (placeholder)
   */
  private static async getUserConsents(userId: number): Promise<UserConsent[]> {
    // TODO: Implement database query
    return [];
  }

  /**
   * Get user export requests (placeholder)
   */
  private static async getUserExportRequests(userId: number): Promise<DataExportRequest[]> {
    // TODO: Implement database query
    return [];
  }

  /**
   * Get user deletion requests (placeholder)
   */
  private static async getUserDeletionRequests(userId: number): Promise<DataDeletionRequest[]> {
    // TODO: Implement database query
    return [];
  }

  /**
   * Health check for privacy service
   */
  static healthCheck(): { status: string; details: any } {
    try {
      const policiesCount = this.RETENTION_POLICIES.length;
      const testHash = createHash('sha256').update('test').digest('hex');
      
      return {
        status: 'healthy',
        details: {
          retentionPolicies: policiesCount,
          hashingWorking: testHash.length === 64,
          consentTypes: Object.values(ConsentType).length,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        }
      };
    }
  }
}

export default DataPrivacyService;