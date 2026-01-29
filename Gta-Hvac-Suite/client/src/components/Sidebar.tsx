import { Link, useLocation } from "wouter";
import { LayoutDashboard, Users, CreditCard, Settings, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSettings } from "@/hooks/use-settings";

export function Sidebar() {
  const [location] = useLocation();
  const { data: settings } = useSettings();

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/leads", label: "Lead Manager", icon: Users },
    { href: "/pricing", label: "Pricing & Plans", icon: CreditCard },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="h-screen w-64 bg-[#080d1a] border-r border-white/5 flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          {settings?.logoUrl ? (
            <img src={settings.logoUrl} alt="Logo" className="w-8 h-8 rounded object-cover" />
          ) : (
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
          )}
          <h1 className="font-display font-bold text-lg leading-tight text-white">
            {settings?.companyName || "Ambient Twin"}
          </h1>
        </div>
        <div className="mt-2 text-xs font-medium text-blue-400 uppercase tracking-wider">
          GTA HVAC Edition
        </div>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer group",
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 transition-colors",
                    isActive ? "text-white" : "text-gray-500 group-hover:text-white"
                  )}
                />
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 m-4 rounded-xl bg-gradient-to-br from-blue-900/50 to-indigo-900/50 border border-blue-500/20">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-semibold text-blue-200">System Online</span>
        </div>
        <p className="text-[10px] text-blue-300/70">
          Connected to GTA Grid (IESO)
          <br />
          Latency: 12ms
        </p>
      </div>
    </div>
  );
}
