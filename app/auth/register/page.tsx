/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Eye, EyeOff, Film } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { register } from "@/app/actions/auth";
import React from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [fieldErrors, setFieldErrors] = useState<any>({});
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setFieldErrors({});
    setServerError("");

    const form = new FormData(e.currentTarget);

    const result = await register({
      username: form.get("username") as string,
      email: form.get("email") as string,
      password: form.get("password") as string,
      confirmPassword: form.get("confirmPassword") as string,
    });

    if (!result.success) {
      if (result.fieldErrors) {
        setFieldErrors(result.fieldErrors);
      }

      if (result.serverError) {
        setServerError(result.serverError);
      }

      return;
    }

    router.push("/auth/login");
  }
  return (
    <section className="px-5 lg:px-14 py-20 flex w-full mih-h-screen h-auto items-center">
      <div className="hidden md:block md:w-1/2 space-y-8">
        <div className="flex items-center gap-4">
          <span className="bg-red-600/20 p-1.5 rounded-md">
            <Film className="text-red-600" />
          </span>
          <Image src={"/logo-2.png"} alt="" width={150} height={150} />
        </div>
        <h1 className="text-5xl font-bold">
          Unlimited movies & series. One Place.
        </h1>
        <p className="opacity-50 text-lg w-3/4">
          Create your account and unlock a world of movies and series. Save your
          favourites, build your watchlist, and enjoy entertainment made for
          you.
        </p>
      </div>
      <div className="w-full md:w-1/2 border border-primary-foreground/10 p-4 rounded-2xl">
        <div className="mb-6">
          <h1 className="text-xl font-bold">Create Your Account</h1>
          <p className="opacity-50 text-sm">
            Your watchlist missed you. Pick up where you left off
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          {serverError && (
            <div className="rounded-lg border border-red-500 bg-red-500/10 p-3 text-red-500">
              {serverError}
            </div>
          )}
          <div className="space-y-1">
            <label className="font-semibold text-primary-foreground/50 text-sm">
              Email
            </label>

            <input
              name="email"
              type="email"
              className="px-4 py-3 rounded-lg border border-primary-foreground/20 w-full bg-primary-foreground/5"
            />

            {fieldErrors.email && (
              <p className="text-sm text-red-500">{fieldErrors.email[0]}</p>
            )}
          </div>
          <div className="space-y-1">
            <label className="font-semibold text-primary-foreground/50 text-sm">
              Username
            </label>

            <input
              name="username"
              type="text"
              className="px-4 py-3 rounded-lg border border-primary-foreground/20 w-full bg-primary-foreground/5"
            />

            {fieldErrors.username && (
              <p className="text-sm text-red-500">{fieldErrors.username[0]}</p>
            )}
          </div>
          <div className="space-y-1">
            <div className="flex gap-2">
              <label className="font-semibold text-primary-foreground/50 text-sm">
                PASSWORD
              </label>
              <span className="text-sm text-red-500"></span>
            </div>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="px-4 py-3 rounded-lg border border-primary-foreground/20 w-full bg-primary-foreground/5"
              />

              {showPassword ? (
                <EyeOff
                  size={20}
                  onClick={() => setShowPassword(false)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer opacity-50"
                />
              ) : (
                <Eye
                  size={20}
                  onClick={() => setShowPassword(true)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer opacity-50"
                />
              )}
            </div>
            {fieldErrors.password && (
              <p className="text-sm text-red-500">{fieldErrors.password[0]}</p>
            )}
          </div>
          <div className="space-y-1">
            <div className="flex gap-2">
              <label className="font-semibold text-primary-foreground/50 text-sm">
                CONFIRM PASSWORD
              </label>
              <span className="text-sm text-red-500"></span>
            </div>
            <div className="relative">
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                className="px-4 py-3 rounded-lg border border-primary-foreground/20 w-full bg-primary-foreground/5"
              />

              {showConfirmPassword ? (
                <EyeOff
                  size={20}
                  onClick={() => setShowConfirmPassword(false)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer opacity-50"
                />
              ) : (
                <Eye
                  size={20}
                  onClick={() => setShowConfirmPassword(true)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer opacity-50"
                />
              )}
            </div>
            {fieldErrors.confirmPassword && (
              <p className="text-sm text-red-500">
                {fieldErrors.confirmPassword[0]}
              </p>
            )}
          </div>

          <button className="p-4 rounded-lg w-full bg-red-600 hover:bg-red-700 transition-all duration-300 ease-in-out cursor-pointer">
            Create Account
          </button>
          <p className="flex items-center gap-2 w-full justify-center">
            <span className="opacity-80 text-sm font-light">
              Already have an account?
            </span>
            <Link href={"/auth/login"} className="text-red-600">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
