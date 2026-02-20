"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, PartyPopper, Users, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/matches", label: "Wedstrijden", icon: Calendar },
  { href: "/events", label: "Events", icon: PartyPopper },
  { href: "/team", label: "Team", icon: Users },
  { href: "/profile", label: "Profiel", icon: UserCircle },
];

export function NavigationBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-neutral-200 bg-white/95 backdrop-blur-md">
      <div className="flex h-16 items-center justify-around">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5 rounded-xl px-3 py-1.5 text-xs transition-colors",
                isActive
                  ? "text-primary-700 font-semibold"
                  : "text-neutral-400 hover:text-neutral-600"
              )}
            >
              <div
                className={cn(
                  "flex size-8 items-center justify-center rounded-full transition-colors",
                  isActive && "bg-primary-100"
                )}
              >
                <item.icon className={cn("size-5", isActive && "text-primary-700")} />
              </div>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
