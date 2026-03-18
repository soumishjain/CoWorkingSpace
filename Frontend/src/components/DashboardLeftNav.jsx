import React, { useState, useEffect } from "react";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  Bell,
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

  // 🔥 LOCAL STATE (FIX)
  const [isAdmin, setIsAdmin] = useState(false);

  // 🔥 DIRECT FETCH (NO CUSTOM STATE)
  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!workspaceId) return;

        const res = await axios.get(
          `/workspace/workspace-stats/${workspaceId}`,
          { withCredentials: true }
        );

        setIsAdmin(res.data.isAdmin);
      } catch (err) {
        console.error("Sidebar stats error:", err);
      }
    };

    fetchStats();
  }, [workspaceId]);

  console.log("IS ADMIN:", isAdmin);

  // 🔥 NAV ITEMS
  let navItems = [];

  // 🔴 Department Level
  if (departmentId) {
    navItems = [
      {
        name: "Dashboard",
        path: `/dashboard/workspace/${workspaceId}/department/${departmentId}`,
        icon: <LayoutDashboard size={20} />,
      },
      {
        name: "Members",
        path: `/dashboard/workspace/${workspaceId}/department/${departmentId}/members`,
        icon: <Bell size={20} />,
      },
      {
        name: "Tasks",
        path: `/dashboard/workspace/${workspaceId}/department/${departmentId}/tasks`,
        icon: <Settings size={20} />,
      },
    ];
  }

  // 🟡 Workspace Level
  else if (workspaceId) {
    navItems = [
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
        icon: <Bell size={20} />,
      },

      // 🔥 ADMIN ONLY
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

  // 🔵 Global Level
  else {
    navItems = [
      {
        name: "Dashboard",
        path: "/dashboard",
        icon: <LayoutDashboard size={20} />,
      },
      {
        name: "Notifications",
        path: "/about",
        icon: <Bell size={20} />,
      },
      {
        name: "Delete",
        path: "/dashboard/delete-workspace",
        icon: <TrashIcon size={20} />,
      },
      {
        name: "Settings",
        path: "/settings",
        icon: <Settings size={20} />,
      },
    ];
  }

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
    <>
      {/* Logo */}
      <div className="px-6 flex justify-center py-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-[var(--color-primary)]">
          CoworkSpace
        </h1>
      </div>

      {/* Profile */}
      <div className="flex flex-col items-center py-8 border-b border-gray-200">
        <img
          className="h-20 w-20 rounded-full object-cover border-2 border-[var(--color-primary)]"
          src={user?.profileImage}
          alt="avatar"
        />

        <h2 className="mt-3 font-semibold text-lg text-[var(--color-text)]">
          {user?.name}
        </h2>

        <p className="text-sm text-gray-500">
          {departmentId
            ? "Department"
            : workspaceId
            ? isAdmin
              ? "Admin"
              : "Member"
            : "User"}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);

            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                  ${
                    isActive
                      ? "bg-[var(--color-primary)] text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-gray-200 space-y-3">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
        >
          <LogOut size={20} />
          Logout
        </button>

        <p className="text-xs text-gray-400 text-center">
          © 2026 CoWorking
        </p>
      </div>
    </>
  );

  return (
    <div className="flex h-screen">

      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow"
      >
        <Menu size={22} />
      </button>

      <aside className="hidden md:flex w-[260px] bg-[var(--color-bg)] border-r border-gray-200 flex-col">
        <SidebarContent />
      </aside>

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

      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <Outlet />
      </main>

    </div>
  );
};

export default DashboardLeftNav;