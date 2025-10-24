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
 * AES-256-GCM Encryption Service
 * Secure encryption for sensitive user data (PII, medical information, notes)
 */

import CryptoJS from 'crypto-js';
import { randomBytes } from 'crypto';

export interface EncryptedData {
  encrypted: string;
  iv: string;
  salt: string;
  tag: string;
}

export class EncryptionService {
  private static readonly ALGORITHM = 'AES-256-GCM';
  private static readonly KEY_LENGTH = 32; // 256 bits
  private static readonly IV_LENGTH = 16;  // 128 bits
  private static readonly SALT_LENGTH = 32; // 256 bits
  private static readonly TAG_LENGTH = 16; // 128 bits
  private static initialized = false;

  /**
   * Initialize the encryption service
   */
  static async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }
    
    // Verify master key is available
    this.getMasterKey();
    this.initialized = true;
  }

  /**
   * Check if service is initialized
   */
  static isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Get the master encryption key from environment
   * In production, this should come from a key management service
   */
  private static getMasterKey(): string {
    const key = process.env.ENCRYPTION_MASTER_KEY;
    if (!key) {
      throw new Error('ENCRYPTION_MASTER_KEY environment variable is required');
    }
    if (key.length < 64) { // 32 bytes = 64 hex chars
      throw new Error('ENCRYPTION_MASTER_KEY must be at least 64 characters (32 bytes in hex)');
    }
    return key;
  }

  /**
   * Derive encryption key from master key and salt using PBKDF2
   */
  private static deriveKey(masterKey: string, salt: string): string {
    return CryptoJS.PBKDF2(masterKey, salt, {
      keySize: this.KEY_LENGTH / 4, // CryptoJS uses 32-bit words
      iterations: 100000, // NIST recommended minimum
      hasher: CryptoJS.algo.SHA256
    }).toString();
  }

  /**
   * Generate cryptographically secure random bytes
   */
  private static generateRandomBytes(length: number): string {
    return randomBytes(length).toString('hex');
  }

    /**
   * Encrypt data using AES-256-CBC with HMAC authentication
   */
  static encrypt(data: string): EncryptedData {
    try {
      const masterKey = this.getMasterKey();
      const salt = this.generateRandomBytes(this.SALT_LENGTH);
      const iv = this.generateRandomBytes(this.IV_LENGTH);
      
      // Derive encryption key
      const key = this.deriveKey(masterKey, salt);
      
      // Encrypt using AES-256-CBC
      const encrypted = CryptoJS.AES.encrypt(data, key, {
        iv: CryptoJS.enc.Hex.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

      // Generate HMAC for authentication
      const hmacKey = CryptoJS.PBKDF2(masterKey + '_hmac', salt, {
        keySize: 8, // 256 bits for HMAC
        iterations: 100000,
        hasher: CryptoJS.algo.SHA256
      });
      
      const hmac = CryptoJS.HmacSHA256(encrypted.toString() + iv + salt, hmacKey).toString();

      return {
        encrypted: encrypted.toString(),
        iv,
        salt,
        tag: hmac
      };
    } catch (error) {
      throw new Error(`Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

    /**
   * Decrypt data using AES-256-CBC with HMAC verification
   */
  static decrypt(encryptedData: EncryptedData): string {
    if (!encryptedData.encrypted || !encryptedData.iv || !encryptedData.salt) {
      throw new Error('Invalid encrypted data structure');
    }

    try {
      const masterKey = this.getMasterKey();
      
      // Verify HMAC first
      const hmacKey = CryptoJS.PBKDF2(masterKey + '_hmac', encryptedData.salt, {
        keySize: 8, // 256 bits for HMAC
        iterations: 100000,
        hasher: CryptoJS.algo.SHA256
      });
      
      const expectedHmac = CryptoJS.HmacSHA256(
        encryptedData.encrypted + encryptedData.iv + encryptedData.salt, 
        hmacKey
      ).toString();
      
      if (expectedHmac !== encryptedData.tag) {
        throw new Error('HMAC verification failed - data may be corrupted or tampered');
      }
      
      // Derive the same encryption key
      const derivedKey = this.deriveKey(masterKey, encryptedData.salt);
      
      // Decrypt using AES-256-CBC
      const decrypted = CryptoJS.AES.decrypt(encryptedData.encrypted, derivedKey, {
        iv: CryptoJS.enc.Hex.parse(encryptedData.iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

      const plaintext = decrypted.toString(CryptoJS.enc.Utf8);
      
      if (!plaintext) {
        throw new Error('Decryption failed - invalid key or corrupted data');
      }

      return plaintext;
    } catch (error) {
      throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Encrypt multiple fields in an object
   */
  static encryptFields<T extends Record<string, any>>(
    data: T, 
    fieldsToEncrypt: (keyof T)[]
  ): T & { _encrypted: Record<string, EncryptedData> } {
    const encrypted: Record<string, EncryptedData> = {};
    const result = { ...data };

    for (const field of fieldsToEncrypt) {
      const value = data[field];
      if (value !== null && value !== undefined && value !== '') {
        encrypted[field as string] = this.encrypt(String(value));
        // Remove the plaintext field
        delete result[field];
      }
    }

    return { ...result, _encrypted: encrypted };
  }

  /**
   * Decrypt multiple fields in an object
   */
  static decryptFields<T extends Record<string, any>>(
    data: T & { _encrypted?: Record<string, EncryptedData> }
  ): T {
    if (!data._encrypted) {
      return data;
    }

    const result = { ...data };
    delete result._encrypted;

    for (const [field, encryptedData] of Object.entries(data._encrypted)) {
      try {
        result[field as keyof T] = this.decrypt(encryptedData) as T[keyof T];
      } catch (error) {
        console.error(`Failed to decrypt field ${field}:`, error);
        // Don't expose the encrypted data, leave field undefined
      }
    }

    return result;
  }

  /**
   * Generate a new master key (for initial setup)
   */
  static generateMasterKey(): string {
    return this.generateRandomBytes(32); // 32 bytes = 64 hex characters
  }

  /**
   * Check if data is encrypted (has encryption metadata)
   */
  static isEncrypted(data: any): data is { _encrypted: Record<string, EncryptedData> } {
    return data && typeof data === 'object' && '_encrypted' in data;
  }

  /**
   * Health check for encryption service
   */
  static healthCheck(): { status: string; details: any } {
    try {
      // Test encryption/decryption cycle
      const testData = 'health-check-test-data';
      const encrypted = this.encrypt(testData);
      const decrypted = this.decrypt(encrypted);
      
      const isWorking = decrypted === testData;
      
      return {
        status: isWorking ? 'healthy' : 'unhealthy',
        details: {
          algorithm: this.ALGORITHM,
          keyLength: this.KEY_LENGTH,
          testPassed: isWorking,
          hasMasterKey: !!process.env.ENCRYPTION_MASTER_KEY,
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

export default EncryptionService;