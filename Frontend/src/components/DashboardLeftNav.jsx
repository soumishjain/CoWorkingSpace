import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, User, Settings, LogOut } from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";


const DashboardLeftNav = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const {user , logout} = useAuth()

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "About Me",
      path: "/about",
      icon: <User size={20} />,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <Settings size={20} />,
    },
  ];

  const handleLogout = async () => {

    try{
        await axios.post('/api/auth/logout',{},{withCredentials : true})
        logout()
        navigate('/login')
    }catch(err){
        console.error(err)
    }

  }

  return (
    <div className="flex h-screen">
        <aside className="h-screen w-[260px] bg-[var(--color-bg)] border-r border-gray-200 flex flex-col shadow-sm">

      {/* Logo */}
      <div className="px-6 py-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-primary)]">
          CoWorking
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

        <p className="text-sm text-gray-500">Member</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navItems.map((item) => {

            const isActive = location.pathname === item.path;

            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                  
                  ${
                    isActive
                      ? "bg-[var(--color-primary)] text-white shadow-sm"
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

      {/* Bottom section */}
      <div className="p-4 border-t border-gray-200 space-y-3">

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition"
        >
          <LogOut size={20} />
          Logout
        </button>

        <p className="text-xs text-gray-400 text-center">
          © 2026 CoWorking
        </p>

      </div>

    </aside>
    <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <Outlet />
    </main>
    </div>
  );
};

export default DashboardLeftNav;