import Dashboard from "@/app/components/dashboard/Dashboard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Dashboard>{children}</Dashboard>;
}
