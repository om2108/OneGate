import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  BellIcon,
  ChevronDownIcon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getProfile } from "../../api/profile";
import logo from "../../assets/logo.svg";
import { motion } from "framer-motion";

export default function Header({ setSidebarOpen, setDrawerOpen }) {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const avatarRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialQ = params.get("search") || "";

  // local state for search boxes
  const [q, setQ] = useState(initialQ);
  const [qMobile, setQMobile] = useState(initialQ);

  useEffect(() => {
    const current = new URLSearchParams(location.search).get("search") || "";
    setQ(current);
    setQMobile(current);
  }, [location.search]);

  useEffect(() => {
    if (!user?.id) return;
    let mounted = true;
    (async () => {
      setLoadingProfile(true);
      try {
        const data = await getProfile(user.id);
        if (mounted) setProfile(data);
      } catch (e) {
        console.error("❌ Failed to load profile:", e);
      } finally {
        if (mounted) setLoadingProfile(false);
      }
    })();
    return () => { mounted = false; };
  }, [user?.id]);

  useEffect(() => {
    const onClick = (e) => {
      if (!avatarRef.current) return;
      if (!avatarRef.current.contains(e.target)) setMenuOpen(false);
    };
    if (menuOpen) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  const displayName = useMemo(
    () => profile?.fullName || user?.name || user?.email || "User",
    [profile?.fullName, user?.name, user?.email]
  );
  const displayRole = useMemo(
    () => (profile?.role ? String(profile.role).toLowerCase() : ""),
    [profile?.role]
  );

  const initial =
    profile?.fullName?.[0] || user?.name?.[0] || user?.email?.[0] || "U";
  const showImage = !!profile?.image && !imgError;

  const submitSearch = (term) => {
    const termTrim = term.trim();
    const inDashboard =
      location.pathname.startsWith("/dashboard/owner") ||
      location.pathname.startsWith("/dashboard/secretary") ||
      location.pathname.startsWith("/dashboard/watchman") ||
      location.pathname.startsWith("/dashboard/member") ||
      location.pathname.startsWith("/dashboard/user");

    const base = inDashboard ? location.pathname : "/dashboard/user";
    const next = new URLSearchParams(location.search);
    if (termTrim) next.set("search", termTrim);
    else next.delete("search");
    navigate(`${base}?${next.toString()}`, { replace: false });
  };

  const onSubmitDesktop = (e) => {
    e.preventDefault();
    submitSearch(q);
  };
  const onSubmitMobile = (e) => {
    e.preventDefault();
    submitSearch(qMobile);
  };
  const clearDesktop = () => {
    setQ("");
    submitSearch("");
  };

  return (
    <motion.header
      className="sticky top-0 z-50 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60"
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
    >
      <div className="h-0.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500" />
      <div className="px-3 sm:px-6">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-3 border-b border-gray-200">
          {/* Left: Burger + Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition"
              onClick={() => setSidebarOpen((prev) => !prev)}
              aria-label="Toggle sidebar"
            >
              <Bars3Icon className="h-6 w-6 text-gray-700" />
            </button>
            <img src={logo} alt="Logo" className="h-7 sm:h-9 object-contain" />
          </div>

          {/* Center: Search (desktop) */}
          <div className="hidden sm:flex flex-1 justify-center max-w-xl w-full">
            <form onSubmit={onSubmitDesktop} className="relative w-full">
              <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="search"
                placeholder="Search residents, properties, notices..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full pl-10 pr-10 py-2 rounded-full border border-gray-300 bg-gray-50 text-sm text-gray-800
                  focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition"
              />
              {q && (
                <button
                  type="button"
                  onClick={clearDesktop}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100"
                  aria-label="Clear"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-500" />
                </button>
              )}
            </form>
          </div>

          {/* Right: Actions + Profile */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button className="sm:hidden p-2 rounded-md hover:bg-gray-100" aria-label="Search">
              <MagnifyingGlassIcon className="h-6 w-6 text-gray-600" />
            </button>

            <motion.button
              className="relative p-2 rounded-md hover:bg-gray-100"
              aria-label="Notifications"
              whileTap={{ scale: 0.96 }}
            >
              <BellIcon className="h-6 w-6 text-gray-600" />
              <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </motion.button>

            {/* Profile */}
            <div ref={avatarRef} className="relative">
              <motion.button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full pl-1 pr-2 py-1 hover:bg-gray-100 transition"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                onMouseDown={(e) => e.preventDefault()}
                onClickCapture={() => setDrawerOpen?.(true)}
                whileTap={{ scale: 0.98 }}
              >
                {loadingProfile ? (
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-200 animate-pulse" />
                ) : showImage ? (
                  <img
                    src={profile.image}
                    alt="Profile"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-white shadow-sm"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="w-9 h-9 sm:w-10 sm:h-10 grid place-items-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white ring-2 ring-white shadow-sm">
                    {initial ? (
                      <span className="font-semibold">{String(initial).toUpperCase()}</span>
                    ) : (
                      <UserCircleIcon className="w-6 h-6" />
                    )}
                  </div>
                )}
                <div className="hidden md:flex flex-col items-start leading-tight max-w-[160px]">
                  <span className="text-sm font-semibold text-gray-900 truncate">{displayName}</span>
                  <span className="text-[11px] text-gray-500 capitalize truncate">{displayRole}</span>
                </div>
                <ChevronDownIcon className="hidden sm:block h-4 w-4 text-gray-500" />
              </motion.button>

              {menuOpen && (
                <div role="menu" className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                  <div className="px-4 py-3 border-b">
                    <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
                    {displayRole && <p className="text-xs text-gray-500 capitalize truncate">{displayRole}</p>}
                  </div>
                  <button className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50" onClick={() => setDrawerOpen?.(true)}>View Profile</button>
                  <button className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50" onClick={() => alert("Coming soon")}>Settings</button>
                  <a href="/logout" className="block px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50">Logout</a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="sm:hidden py-2">
          <form onSubmit={onSubmitMobile} className="relative block" aria-label="Mobile search">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="search"
              placeholder="Search…"
              value={qMobile}
              onChange={(e) => setQMobile(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-300 bg-gray-50 text-sm text-gray-800
                focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition"
            />
          </form>
        </div>
      </div>
    </motion.header>
  );
}
