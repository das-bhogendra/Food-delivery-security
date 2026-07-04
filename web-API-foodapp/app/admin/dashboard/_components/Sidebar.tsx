"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ADMIN_LINKS = [
  { href: "/", label: "Home" },
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/dashboard/food", label: "Food Items" },
  { href: "/admin/dashboard/orders", label: "Orders" },
  { href: "/admin/dashboard/users", label: "Users" },
  { href: "/admin/dashboard/categories", label: "Categories" },
  { href: "/admin/dashboard/profile", label: "Profile" },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin/dashboard"
      ? pathname === href
      : pathname?.startsWith(href);

  return (
    <aside
      className="
        fixed md:static
        top-0 left-0
        h-screen w-64
        bg-black
        text-white
        z-40 overflow-y-auto
      "
    >
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-800">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-white text-black flex items-center justify-center font-bold text-lg">
            A
          </div>
          <span className="font-semibold text-lg tracking-wide">
            Admin Panel
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {ADMIN_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`
              flex items-center
              px-4 py-2.5
              rounded-lg
              text-sm font-medium
              transition-all duration-200
              ${
                isActive(link.href)
                  ? "bg-white text-black"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }
            `}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
