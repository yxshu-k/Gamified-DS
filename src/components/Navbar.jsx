// src/components/Navbar.jsx
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LogoutConfirm from "./LogoutConfirm";
import ProfilePanel from "./ProfilePanel";
import Avatar from "./Avatar";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfilePanel, setShowProfilePanel] = useState(false);


  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    navigate("/");
    setShowLogoutConfirm(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <>
      <header className="bg-white shadow sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Keep same logo - replace src with your logo file */}
            <img src="/logo.png" alt="Gamified-ds" className="h-10 w-auto" />
            <span className="font-bold text-lg hidden sm:inline">Gamified-ds</span>
          </div>

          {/* Main navigation for medium and large screens */}
          <nav className="hidden md:flex items-center gap-6">
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "text-blue-950 font-semibold" : "text-gray-700"
            }
          >
            About
          </NavLink>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-blue-950 font-semibold" : "text-gray-700"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/stack"
            className={({ isActive }) =>
              isActive ? "text-blue-950 font-semibold" : "text-gray-700"
            }
          >
            Stack
          </NavLink>
          <NavLink
            to="/array"
            className={({ isActive }) =>
              isActive ? "text-blue-950 font-semibold" : "text-gray-700"
            }
          >
            Array
          </NavLink>
          <NavLink
            to="/leaderboard"
            className={({ isActive }) =>
              isActive ? "text-blue-950 font-semibold" : "text-gray-700"
            }
          >
            Leaderboard
          </NavLink>
          <NavLink
            to="/help"
            className={({ isActive }) =>
              isActive ? "text-blue-950 font-semibold" : "text-gray-700"
            }
          >
            Help
          </NavLink>
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowProfilePanel(true)}
                className="flex items-center gap-2 hover:opacity-80 transition"
                title="View Profile"
              >
                <Avatar user={user} size={40} />
                <span className="text-gray-700 hidden lg:inline">
                  {user?.username}
                </span>
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md"
              >
                Logout
              </button>
            </div>
          ) : (
            <NavLink
              to="/login"
              className="bg-blue-950 text-white px-3 py-1 rounded-md"
            >
              Login
            </NavLink>
          )}
        </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              {showMobileMenu ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden bg-white border-t shadow-lg">
            <nav className="container mx-auto px-4 py-4 space-y-2">
              {isAuthenticated && (
                <div className="pb-3 mb-3 border-b">
                  <button
                    onClick={() => {
                      setShowProfilePanel(true);
                      setShowMobileMenu(false);
                    }}
                    className="flex items-center gap-2 w-full"
                  >
                    <Avatar user={user} size={40} />
                    <span className="text-sm font-semibold text-gray-700">👤 {user?.username}</span>
                  </button>
                </div>
              )}
              <NavLink
                to="/"
                onClick={() => setShowMobileMenu(false)}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg ${isActive ? "bg-blue-100 text-blue-900 font-semibold" : "text-gray-700 hover:bg-gray-100"}`
                }
              >
                Home
              </NavLink>
              {isAuthenticated && (
                <NavLink
                  to="/dashboard"
                  onClick={() => setShowMobileMenu(false)}
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-lg ${isActive ? "bg-blue-100 text-blue-900 font-semibold" : "text-gray-700 hover:bg-gray-100"}`
                  }
                >
                  📊 Dashboard
                </NavLink>
              )}
              <NavLink
                to="/stack"
                onClick={() => setShowMobileMenu(false)}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg ${isActive ? "bg-blue-100 text-blue-900 font-semibold" : "text-gray-700 hover:bg-gray-100"}`
                }
              >
                Stack
              </NavLink>
              <NavLink
                to="/array"
                onClick={() => setShowMobileMenu(false)}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg ${isActive ? "bg-blue-100 text-blue-900 font-semibold" : "text-gray-700 hover:bg-gray-100"}`
                }
              >
                Array
              </NavLink>
              <NavLink
                to="/leaderboard"
                onClick={() => setShowMobileMenu(false)}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg ${isActive ? "bg-blue-100 text-blue-900 font-semibold" : "text-gray-700 hover:bg-gray-100"}`
                }
              >
                Leaderboard
              </NavLink>
              <NavLink
                to="/about"
                onClick={() => setShowMobileMenu(false)}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg ${isActive ? "bg-blue-100 text-blue-900 font-semibold" : "text-gray-700 hover:bg-gray-100"}`
                }
              >
                About
              </NavLink>
              <NavLink
                to="/help"
                onClick={() => setShowMobileMenu(false)}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg ${isActive ? "bg-blue-100 text-blue-900 font-semibold" : "text-gray-700 hover:bg-gray-100"}`
                }
              >
                Help
              </NavLink>
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-semibold"
                >
                  🚪 Logout
                </button>
              ) : (
                <NavLink
                  to="/login"
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold text-center"
                >
                  Login
                </NavLink>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Logout Confirmation Modal */}
      <LogoutConfirm
        isOpen={showLogoutConfirm}
        onClose={cancelLogout}
        onConfirm={confirmLogout}
      />

      {/* Profile Panel */}
      <ProfilePanel
        isOpen={showProfilePanel}
        onClose={() => setShowProfilePanel(false)}
      />
    </>
  );
}
