import React, { useState, useEffect, useMemo } from "react";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  LayoutDashboard,
  Trophy,
  ListTodo,
  UserCheck,
  MessageCircle,
  Activity,
  Users,
  LogOut,
  Menu,
  TrashIcon,
  BuildingIcon,
} from "lucide-react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";

const DashboardLeftNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { workspaceId, departmentId } = useParams();

  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // 🔥 FETCH ADMIN STATUS
  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!workspaceId) return;

        const res = await axios.get(
          `/workspace/stats/${workspaceId}`,
          { withCredentials: true }
        );

        setIsAdmin(res.data.isAdmin);
      } catch (err) {
        console.log("Sidebar stats error:", err.response?.data || err.message);
      }
    };

    fetchStats();
  }, [workspaceId]);

  // 🔥 NAV ITEMS
  const navItems = useMemo(() => {
    // ✅ DEPARTMENT LEVEL (Leaderboard-first)
    if (departmentId) {
      return [
        {
          name: "Leaderboard",
          path: `/dashboard/workspace/${workspaceId}/department/${departmentId}`,
          icon: <Trophy size={20} />,
        },
        {
          name: "Tasks",
          path: `/dashboard/workspace/${workspaceId}/department/${departmentId}/tasks`,
          icon: <ListTodo size={20} />,
        },
        {
          name: "My Work",
          path: `/dashboard/workspace/${workspaceId}/department/${departmentId}/my-tasks`,
          icon: <UserCheck size={20} />,
        },
        {
          name: "Chat",
          path: `/dashboard/workspace/${workspaceId}/department/${departmentId}/chat`,
          icon: <MessageCircle size={20} />,
        },
        {
          name: "Activity",
          path: `/dashboard/workspace/${workspaceId}/department/${departmentId}/activity`,
          icon: <Activity size={20} />,
        },
      ];
    }

    // ✅ WORKSPACE LEVEL
    if (workspaceId) {
      return [
        {
          name: "Dashboard",
          path: `/dashboard/workspace/${workspaceId}`,
          icon: <LayoutDashboard size={20} />,
        },
        {
          name: "Departments",
          path: `/dashboard/workspace/${workspaceId}/departments`,
          icon: <BuildingIcon size={20} />,
        },
        {
          name: "Activity Log",
          path: `/dashboard/workspace/${workspaceId}/activity`,
          icon: <Activity size={20} />,
        },
        ...(isAdmin
          ? [
              {
                name: "Delete",
                path: `/dashboard/workspace/${workspaceId}/delete-department`,
                icon: <TrashIcon size={20} />,
              },
            ]
          : []),
      ];
    }

    // ✅ GLOBAL LEVEL
    return [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  {
    name: "Explore",
    path: "/dashboard/explore",
    icon: <Trophy size={20} />,
  },
  {
    name: "Delete",
    path: "/dashboard/delete-workspace",
    icon: <TrashIcon size={20} />,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: <UserCheck size={20} />,
  },
];
  }, [workspaceId, departmentId, isAdmin]);

  // 🔥 LOGOUT
  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout", {}, { withCredentials: true });
      logout();
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

const SidebarContent = () => (
  <div className="h-full flex flex-col bg-white/70 backdrop-blur-2xl border-r border-gray-200">

    {/* 🔥 LOGO */}
    <div className="px-6 py-5">
      <h1
        onClick={() => navigate("/dashboard")}
        className="cursor-pointer text-xl font-bold tracking-tight"
      >
        <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
          CoworkSpace
        </span>
      </h1>
    </div>

    {/* 🔥 PROFILE */}
    <div className="px-4">
      <div className="bg-white border border-gray-200 rounded-2xl px-4 py-4 shadow-sm">

        <div className="flex items-center gap-3">

          <div className="relative">
            <img
              src={user?.profileImage}
              className="w-12 h-12 rounded-xl object-cover border border-gray-200"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold text-gray-900 truncate">
              {user?.name}
            </h2>
            <p className="text-xs text-gray-500 truncate">
              {user?.email}
            </p>
          </div>

        </div>
      </div>
    </div>

    {/* 🔥 DIVIDER */}
    <div className="mx-4 my-4 h-px bg-gray-200" />

    {/* 🔥 NAV SECTION */}
    <div className="flex-1 px-3">

      <p className="px-3 mb-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
        Menu
      </p>

      <ul className="space-y-1">

        {navItems.map((item) => (
          <li key={item.name}>
            <NavLink
              to={item.path}
              end
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <span className="group-hover:scale-110 transition">
                {item.icon}
              </span>

              {item.name}
            </NavLink>
          </li>
        ))}

      </ul>

    </div>

    {/* 🔥 BOTTOM FIXED */}
    <div className="mt-auto p-4 border-t border-gray-200 space-y-3">

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition"
      >
        <LogOut size={18} />
        Logout
      </button>

      <p className="text-[11px] text-gray-400 text-center">
        © 2026 CoworkSpace
      </p>
    </div>

  </div>
);

  return (
    <div className="flex h-screen">
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow"
      >
        <Menu size={22} />
      </button>

      {/* Desktop */}
      <aside className="hidden md:flex w-[260px] bg-[var(--color-bg)] border-r border-gray-200 flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile */}
      {open && (
        <div className="fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-[260px] bg-white h-full flex flex-col">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLeftNav;