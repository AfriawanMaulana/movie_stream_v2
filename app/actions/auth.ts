"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { registerSchema, loginSchema } from "@/db/validation";
import { createClient } from "@/lib/supabase/server";
import { eq } from "drizzle-orm";

export async function register(data: {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  const supabase = createClient();
  const validation = registerSchema.safeParse(data);

  if (!validation.success) {
    return {
      success: false,
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  const { username, email, password } = validation.data;

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existingUser) {
    return {
      success: false,
      fieldErrors: {
        email: "Email already exists.",
      },
    };
  }

  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
    },
  });

  if (error) {
    return {
      success: false,
      serverError: error.message || "Failed to create user",
    };
  }

  if (!authData.user) {
    return {
      success: false,
      serverError: "Failed to create user",
    };
  }

  return {
    success: true,
  };
}

export async function login(data: { email: string; password: string }) {
  const supabase = createClient();
  const validation = loginSchema.safeParse(data);

  if (!validation.success) {
    return {
      success: false,
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validation.data;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
  };
}

export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    return {
      success: false,
      error: error.message,
      message: "Failed to sign out",
    };
  }

  return {
    success: true,
    message: "Successfully signed out",
  };
}
