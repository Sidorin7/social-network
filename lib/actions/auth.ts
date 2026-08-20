"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signOut } from "@/auth";
import { generateUniqueUsername } from "@/lib/username";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function registerUser(values: z.infer<typeof registerSchema>) {
  const parsed = registerSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: "Invalid input" };
  }
  const existingUser = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });
  if (existingUser) {
    return { success: false, error: "User with this email already exists" };
  }
  const { name, email, password } = parsed.data;

  const hashedPassword = await bcrypt.hash(password, 10);
  const username = await generateUniqueUsername(email);
  await prisma.user.create({ data: { name, email, hashedPassword, username } });
  return { success: true };
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
