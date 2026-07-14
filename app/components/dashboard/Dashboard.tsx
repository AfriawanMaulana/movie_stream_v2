"use client";
import { HomeIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Home", icon: HomeIcon, exact: true },
  {
    href: "/dashboard/manage-users",
    label: "Users",
    icon: UsersIcon,
    exact: false,
  },
];

export default function Dashboard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (href: string, exact: boolean) => {
    return exact ? pathname === href : pathname.startsWith(href);
  };

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content bg-[#121212] text-white min-h-screen">
        {/* Navbar */}
        <nav className="navbar w-full bg-[#1a1a1a] border-b border-white/10">
          <label
            htmlFor="my-drawer-4"
            aria-label="open sidebar"
            className="btn btn-square btn-ghost hover:bg-red-600/20"
          >
            {/* Sidebar toggle icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2"
              fill="none"
              stroke="currentColor"
              className="my-1.5 inline-block size-4"
            >
              <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
              <path d="M9 4v16"></path>
              <path d="M14 10l2 2l-2 2"></path>
            </svg>
          </label>
          <div className="px-4 font-semibold">Dashboard</div>
        </nav>
        {/* Page content here */}
        <div className="p-4">{children}</div>
      </div>

      <div className="drawer-side is-drawer-close:overflow-visible">
        <label
          htmlFor="my-drawer-4"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="flex min-h-full flex-col items-start bg-[#1a1a1a] border-r border-white/10 is-drawer-close:w-14 is-drawer-open:w-64">
          {/* Sidebar content here */}
          <ul className="menu w-full grow gap-1 p-2">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href, item.exact);
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`is-drawer-close:tooltip is-drawer-close:tooltip-right gap-4 rounded-lg transition-colors ${
                      active
                        ? "bg-red-600 text-white hover:bg-red-600"
                        : "text-white/60 hover:bg-red-600/10 hover:text-white"
                    }`}
                    data-tip={item.label}
                  >
                    <Icon size={20} />
                    <span className="is-drawer-close:hidden">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
