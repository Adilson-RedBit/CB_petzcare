"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OTPVerification } from "@/components/otp/OTPVerification";

export default function OTPAuthPage() {
  const router = useRouter();
  const [step, setStep] = useState<"request" | "verify">("request");
  const [identifier, setIdentifier] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao enviar código");
      }

      setStep("verify");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao enviar código");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (code: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Código inválido");
      }

      // Autenticação bem-sucedida
      // Aqui você pode salvar o token/sessão e redirecionar
      router.push("/professional");
      return true;
    } catch (err) {
      return false;
    }
  };

  const handleResend = async () => {
    await handleRequestOTP(new Event("submit") as any);
  };

  if (step === "verify") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <OTPVerification
          identifier={identifier}
          onVerify={handleVerify}
          onResend={handleResend}
          title="Verificação de Código"
          description={`Digite o código enviado para ${identifier}`}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Autenticação OTP</CardTitle>
          <CardDescription>
            Digite seu telefone ou email para receber um código de verificação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRequestOTP} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identifier">Telefone ou Email</Label>
              <Input
                id="identifier"
                type="text"
                placeholder="(11) 99999-9999 ou email@exemplo.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Enviando..." : "Enviar Código"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

