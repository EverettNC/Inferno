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
 * Multi-Factor Authentication Service
 * TOTP-based MFA with QR codes, backup codes, and security controls
 */

import { Secret, TOTP } from 'otpauth';
import QRCode from 'qrcode';
import { randomBytes } from 'crypto';
import EncryptionService from './encryption';

export interface MFASecret {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

export interface MFAConfig {
  issuer: string;
  algorithm: string;
  digits: number;
  period: number;
}

export interface UserMFA {
  id?: number;
  userId: number;
  secret: string; // Encrypted
  isEnabled: boolean;
  backupCodes: string[]; // Encrypted
  lastUsedAt?: Date;
  createdAt: Date;
}

export class MFAService {
  private static readonly DEFAULT_CONFIG: MFAConfig = {
    issuer: 'Inferno AI',
    algorithm: 'SHA1',
    digits: 6,
    period: 30
  };

  /**
   * Generate MFA secret and QR code for user setup
   */
  static async generateMFASecret(username: string, config?: Partial<MFAConfig>): Promise<MFASecret> {
    const finalConfig = { ...this.DEFAULT_CONFIG, ...config };
    
    // Generate a random secret
    const secret = new Secret();
    
    // Create TOTP instance
    const totp = new TOTP({
      issuer: finalConfig.issuer,
      label: username,
      algorithm: finalConfig.algorithm,
      digits: finalConfig.digits,
      period: finalConfig.period,
      secret: secret,
    });

    // Generate QR code URL
    const qrCodeUrl = await QRCode.toDataURL(totp.toString());
    
    // Generate backup codes
    const backupCodes = this.generateBackupCodes();

    return {
      secret: secret.base32,
      qrCodeUrl,
      backupCodes
    };
  }

  /**
   * Generate backup codes for account recovery
   */
  static generateBackupCodes(count: number = 10): string[] {
    const codes: string[] = [];
    
    for (let i = 0; i < count; i++) {
      // Generate 8-character alphanumeric code
      const code = randomBytes(4).toString('hex').toUpperCase();
      codes.push(`${code.slice(0, 4)}-${code.slice(4)}`);
    }
    
    return codes;
  }

  /**
   * Verify TOTP token
   */
  static verifyTOTP(secret: string, token: string, config?: Partial<MFAConfig>): boolean {
    try {
      const finalConfig = { ...this.DEFAULT_CONFIG, ...config };
      
      const totp = new TOTP({
        algorithm: finalConfig.algorithm,
        digits: finalConfig.digits,
        period: finalConfig.period,
        secret: Secret.fromBase32(secret),
      });

      // Allow 1 time step tolerance (30 seconds before/after)
      const delta = totp.validate({ token, window: 1 });
      
      return delta !== null;
    } catch (error) {
      console.error('TOTP verification failed:', error);
      return false;
    }
  }

  /**
   * Verify backup code
   */
  static verifyBackupCode(backupCodes: string[], providedCode: string): { valid: boolean; remainingCodes: string[] } {
    const normalizedProvided = providedCode.replace(/[-\s]/g, '').toUpperCase();
    const normalizedCodes = backupCodes.map(code => code.replace(/[-\s]/g, '').toUpperCase());
    
    const index = normalizedCodes.indexOf(normalizedProvided);
    
    if (index === -1) {
      return { valid: false, remainingCodes: backupCodes };
    }

    // Remove the used backup code
    const remainingCodes = [...backupCodes];
    remainingCodes.splice(index, 1);
    
    return { valid: true, remainingCodes };
  }

  /**
   * Encrypt MFA data for storage
   */
  static encryptMFAData(secret: string, backupCodes: string[]): { encryptedSecret: any; encryptedBackupCodes: any } {
    return {
      encryptedSecret: EncryptionService.encrypt(secret),
      encryptedBackupCodes: EncryptionService.encrypt(JSON.stringify(backupCodes))
    };
  }

  /**
   * Decrypt MFA data from storage
   */
  static decryptMFAData(encryptedSecret: any, encryptedBackupCodes: any): { secret: string; backupCodes: string[] } {
    try {
      const secret = EncryptionService.decrypt(encryptedSecret);
      const backupCodesJson = EncryptionService.decrypt(encryptedBackupCodes);
      const backupCodes = JSON.parse(backupCodesJson);
      
      return { secret, backupCodes };
    } catch (error) {
      throw new Error(`Failed to decrypt MFA data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Check if MFA is required for the user/operation
   */
  static isMFARequired(userRole?: string, operation?: string): boolean {
    // Define MFA requirements based on role and operation
    const mfaRequiredOperations = [
      'data_export',
      'account_deletion',
      'sensitive_data_access',
      'admin_operations'
    ];

    const mfaRequiredRoles = [
      'admin',
      'clinician',
      'data_processor'
    ];

    return Boolean(
      (operation && mfaRequiredOperations.includes(operation)) ||
      (userRole && mfaRequiredRoles.includes(userRole))
    );
  }

  /**
   * Validate MFA setup requirements
   */
  static validateMFASetup(secret: string, token: string): { valid: boolean; error?: string } {
    if (!secret || secret.length < 16) {
      return { valid: false, error: 'Invalid secret format' };
    }

    if (!token || !/^\d{6}$/.test(token)) {
      return { valid: false, error: 'Token must be 6 digits' };
    }

    const isValid = this.verifyTOTP(secret, token);
    
    return {
      valid: isValid,
      error: isValid ? undefined : 'Invalid verification code'
    };
  }

  /**
   * Generate recovery information for MFA reset
   */
  static generateRecoveryInfo(userId: number): { recoveryToken: string; expiresAt: Date } {
    const recoveryToken = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour expiry

    return { recoveryToken, expiresAt };
  }

  /**
   * Rate limiting for MFA attempts
   */
  private static mfaAttempts = new Map<string, { count: number; resetAt: Date }>();

  static checkMFARateLimit(identifier: string, maxAttempts: number = 5, windowMinutes: number = 15): boolean {
    const now = new Date();
    const key = `mfa_${identifier}`;
    const attempt = this.mfaAttempts.get(key);

    if (!attempt || now > attempt.resetAt) {
      // Reset or initialize
      this.mfaAttempts.set(key, {
        count: 1,
        resetAt: new Date(now.getTime() + windowMinutes * 60 * 1000)
      });
      return true;
    }

    if (attempt.count >= maxAttempts) {
      return false; // Rate limited
    }

    attempt.count++;
    return true;
  }

  /**
   * Clear MFA rate limit (for successful authentication)
   */
  static clearMFARateLimit(identifier: string): void {
    this.mfaAttempts.delete(`mfa_${identifier}`);
  }

  /**
   * Health check for MFA service
   */
  static healthCheck(): { status: string; details: any } {
    try {
      // Test TOTP generation and verification
      const secret = new Secret();
      const totp = new TOTP({
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: secret,
      });

      const token = totp.generate();
      const isValid = this.verifyTOTP(secret.base32, token);

      return {
        status: isValid ? 'healthy' : 'unhealthy',
        details: {
          totpTest: isValid,
          algorithm: this.DEFAULT_CONFIG.algorithm,
          digits: this.DEFAULT_CONFIG.digits,
          period: this.DEFAULT_CONFIG.period,
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

  /**
   * Clean up expired rate limit entries
   */
  static cleanupRateLimits(): number {
    const now = new Date();
    let cleaned = 0;

    const entries = Array.from(this.mfaAttempts.entries());
    for (const [key, attempt] of entries) {
      if (now > attempt.resetAt) {
        this.mfaAttempts.delete(key);
        cleaned++;
      }
    }

    return cleaned;
  }

  /**
   * Get MFA statistics
   */
  static getMFAStats(): { 
    activeLimits: number; 
    defaultConfig: MFAConfig;
    supportedAlgorithms: string[];
  } {
    return {
      activeLimits: this.mfaAttempts.size,
      defaultConfig: this.DEFAULT_CONFIG,
      supportedAlgorithms: ['SHA1', 'SHA256', 'SHA512']
    };
  }
}

export default MFAService;