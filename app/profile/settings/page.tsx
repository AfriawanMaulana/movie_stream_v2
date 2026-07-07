"use client";
import { updateProfile } from "@/app/actions/updateUser";
import { useUserStore } from "@/zustand/userStore";
import { Calendar, CircleCheck, Mail, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function SettingsSkeleton() {
  return (
    <section className="px-5 lg:px-14 pt-32 pb-20 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-secondary/40 text-sm">
          Manage your account preferences
        </p>
      </div>

      {/* Avatar & Name Skeleton */}
      <div className="mt-10 md:mt-14">
        <div className="flex gap-4 items-end">
          <div className="border-3 border-secondary/10 p-0.5 rounded-full">
            <div className="w-18 h-18 md:w-24 md:h-24 flex-shrink-0 rounded-full bg-secondary/10 animate-pulse" />
          </div>
          <div className="pb-1 space-y-2">
            <div className="h-6 md:h-7 w-32 rounded bg-secondary/10 animate-pulse" />
            <div className="h-4 w-40 rounded bg-secondary/10 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full items-start">
        {/* Form Skeleton */}
        <div className="bg-secondary/2 p-4 rounded-2xl space-y-4">
          <h2 className="font-semibold text-lg">Profile Information</h2>
          <div className="flex flex-col space-y-2">
            <label className="text-secondary/50">Display Name</label>
            <div className="w-full h-12 rounded-md bg-secondary/10 animate-pulse" />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-secondary/50">Email</label>
            <div className="w-full h-12 rounded-md bg-secondary/10 animate-pulse" />
          </div>
        </div>

        {/* Account Info Skeleton */}
        <div className="bg-secondary/2 p-4 rounded-2xl grid grid-cols-1 gap-4">
          <h2 className="font-semibold text-lg">Account</h2>
          <div className="w-full h-0.5 bg-secondary/5" />
          <div className="flex justify-between items-center">
            <span className="inline-flex gap-2 items-center text-secondary/40">
              <Mail size={16} /> Email
            </span>
            <div className="h-4 w-28 rounded bg-secondary/10 animate-pulse" />
          </div>
          <div className="w-full h-0.5 bg-secondary/5" />
          <div className="flex justify-between items-center">
            <span className="inline-flex gap-2 items-center text-secondary/40">
              <ShieldCheck size={16} /> Status
            </span>
            <div className="h-6 w-16 rounded-full bg-secondary/10 animate-pulse" />
          </div>
          <div className="w-full h-0.5 bg-secondary/5" />
          <div className="flex justify-between items-center">
            <span className="inline-flex gap-2 items-center text-secondary/40">
              <Calendar size={16} /> Member since
            </span>
            <div className="h-4 w-24 rounded bg-secondary/10 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Button Skeleton */}
      <div className="flex w-full justify-end">
        <div className="h-12 w-40 rounded-lg bg-secondary/10 animate-pulse" />
      </div>
    </section>
  );
}

export default function Page() {
  const { user, fetchUser, setUser } = useUserStore();
  const [form, setForm] = useState({
    displayName: "",
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const MAX_USERNAME_LENGTH = 16;

  useEffect(() => {
    async function init() {
      await fetchUser();
      setLoading(false);
    }
    init();
  }, [fetchUser]);

  useEffect(() => {
    if (user) {
      setForm({
        displayName: user.username,
      });
    }
  }, [user]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "displayName" && value.length > MAX_USERNAME_LENGTH) return;
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isChanged = form.displayName.trim() !== (user?.username ?? "").trim();
  const isSaveDisabled =
    !isChanged || form.displayName.trim() === "" || loading;

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await updateProfile({ username: form.displayName });
      if (res.success) {
        toast.success(res.message);
        setUser({
          ...user!,
          username: form.displayName,
        });
      } else {
        toast.error(res.error);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <SettingsSkeleton />;
  return (
    <section className="px-5 lg:px-14 pt-32 pb-20 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-secondary/40 text-sm">
          Manage your account preferences
        </p>
      </div>

      <div className="mt-10 md:mt-14">
        <div className="flex gap-4 items-end">
          <div className="border-3 border-secondary/10 p-0.5 rounded-full">
            <div className="w-18 h-18 md:w-24 md:h-24 flex flex-shrink-0 justify-center items-center bg-red-500 rounded-full">
              <h2 className="font-semibold text-4xl">{user?.username?.[0]}</h2>
            </div>
          </div>
          <div className="pb-1">
            <h1 className="text-xl md:text-2xl font-bold">
              {form.displayName || user?.username}
            </h1>
            <p className="opacity-70 text-sm md:text-md">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full items-start">
        <form
          onSubmit={handleUpdate}
          id="profile-form"
          className="bg-secondary/2 p-4 rounded-2xl space-y-2"
        >
          <h2 className="font-semibold text-lg">Profile Information</h2>
          <div className="flex flex-col space-y-2">
            <label className="text-secondary/50">Display Name</label>
            <input
              type="text"
              name="displayName"
              value={form.displayName}
              onChange={handleChange}
              maxLength={16}
              className="w-full bg-secondary/5 rounded-md p-3 text-sm md:text-base"
            />
            <span className="text-xs text-secondary/40 text-right">
              {form.displayName.length}/{MAX_USERNAME_LENGTH}
            </span>
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-secondary/50">Email</label>
            <span className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/50" />
              <input
                type="email"
                disabled
                value={user?.email ?? "-"}
                className="w-full bg-secondary/5 rounded-md pl-12 pr-3 py-3 text-secondary/50 cursor-not-allowed text-sm md:text-base"
              />
            </span>
          </div>
        </form>
        <div className="bg-secondary/2 p-4 rounded-2xl grid grid-cols-1 gap-4">
          <h2 className="font-semibold text-lg">Account</h2>
          <div className="w-full h-0.5 bg-secondary/5" />
          <div className="flex justify-between items-center">
            <span className="inline-flex gap-2 items-center text-secondary/40">
              <Mail size={16} /> Email
            </span>
            <p className="text-sm">{user?.email ?? "-"}</p>
          </div>
          <div className="w-full h-0.5 bg-secondary/5" />
          <div className="flex justify-between items-center">
            <span className="inline-flex gap-2 items-center text-secondary/40">
              <ShieldCheck size={16} /> Status
            </span>
            <div className="badge badge-soft badge-success p-2 font-medium">
              Active
            </div>
          </div>
          <div className="w-full h-0.5 bg-secondary/5" />
          <div className="flex justify-between items-center">
            <span className="inline-flex gap-2 items-center text-secondary/40">
              <Calendar size={16} /> Member since
            </span>
            <p className="text-sm text-secondary/50">
              {new Date(user?.createdAt ?? "").toDateString()}
            </p>
          </div>
        </div>
      </div>
      <div className="flex w-full justify-end">
        <button
          type="submit"
          disabled={isSaveDisabled}
          form="profile-form"
          className={`${
            isSaveDisabled ? "bg-secondary/10 text-secondary/50" : "bg-red-500"
          } btn rounded-lg h-12 cursor-pointer disabled:cursor-not-allowed`}
        >
          <CircleCheck /> {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </section>
  );
}
