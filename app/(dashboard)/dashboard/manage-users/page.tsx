import { getUsersPaginated } from "@/app/actions/manageUsers";
import UsersTable from "@/app/components/dashboard/UserTable";

export const metadata = {
  title: "Manage Users - Dashboard",
};

type Props = {
  searchParams: Promise<{ page?: string; search?: string }>;
};

export default async function ManageUsersPage({ searchParams }: Props) {
  const { page, search } = await searchParams;

  const currentPage = Math.max(1, Number(page) || 1);
  const searchQuery = search || "";

  const result = await getUsersPaginated({
    page: currentPage,
    search: searchQuery,
  });

  return (
    <section className="px-5 lg:px-14 pt-10 pb-20 space-y-6">
      <div className="flex justify-between items-center border-b border-white/20 pb-4">
        <h1 className="text-2xl font-bold">Manage Users</h1>
        <p className="opacity-60 text-sm">{result.total} total users</p>
      </div>

      <UsersTable
        users={result.data}
        currentPage={result.currentPage}
        totalPages={result.totalPages}
        initialSearch={searchQuery}
      />
    </section>
  );
}
