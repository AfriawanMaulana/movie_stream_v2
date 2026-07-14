"use client";
import { useState, useTransition, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import {
  Search,
  Ban,
  Trash2,
  ShieldOff,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  updateUserRole,
  toggleBanUser,
  deleteUser,
} from "@/app/actions/manageUsers";
import Image from "next/image";

type UserRow = {
  id: string;
  username: string;
  email: string;
  role: "user" | "premium" | "admin";
  isBanned: boolean;
  createdAt: Date;
  avatar: string | null;
};

const ROLE_OPTIONS: UserRow["role"][] = ["user", "premium", "admin"];

const roleBadgeStyle: Record<UserRow["role"], string> = {
  admin: "bg-red-500/20 text-red-400 border border-red-500/40",
  premium: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40",
  user: "bg-white/5 text-white/60 border border-white/10",
};

export default function UsersTable({
  users,
  currentPage,
  totalPages,
  initialSearch,
}: {
  users: UserRow[];
  currentPage: number;
  totalPages: number;
  initialSearch: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [localUsers, setLocalUsers] = useState(users);
  const [search, setSearch] = useState(initialSearch);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Sync localUsers setiap kali props users berubah (misal setelah navigasi page)
  useEffect(() => {
    setLocalUsers(users);
  }, [users]);

  const updateQuery = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value) newParams.set(key, value);
      else newParams.delete(key);
    });
    router.push(`${pathname}?${newParams.toString()}`);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateQuery({ search: value, page: "1" }); // reset ke page 1 saat search berubah
    }, 400);
  };

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    updateQuery({ page: String(page) });
  };

  const handleRoleChange = (userId: string, newRole: UserRow["role"]) => {
    startTransition(async () => {
      // updateUserRole only accepts 'user' | 'admin' — map 'premium' to 'user'

      const res = await updateUserRole(userId, newRole);
      if (res.success) {
        setLocalUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
        toast.success(res.message);
      } else {
        toast.error(res.error);
      }
    });
  };

  const handleToggleBan = (userId: string, isBanned: boolean) => {
    startTransition(async () => {
      const res = await toggleBanUser(userId, isBanned);
      if (res.success) {
        setLocalUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, isBanned: !isBanned } : u))
        );
        toast.success(res.message);
      } else {
        toast.error(res.error);
      }
    });
  };

  const handleDelete = (userId: string) => {
    startTransition(async () => {
      const res = await deleteUser(userId);
      if (res.success) {
        setLocalUsers((prev) => prev.filter((u) => u.id !== userId));
        toast.success(res.message);
        router.refresh(); // supaya total count & pagination ikut update
      } else {
        toast.error(res.error);
      }
      setConfirmDelete(null);
    });
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative w-full md:w-80">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Cari username atau email..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-red-500/40 bg-transparent outline-none placeholder:opacity-50"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-secondary/5 text-left">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Joined</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {localUsers.map((user) => (
              <tr
                key={user.id}
                className="border-t border-white/5 hover:bg-secondary/2"
              >
                <td className="p-3 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                    {user.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={user.username}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-semibold">
                        {user.username[0]?.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="font-medium">{user.username}</span>
                </td>
                <td className="p-3 opacity-70">{user.email}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        roleBadgeStyle[user.role]
                      }`}
                    >
                      {user.role}
                    </span>
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(
                          user.id,
                          e.target.value as UserRow["role"]
                        )
                      }
                      disabled={isPending}
                      title="Ubah role"
                      className="text-xs bg-transparent border border-white/10 rounded-md px-2 py-1 disabled:opacity-40"
                    >
                      {ROLE_OPTIONS.map((role) => (
                        <option
                          key={role}
                          value={role}
                          className="bg-background"
                        >
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>
                <td className="p-3">
                  {user.isBanned ? (
                    <span className="text-xs px-2 py-1 rounded-full bg-red-900/30 text-red-500 border border-red-800">
                      Banned
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-1 rounded-full bg-green-900/20 text-green-500 border border-green-800">
                      Active
                    </span>
                  )}
                </td>
                <td className="p-3 opacity-50 text-xs">
                  {new Intl.DateTimeFormat("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }).format(new Date(user.createdAt))}
                </td>
                <td className="p-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleToggleBan(user.id, user.isBanned)}
                      disabled={isPending}
                      title={user.isBanned ? "Unban user" : "Ban user"}
                      className="p-2 rounded-md hover:bg-yellow-500/20 text-yellow-400 disabled:opacity-40"
                    >
                      {user.isBanned ? (
                        <ShieldOff size={16} />
                      ) : (
                        <Ban size={16} />
                      )}
                    </button>
                    <button
                      onClick={() => setConfirmDelete(user.id)}
                      disabled={isPending}
                      title="Hapus user"
                      className="p-2 rounded-md hover:bg-red-500/20 text-red-500 disabled:opacity-40"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {localUsers.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center opacity-50">
                  Tidak ada user ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs opacity-50">
            Halaman {currentPage} dari {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-2 rounded-md border border-white/10 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 ||
                    p === totalPages ||
                    Math.abs(p - currentPage) <= 1
                )
                .map((p, idx, arr) => (
                  <div key={p} className="flex items-center gap-1">
                    {idx > 0 && arr[idx - 1] !== p - 1 && (
                      <span className="opacity-40 px-1">...</span>
                    )}
                    <button
                      onClick={() => goToPage(p)}
                      className={`w-8 h-8 rounded-md text-sm ${
                        p === currentPage
                          ? "bg-red-500 text-white"
                          : "hover:bg-white/5 border border-white/10"
                      }`}
                    >
                      {p}
                    </button>
                  </div>
                ))}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="p-2 rounded-md border border-white/10 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Confirm delete modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-background border border-red-500/40 rounded-xl p-6 w-full max-w-sm space-y-4">
            <h2 className="text-lg font-semibold">Hapus user ini?</h2>
            <p className="text-sm opacity-60">
              Tindakan ini tidak bisa dibatalkan. Semua data terkait user ini
              mungkin akan terpengaruh.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/5"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={isPending}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50"
              >
                {isPending ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
