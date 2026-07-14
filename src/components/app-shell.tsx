import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  BookMarked,
  FileUp,
  Library,
  TicketPercent,
  TrendingUp,
  BarChart3,
  Landmark,
  LifeBuoy,
  ChevronDown,
  Sun,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  LogOut,
  Settings,
  UserCircle,
  ShoppingBag,
  Store,
  FileEdit,
  Users,
  GraduationCap,
  Building2,
  Inbox,
  Image as ImageIcon
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useTheme } from "@/hooks/theme-context";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationsPopover } from "@/components/notifications-popover";

type NavItem = {
  label: string;
  icon: LucideIcon;
  to: string;
  badge?: string;
};

type NavSection = { heading: string; items: NavItem[] };

function isActivePath(pathname: string, to: string) {
  if (to === "/") return pathname === "/";
  if (to === "/library-admin" || to === "/publisher") {
    return pathname === to;
  }
  return pathname === to || pathname.startsWith(`${to}/`);
}

function getSections(pathname: string): NavSection[] {
  if (pathname.startsWith("/library-admin")) {
    return [
      {
        heading: "Main",
        items: [
          { label: "Dashboard", icon: LayoutDashboard, to: "/library-admin" },
          { label: "Catalogue", icon: BookMarked, to: "/library-admin/catalogue" },
          { label: "Orders", icon: ShoppingBag, to: "/library-admin#orders" },
          { label: "Book Store", icon: Store, to: "/library-admin#book-store" },
          { label: "Manage eBook", icon: FileEdit, to: "/library-admin#manage-ebook" },
          { label: "Library Users", icon: Users, to: "/library-admin#users" },
        ],
      },
      {
        heading: "Academic",
        items: [
          { label: "Courses", icon: GraduationCap, to: "/library-admin#courses" },
          { label: "Departments", icon: Building2, to: "/library-admin#departments" },
        ],
      },
      {
        heading: "Requests & Ads",
        items: [
          { label: "Requests", icon: Inbox, to: "/library-admin#requests" },
          { label: "Banners", icon: ImageIcon, to: "/library-admin#banners" },
        ],
      },
      {
        heading: "Reports & Utilities",
        items: [
          { label: "Reports", icon: BarChart3, to: "/library-admin#reports" },
          { label: "Support", icon: LifeBuoy, to: "/library-admin#support" },
        ],
      },
    ];
  }

  return [
    {
      heading: "Main",
      items: [
        { label: "Dashboard", icon: LayoutDashboard, to: "/publisher" },
        { label: "My Catalogue", icon: BookMarked, to: "/publisher/catalogue/" },
        { label: "Catalogue Import", icon: FileUp, to: "/publisher/catalogue-import/" },
        { label: "eBook Bundles", icon: Library, to: "/publisher/bundles/", badge: "New" },
        { label: "Promo Codes", icon: TicketPercent, to: "/publisher/promo-codes/" },
      ],
    },
    {
      heading: "Reports",
      items: [
        { label: "Margin Report", icon: TrendingUp, to: "/publisher/margin-report" },
        { label: "Sales Report", icon: BarChart3, to: "/publisher/sales-report" },
      ],
    },
    {
      heading: "Payment",
      items: [{ label: "Bank Accounts", icon: Landmark, to: "/publisher/bank-accounts" }],
    },
    {
      heading: "Utilities",
      items: [{ label: "Support", icon: LifeBuoy, to: "/publisher/support" }],
    },
  ];
}

function Logo() {
  return (
    <div className="w-[31px] h-[31px] overflow-hidden relative flex items-center justify-start shrink-0">
      <img src="/logo.png" alt="PixelBooks Logo Icon" className="h-[26px] max-w-none" />
    </div>
  );
}

const COLLAPSE_KEY = "pb.sidebar.collapsed";

function useCollapsed() {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(COLLAPSE_KEY) === "1";
  });
  useEffect(() => {
    if (typeof window !== "undefined")
      window.localStorage.setItem(COLLAPSE_KEY, collapsed ? "1" : "0");
  }, [collapsed]);
  return { collapsed, setCollapsed };
}

function SidebarBrand({ collapsed }: { collapsed: boolean }) {
  const { pathname } = useLocation();
  const isLibraryAdmin = pathname.startsWith("/library-admin");
  return (
    <div
      className={[
        "flex items-center gap-3 px-4 pt-6 pb-6",
        collapsed ? "justify-center px-3" : "px-6",
      ].join(" ")}
    >
      {collapsed ? (
        <Link to="/" id="sidebar-logo-link-collapsed" className="flex items-center justify-center shrink-0">
          <Logo />
        </Link>
      ) : (
        <div className="flex min-w-0 items-center gap-2">
          <Link to="/" id="sidebar-logo-link-expanded" className="flex shrink-0">
            <img src="/logo.png" alt="PixelBooks Logo" className="h-[31px] object-contain" />
          </Link>
          <span
            className="shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold"
            style={{
              backgroundColor: isLibraryAdmin
                ? "color-mix(in oklab, oklch(0.55 0.13 260) 12%, transparent)"
                : "var(--sidebar-highlight)",
              color: isLibraryAdmin
                ? "oklch(0.55 0.13 260)"
                : "var(--sidebar-accent-foreground)",
            }}
          >
            {isLibraryAdmin ? "Library Admin" : "Publisher"}
          </span>
        </div>
      )}
    </div>
  );
}

function NavRow({
  item,
  active,
  collapsed,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  const content = (
    <Link
      to={item.to}
      onClick={onNavigate}
      className={[
        "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14.5px] font-medium transition-all",
        collapsed ? "justify-center" : "",
        active
          ? "text-sidebar-accent-foreground shadow-sm"
          : "text-sidebar-foreground/85 hover:bg-secondary hover:text-sidebar-foreground",
      ].join(" ")}
      style={
        active
          ? {
              backgroundColor: "var(--sidebar-highlight)",
              boxShadow: "0 6px 20px -12px var(--brand-glow)",
            }
          : undefined
      }
    >
      {active && !collapsed && (
        <span
          className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full"
          style={{ backgroundColor: "var(--brand)" }}
        />
      )}
      <Icon
        size={19}
        strokeWidth={active ? 2.25 : 1.9}
        className={active ? "" : "text-muted-foreground group-hover:text-sidebar-foreground"}
        style={active ? { color: "var(--sidebar-highlight-icon)" } : undefined}
      />
      {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
      {!collapsed && item.badge && (
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
          style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
        >
          {item.badge}
        </span>
      )}
    </Link>
  );
  if (!collapsed) return content;
  return (
    <Tooltip delayDuration={100}>
      <TooltipTrigger asChild>{content}</TooltipTrigger>
      <TooltipContent side="right" className="flex items-center gap-2">
        {item.label}
        {item.badge && (
          <span
            className="rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase"
            style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
          >
            {item.badge}
          </span>
        )}
      </TooltipContent>
    </Tooltip>
  );
}

function SidebarBody({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const { pathname } = useLocation();
  const currentSections = getSections(pathname);
  return (
    <TooltipProvider delayDuration={100}>
      <nav className="flex-1 overflow-y-auto px-3">
        {currentSections.map((section) => (
          <div key={section.heading} className="mb-6">
            {!collapsed ? (
              <div className="flex items-center gap-2 px-3 pb-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {section.heading}
                </span>
                <span className="h-px flex-1 bg-border" />
              </div>
            ) : (
              <div className="mx-3 mb-2 h-px bg-border" />
            )}
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.label}>
                  <NavRow
                    item={item}
                    active={isActivePath(pathname, item.to)}
                    collapsed={collapsed}
                    onNavigate={onNavigate}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </TooltipProvider>
  );
}

function ProfileDropdown() {
  const { pathname } = useLocation();
  const isLibraryAdmin = pathname.startsWith("/library-admin");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-lg border border-border bg-card px-2 py-1.5 text-left transition-colors hover:bg-secondary hover:border-border/80">
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
            style={{
              backgroundColor: "var(--sidebar-highlight)",
              color: "var(--brand)",
            }}
          >
            AR
          </span>
          <span className="hidden min-w-0 sm:block">
            <span className="block truncate text-sm font-semibold text-foreground">
              Anya Ramanathan
            </span>
            <span className="block truncate text-[11px] text-muted-foreground">
              {isLibraryAdmin ? "Library Admin · Pro" : "Publisher · Pro"}
            </span>
          </span>
          <ChevronDown size={14} className="hidden text-muted-foreground sm:block" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end" className="w-56">
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile">
            <UserCircle size={16} className="mr-2" /> Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings">
            <Settings size={16} className="mr-2" /> Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/" id="profile-dropdown-btn-switch-workspace">
            <LayoutDashboard size={16} className="mr-2" /> Switch Workspace
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut size={16} className="mr-2" /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SidebarFooter({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="border-t border-sidebar-border px-3 py-3">
      {!collapsed && <p className="text-center text-[10px] text-muted-foreground">v2.1.12</p>}
    </div>
  );
}

function DesktopSidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  return (
    <aside
      className="hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 md:sticky md:top-0 md:flex"
      style={{ width: collapsed ? 72 : 280 }}
    >
      <div className="flex items-center justify-between">
        <SidebarBrand collapsed={collapsed} />
        <button
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="mr-2 flex h-11 w-11 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </div>
      <SidebarBody collapsed={collapsed} />
      <SidebarFooter collapsed={collapsed} />
    </aside>
  );
}

function MobileSidebar({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="flex w-[280px] flex-col bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
      >
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <SidebarBrand collapsed={false} />
        <SidebarBody collapsed={false} onNavigate={() => onOpenChange(false)} />
        <SidebarFooter collapsed={false} />
      </SheetContent>
    </Sheet>
  );
}

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

export function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const { collapsed, setCollapsed } = useCollapsed();
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <DesktopSidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
      <MobileSidebar open={mobileOpen} onOpenChange={setMobileOpen} />
      <main className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
        <header className="sticky top-0 z-10 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-background/85 px-4 py-4 backdrop-blur md:px-8 md:py-5">
          <div className="flex min-w-0 items-center gap-3">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:text-foreground md:hidden"
                  aria-label="Open menu"
                >
                  <Menu size={18} />
                </button>
              </SheetTrigger>
            </Sheet>
            <div className="min-w-0">
              <h1 className="truncate text-xl font-semibold tracking-tight md:text-2xl">{title}</h1>
              {subtitle && (
                <p className="mt-0.5 hidden truncate text-sm text-muted-foreground sm:block">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2 md:gap-3">
            <ThemeToggle />
            <NotificationsPopover />
            <ProfileDropdown />
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
