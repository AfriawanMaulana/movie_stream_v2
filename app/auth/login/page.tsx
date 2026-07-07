/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Eye, EyeOff, Film } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/app/actions/auth";
import { useUserStore } from "@/zustand/userStore";

export default function Page() {
  const router = useRouter();

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<any>({});
  const [showPassword, setShowPassword] = useState(false);
  const { fetchUser } = useUserStore();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setFieldErrors({});
    setError("");

    const form = new FormData(e.currentTarget);

    const result = await login({
      email: form.get("email") as string,
      password: form.get("password") as string,
    });

    if (!result.success) {
      if (result.fieldErrors) {
        setFieldErrors(result.fieldErrors);
      }

      if (result.error) {
        setError(result.error);
      }

      return;
    }

    await fetchUser();
    router.push("/");
  }

  return (
    <section className="px-5 lg:px-14 py-20 flex w-full min-h-screen h-auto items-center">
      <div className="hidden md:block md:w-1/2 space-y-8">
        <div className="flex items-center gap-4">
          <span className="bg-red-600/20 p-1.5 rounded-md">
            <Film className="text-red-600" />
          </span>
          <Image src={"/logo-2.png"} alt="" width={150} height={150} />
        </div>
        <h1 className="text-5xl font-bold">
          Your next story<br></br> starts here.
        </h1>
        <p className="opacity-50 text-lg w-3/4">
          Explore thousands of movies and series in one place. Find your
          favourites, continue watching, and discover new stories every day.
        </p>
      </div>
      <div className="w-full md:w-1/2 border border-primary-foreground/10 p-4 rounded-2xl">
        <div className="mb-6">
          <h1 className="text-xl font-bold">Welcome Back</h1>
          <p className="opacity-50 text-sm">
            Your watchlist missed you. Pick up where you left off
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-lg border border-red-500 bg-red-500/10 p-3 text-red-500">
              {error}
            </div>
          )}
          <div className="space-y-1">
            <h2 className="font-semibold text-primary-foreground/50 text-sm">
              EMAIL ADDRESS
            </h2>

            <input
              type="email"
              name="email"
              required
              className="px-4 py-3 rounded-lg border border-primary-foreground/20 w-full bg-primary-foreground/5"
            />
            {fieldErrors.email && (
              <p className="text-sm text-red-500">{fieldErrors.email[0]}</p>
            )}
          </div>
          <div className="space-y-1">
            <h2 className="font-semibold text-primary-foreground/50 text-sm">
              PASSWORD
            </h2>

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
          <button className="p-4 rounded-lg w-full bg-red-600 hover:bg-red-700 transition-all duration-300 ease-in-out cursor-pointer">
            Sign In
          </button>
          <p className="flex items-center gap-2 w-full justify-center">
            <span className="opacity-80 text-sm font-light">
              New to TERFLIX?
            </span>
            <Link href={"/auth/register"} className="text-red-600">
              Create account
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
