import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Search, Bell, Menu, ChevronDown, User, LogOut, Sparkles, ChevronRight } from "lucide-react";
import {
  Avatar,
  IconButton,
  Dropdown,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
} from "../ui";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../lib/utils";
import { leadsApi, contactsApi, tasksApi } from "../../lib/services";

/* Centered text links — a subset of the primary nav, rendered in a white pill
   exactly like the reference top bar. */
const LINKS = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/leads", label: "Leads" },
  { to: "/pipeline", label: "Pipeline" },
  { to: "/contacts", label: "Contacts" },
  { to: "/tasks", label: "Follow-ups" },
];

export function TopNav({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const [leads, contacts] = await Promise.all([
        leadsApi.list({ search: query }),
        contactsApi.list({ search: query }),
      ]);

      const results = [
        ...(leads.leads || []).map((l) => ({
          type: "lead",
          id: l._id,
          name: l.name,
          company: l.company,
          label: `Lead • ${l.company || "N/A"}`,
        })),
        ...(contacts.contacts || []).map((c) => ({
          type: "contact",
          id: c._id,
          name: c.name,
          company: c.company,
          label: `Contact • ${c.company || "N/A"}`,
        })),
      ];
      setSearchResults(results);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const loadNotifications = async () => {
    setLoadingNotifications(true);
    try {
      const res = await tasksApi.list({ status: "Pending" });
      setNotifications((res.tasks || []).slice(0, 5)); // Show 5 most recent pending tasks
    } catch (err) {
      console.error("Notifications error:", err);
    }
    setLoadingNotifications(false);
  };

  return (
    <header className="flex items-center gap-3">
      {/* Brand */}
      <div className="flex items-center gap-2.5 pr-2">
        <div className="brand-gradient flex h-9 w-9 items-center justify-center rounded-xl text-white">
          <Sparkles className="h-5 w-5" />
        </div>
        <span className="hidden font-display text-lg font-bold text-ink sm:block">
          AI CRM
        </span>
      </div>

      {/* Mobile menu toggle */}
      <button
        onClick={onMenuClick}
        className="rounded-xl p-2 text-ink-soft hover:bg-surface-muted lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Centered nav pill */}
      <nav className="mx-auto hidden items-center gap-1 rounded-full bg-surface p-1.5 shadow-[var(--shadow-soft)] lg:flex">
        {LINKS.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "rounded-full px-5 py-2 text-sm font-medium transition",
                isActive
                  ? "bg-surface-muted text-ink shadow-sm"
                  : "text-ink-soft hover:text-ink"
              )
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Right cluster */}
      <div className="ml-auto flex items-center gap-2">
        {/* Search Button/Input */}
        <div className="relative hidden sm:block">
          <IconButton
            onClick={() => setShowSearch(!showSearch)}
            aria-label="Search"
            className="hidden sm:inline-flex"
          >
            <Search className="h-[18px] w-[18px]" />
          </IconButton>

          {showSearch && (
            <div className="absolute right-0 top-12 w-80 rounded-xl border border-line bg-canvas shadow-lg z-50">
              <input
                autoFocus
                type="text"
                placeholder="Search leads, contacts…"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full rounded-t-xl border-b border-line bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-soft focus:outline-none"
              />
              {searchResults.length > 0 ? (
                <div className="max-h-64 overflow-y-auto">
                  {searchResults.map((result) => (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => {
                        navigate(
                          result.type === "lead"
                            ? `/leads?id=${result.id}`
                            : `/contacts?id=${result.id}`
                        );
                        setShowSearch(false);
                        setSearchQuery("");
                      }}
                      className="w-full border-b border-line px-4 py-2 text-left hover:bg-surface-muted transition"
                    >
                      <p className="font-medium text-sm text-ink">{result.name}</p>
                      <p className="text-xs text-ink-soft">{result.label}</p>
                    </button>
                  ))}
                </div>
              ) : searchQuery ? (
                <div className="px-4 py-8 text-center text-sm text-ink-soft">
                  No results found
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Notifications */}
        <Dropdown
          trigger={
            <button
              onClick={loadNotifications}
              className="relative rounded-full border border-line bg-surface p-2.5 text-ink-soft transition hover:text-ink"
              aria-label="Notifications"
            >
              <Bell className="h-[18px] w-[18px]" />
              {notifications.length > 0 && (
                <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-brand-500 ring-2 ring-surface" />
              )}
            </button>
          }
        >
          <DropdownLabel>Pending Tasks</DropdownLabel>
          <DropdownSeparator />
          {loadingNotifications ? (
            <div className="px-4 py-2 text-sm text-ink-soft">Loading...</div>
          ) : notifications.length > 0 ? (
            <>
              {notifications.map((task) => (
                <DropdownItem
                  key={task._id}
                  onClick={() => navigate("/tasks")}
                  className="flex justify-between items-center"
                >
                  <div>
                    <p className="text-sm font-medium">{task.title}</p>
                    <p className="text-xs text-ink-soft">{task.priority} priority</p>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </DropdownItem>
              ))}
              <DropdownSeparator />
              <DropdownItem onClick={() => navigate("/tasks")}>
                View all tasks
              </DropdownItem>
            </>
          ) : (
            <div className="px-4 py-2 text-sm text-ink-soft">No pending tasks</div>
          )}
        </Dropdown>

        <Dropdown
          trigger={
            <button className="flex items-center gap-2 rounded-full border border-line bg-surface py-1 pl-1 pr-2.5 transition hover:bg-surface-muted">
              <Avatar name={user?.name} src={user?.avatar} size="sm" />
              <ChevronDown className="h-4 w-4 text-ink-soft" />
            </button>
          }
        >
          <DropdownLabel>{user?.email}</DropdownLabel>
          <DropdownSeparator />
          <DropdownItem onClick={() => navigate("/settings")}>
            <User className="h-4 w-4" /> Profile & settings
          </DropdownItem>
          <DropdownItem danger onClick={logout}>
            <LogOut className="h-4 w-4" /> Log out
          </DropdownItem>
        </Dropdown>
      </div>
    </header>
  );
}
