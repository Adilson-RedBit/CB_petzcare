"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OTPInput } from "./OTPInput";

interface OTPVerificationProps {
  identifier: string;
  onVerify: (code: string) => Promise<boolean>;
  onResend?: () => Promise<void>;
  length?: number;
  title?: string;
  description?: string;
  resendDelay?: number;
}

export function OTPVerification({
  identifier,
  onVerify,
  onResend,
  length = 6,
  title = "Verificação OTP",
  description = "Digite o código de verificação enviado para você",
  resendDelay = 60,
}: OTPVerificationProps) {
  const [code, setCode] = React.useState("");
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isResending, setIsResending] = React.useState(false);
  const [resendTimer, setResendTimer] = React.useState(0);

  React.useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleVerify = async () => {
    if (code.length !== length) {
      setError(`Por favor, digite todos os ${length} dígitos`);
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      const isValid = await onVerify(code);
      if (!isValid) {
        setError("Código inválido. Por favor, tente novamente.");
        setCode("");
      }
    } catch (err) {
      setError("Erro ao verificar código. Por favor, tente novamente.");
      setCode("");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0 || !onResend) return;

    setIsResending(true);
    setError(null);
    setCode("");

    try {
      await onResend();
      setResendTimer(resendDelay);
    } catch (err) {
      setError("Erro ao reenviar código. Por favor, tente novamente.");
    } finally {
      setIsResending(false);
    }
  };

  React.useEffect(() => {
    if (code.length === length) {
      handleVerify();
    }
  }, [code]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <OTPInput
            length={length}
            value={code}
            onChange={setCode}
            disabled={isVerifying}
          />
          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Button
            onClick={handleVerify}
            disabled={isVerifying || code.length !== length}
            className="w-full"
          >
            {isVerifying ? "Verificando..." : "Verificar"}
          </Button>

          {onResend && (
            <Button
              variant="outline"
              onClick={handleResend}
              disabled={isResending || resendTimer > 0}
              className="w-full"
            >
              {isResending
                ? "Reenviando..."
                : resendTimer > 0
                ? `Reenviar em ${resendTimer}s`
                : "Reenviar código"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

