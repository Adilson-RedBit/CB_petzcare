import { TOTP } from "otpauth";

export interface OTPConfig {
  secret: string;
  period?: number;
  digits?: number;
  algorithm?: "SHA1" | "SHA256" | "SHA512";
}

export class OTPService {
  private totp: TOTP;

  constructor(config: OTPConfig) {
    this.totp = new TOTP({
      issuer: "PetCare Agenda",
      label: "PetCare",
      algorithm: config.algorithm || "SHA1",
      digits: config.digits || 6,
      period: config.period || 30,
      secret: config.secret,
    });
  }

  /**
   * Gera um código OTP
   */
  generate(): string {
    return this.totp.generate();
  }

  /**
   * Valida um código OTP
   */
  validate(token: string, window?: number): boolean {
    return this.totp.validate({ token, window: window || 1 });
  }

  /**
   * Gera uma URL para QR Code
   */
  getQRCodeURL(): string {
    return this.totp.toString();
  }

  /**
   * Gera um secret aleatório
   */
  static generateSecret(): string {
    return TOTP.generateSecret();
  }
}

/**
 * Gera um código OTP de 6 dígitos para verificação rápida
 * (não usa TOTP, mas sim um código temporário simples)
 */
export function generateVerificationCode(length: number = 6): string {
  const digits = "0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  return code;
}

/**
 * Armazena um código de verificação temporário
 * Em produção, use um banco de dados ou cache (Redis, etc.)
 */
const verificationCodes = new Map<string, { code: string; expiresAt: number }>();

export function storeVerificationCode(
  identifier: string,
  code: string,
  expiresInSeconds: number = 300
): void {
  const expiresAt = Date.now() + expiresInSeconds * 1000;
  verificationCodes.set(identifier, { code, expiresAt });

  // Limpar código expirado
  setTimeout(() => {
    verificationCodes.delete(identifier);
  }, expiresInSeconds * 1000);
}

export function verifyCode(identifier: string, code: string): boolean {
  const stored = verificationCodes.get(identifier);
  if (!stored) {
    return false;
  }

  if (Date.now() > stored.expiresAt) {
    verificationCodes.delete(identifier);
    return false;
  }

  if (stored.code === code) {
    verificationCodes.delete(identifier);
    return true;
  }

  return false;
}

