import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { generateJWT, verifyJWT, hashToken, type JWTPayload } from "./jwt";

export interface User {
  id: number;
  email: string;
  name: string;
  role: "professional" | "admin";
  created_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

/**
 * Hash de senha usando bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Verifica se a senha corresponde ao hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Armazena sessão do usuário usando JWT
 * O token JWT é armazenado em cookie httpOnly e também no banco de dados
 */
export async function setSession(user: User, tokenHash?: string): Promise<string> {
  const cookieStore = await cookies();
  
  // Gerar JWT com todos os dados necessários
  const jwt = await generateJWT({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });
  
  // Armazenar token no cookie (httpOnly para segurança)
  cookieStore.set("auth_token", jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 dias
  });
  
  // Armazenar email separadamente para exibição (não sensível)
  cookieStore.set("user_email", user.email, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });
  
  // Retornar hash do token para armazenamento no banco (se fornecido)
  // O worker deve salvar este hash na tabela user_sessions
  return tokenHash || await hashToken(jwt);
}

/**
 * Remove sessão do usuário
 */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  cookieStore.delete("user_email");
}

/**
 * Obtém usuário da sessão atual validando o JWT
 * Valida o token e retorna os dados do usuário
 */
export async function getSession(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token");

  if (!token) {
    return null;
  }

  try {
    // Verificar e decodificar JWT
    const payload = await verifyJWT(token.value);
    
    if (!payload) {
      return null;
    }
    
    // Retornar dados do usuário do payload
    return {
      id: payload.userId,
      email: payload.email,
      name: payload.name || "",
      role: payload.role as "professional" | "admin",
      created_at: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Erro ao validar sessão:", error);
    return null;
  }
}

/**
 * Valida se o usuário está autenticado
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session !== null;
}

