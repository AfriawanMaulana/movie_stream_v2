"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useUserStore } from "@/zustand/userStore";

export default function TrakteerPopup() {
  const [open, setOpen] = useState(false);
  const [canClose, setCanClose] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const { user, loading } = useUserStore();

  useEffect(() => {
    if (loading) return;
    if (user?.role === "premium" || user?.role === "admin") {
      setOpen(false);
    }
    setOpen(true);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanClose(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [user, loading]);

  const handleClose = () => {
    if (!canClose) return;
    setOpen(false);
  };

  const isSupportVisible =
    !user || (user.role !== "premium" && user.role !== "admin");

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Dialog
      open={open && isSupportVisible}
      onOpenChange={(value) => {
        if (!value && canClose) {
          setOpen(false);
        }
      }}
    >
      <DialogContent
        showCloseButton={canClose}
        onPointerDownOutside={(e) => {
          if (!canClose) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (!canClose) e.preventDefault();
        }}
        className="sm:max-w-md border-none"
      >
        <DialogHeader className="mb-4">
          <DialogTitle className="text-center text-2xl md:text-3xl font-bold bg-linear-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
            Support TERFLIX
          </DialogTitle>
        </DialogHeader>

        <p className="text-center text-secondary/70">
          TERFLIX is an independent project. Your support helps keep the servers
          running and allows me to continue developing new features.
        </p>

        {/* Tombol Trakteer di sini */}
        <div>
          <Link
            href="https://trakteer.id/terry404/tip"
            target="_blank"
            className="inline-flex w-full items-center justify-center gap-2 bg-linear-to-r from-amber-300 to-amber-600 hover:-translate-y-0.5 py-2 rounded-md text-white hover:brightness-110 transition-all duration-300 ease-in-out"
          >
            <Heart size={16} fill="white" /> Support Me
          </Link>
          <button
            onClick={handleClose}
            disabled={!canClose}
            className="py-2 border border-red-600 text-white bg-linear-to-r from-red-600 to-red-900 disabled:opacity-50 hover:scale-101 hover:brightness-110 cursor-pointer rounded-md outline-none w-full mt-4 transition-all duration-300 ease-in-out"
          >
            {canClose ? "Maybe Later" : `Please wait ${countdown}s...`}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
