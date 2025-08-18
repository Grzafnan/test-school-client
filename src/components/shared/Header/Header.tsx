"use client"
import Cookies from "js-cookie";

import { useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai"
import { useAppDispatch, useAppSelector } from "../../../redux/hooks"
import { logout } from "../../../redux/api/authApi/authSlice"
import { toast } from "sonner"

const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { accessToken, user } = useAppSelector((state) => state.auth);

  const menus = [
    { name: "Home", href: "/" },
    { name: "Assessment", href: "/assessment" },
    { name: "History", href: "/history" },
    { name: "Services", href: "/services" },
    { name: "Dashboard", href: "/dashboard" }
  ]

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen)
  }

  const handleLogout = () => {
    dispatch(logout());
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    toast.success("Logged out successfully");
    navigate("/login");

  }

  return (
    <header className="bg-white shadow-lg relative">
      <div className="max-w-screen-xl px-4 sm:px-6 lg:px-8" style={{ margin: "0 auto" }}>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="md:flex md:items-center md:gap-12">
            <Link className="block text-teal-600" to="/">
              <span className="sr-only">Home</span>
              <svg className="h-8" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M0.41 10.3847C1.14777 7.4194 2.85643 4.7861 5.2639 2.90424C7.6714 1.02234 10.6393 0 13.695 0C16.7507 0 19.7186 1.02234 22.1261 2.90424C24.5336 4.7861 26.2422 7.4194 26.98 10.3847H25.78C23.7557 10.3549 21.7729 10.9599 20.11 12.1147C20.014 12.1842 19.9138 12.2477 19.81 12.3047H19.67C19.5662 12.2477 19.466 12.1842 19.37 12.1147C17.6924 10.9866 15.7166 10.3841 13.695 10.3841C11.6734 10.3841 9.6976 10.9866 8.02 12.1147C7.924 12.1842 7.8238 12.2477 7.72 12.3047H7.58C7.4762 12.2477 7.376 12.1842 7.28 12.1147C5.6171 10.9599 3.6343 10.3549 1.61 10.3847H0.41ZM23.62 16.6547C24.236 16.175 24.9995 15.924 25.78 15.9447H27.39V12.7347H25.78C24.4052 12.7181 23.0619 13.146 21.95 13.9547C21.3243 14.416 20.5674 14.6649 19.79 14.6649C19.0126 14.6649 18.2557 14.416 17.63 13.9547C16.4899 13.1611 15.1341 12.7356 13.745 12.7356C12.3559 12.7356 11.0001 13.1611 9.86 13.9547C9.2343 14.416 8.4774 14.6649 7.7 14.6649C6.9226 14.6649 6.1657 14.416 5.54 13.9547C4.4144 13.1356 3.0518 12.7072 1.66 12.7347H0V15.9447H1.61C2.39051 15.924 3.154 16.175 3.77 16.6547C4.908 17.4489 6.2623 17.8747 7.65 17.8747C9.0377 17.8747 10.392 17.4489 11.53 16.6547C12.1468 16.1765 12.9097 15.9257 13.69 15.9447C14.4708 15.9223 15.2348 16.1735 15.85 16.6547C16.9901 17.4484 18.3459 17.8738 19.735 17.8738C21.1241 17.8738 22.4799 17.4484 23.62 16.6547ZM23.62 22.3947C24.236 21.915 24.9995 21.664 25.78 21.6847H27.39V18.4747H25.78C24.4052 18.4581 23.0619 18.886 21.95 19.6947C21.3243 20.156 20.5674 20.4049 19.79 20.4049C19.0126 20.4049 18.2557 20.156 17.63 19.6947C16.4899 18.9011 15.1341 18.4757 13.745 18.4757C12.3559 18.4757 11.0001 18.9011 9.86 19.6947C9.2343 20.156 8.4774 20.4049 7.7 20.4049C6.9226 20.4049 6.1657 20.156 5.54 19.6947C4.4144 18.8757 3.0518 18.4472 1.66 18.4747H0V21.6847H1.61C2.39051 21.664 3.154 21.915 3.77 22.3947C4.908 23.1889 6.2623 23.6147 7.65 23.6147C9.0377 23.6147 10.392 23.1889 11.53 22.3947C12.1468 21.9165 12.9097 21.6657 13.69 21.6847C14.4708 21.6623 15.2348 21.9135 15.85 22.3947C16.9901 23.1884 18.3459 23.6138 19.735 23.6138C21.1241 23.6138 22.4799 23.1884 23.62 22.3947Z"
                  fill="currentColor"
                />
              </svg>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <nav aria-label="Global">
              <ul className="flex items-center gap-6 text-sm">
                {menus.map((menu, index) => (
                  <li key={index}>
                    <NavLink
                      className={({ isActive }) =>
                        `font-medium transition-all duration-200 relative ${isActive ? "text-teal-600" : "text-gray-500 hover:text-gray-700"
                        }`
                      }
                      to={menu.href}
                      end={menu.href === "/"}
                    >
                      {({ isActive }) => (
                        <>
                          {menu.name}
                          {/* Active indicator line */}
                          {isActive && (
                            <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-teal-600 rounded-full animate-in slide-in-from-bottom-1 duration-200" />
                          )}
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Desktop Auth Buttons & Mobile Menu Button */}
          <div className="flex items-center gap-4">
            {/* Desktop Auth Buttons */}


            {
              accessToken && user ? (
                <div className="hidden md:relative md:block">
                  <button
                    type="button"
                    onClick={toggleProfileMenu}
                    className="overflow-hidden rounded-full border border-gray-300 shadow-inner"
                  >
                    <span className="sr-only">Toggle dashboard menu</span>

                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCWOFXk4y0sZ1sdcBEEHKGdmAFXuSpafSP1Q&s"
                      alt=""
                      className="size-10 object-cover"
                    />
                  </button>

                  <div
                    className={`${isProfileOpen ? "block" : "hidden"} absolute end-0 z-10 mt-0.5 w-56 divide-y divide-gray-100 rounded-md border border-gray-100 bg-white shadow-lg`}
                    role="menu"
                  >
                    <div className="p-2">
                      <a
                        href="#"
                        className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                        role="menuitem"
                      >
                        My profile
                      </a>

                      <a
                        href="#"
                        className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                        role="menuitem"
                      >
                        Billing summary
                      </a>

                      <a
                        href="#"
                        className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                        role="menuitem"
                      >
                        Team settings
                      </a>

                      <button
                        type="submit"
                        className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                        role="menuitem"
                        onClick={handleLogout}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
                          />
                        </svg>

                        Logout
                      </button>
                    </div>
                  </div>
                </div>

              ) : (
                <div className="hidden sm:flex sm:gap-4">
                  <NavLink
                    className={({ isActive }) =>
                      `rounded-md px-5 py-2.5 text-sm font-medium shadow-sm transition-colors ${isActive ? "bg-teal-700 text-white" : "bg-teal-600 text-white hover:bg-teal-700"
                      }`
                    }
                    to="/login"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    className={({ isActive }) =>
                      `rounded-md px-5 py-2.5 text-sm font-medium transition-colors ${isActive
                        ? "bg-gray-200 text-teal-700 border-2 border-teal-600"
                        : "bg-gray-100 text-teal-600 hover:bg-gray-200"
                      }`
                    }
                    to="/register"
                  >
                    Register
                  </NavLink>
                </div>
              )
            }

            {/* Mobile Menu Button */}
            <div className="block md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="rounded-sm bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75 hover:bg-gray-200"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <AiOutlineClose className="h-5 w-5" /> : <AiOutlineMenu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={closeMobileMenu} />
      )}


      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 md:hidden ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <Link className="text-teal-600" to="/" onClick={closeMobileMenu}>
              <svg className="h-8" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M0.41 10.3847C1.14777 7.4194 2.85643 4.7861 5.2639 2.90424C7.6714 1.02234 10.6393 0 13.695 0C16.7507 0 19.7186 1.02234 22.1261 2.90424C24.5336 4.7861 26.2422 7.4194 26.98 10.3847H25.78C23.7557 10.3549 21.7729 10.9599 20.11 12.1147C20.014 12.1842 19.9138 12.2477 19.81 12.3047H19.67C19.5662 12.2477 19.466 12.1842 19.37 12.1147C17.6924 10.9866 15.7166 10.3841 13.695 10.3841C11.6734 10.3841 9.6976 10.9866 8.02 12.1147C7.924 12.1842 7.8238 12.2477 7.72 12.3047H7.58C7.4762 12.2477 7.376 12.1842 7.28 12.1147C5.6171 10.9599 3.6343 10.3549 1.61 10.3847H0.41ZM23.62 16.6547C24.236 16.175 24.9995 15.924 25.78 15.9447H27.39V12.7347H25.78C24.4052 12.7181 23.0619 13.146 21.95 13.9547C21.3243 14.416 20.5674 14.6649 19.79 14.6649C19.0126 14.6649 18.2557 14.416 17.63 13.9547C16.4899 13.1611 15.1341 12.7356 13.745 12.7356C12.3559 12.7356 11.0001 13.1611 9.86 13.9547C9.2343 14.416 8.4774 14.6649 7.7 14.6649C6.9226 14.6649 6.1657 14.416 5.54 13.9547C4.4144 13.1356 3.0518 12.7072 1.66 12.7347H0V15.9447H1.61C2.39051 15.924 3.154 16.175 3.77 16.6547C4.908 17.4489 6.2623 17.8747 7.65 23.6147C9.0377 17.8747 10.392 17.4489 11.53 16.6547C12.1468 16.1765 12.9097 15.9257 13.69 15.9447C14.4708 15.9223 15.2348 16.1735 15.85 16.6547C16.9901 17.4484 18.3459 17.8738 19.735 17.8738C21.1241 17.8738 22.4799 17.4484 23.62 16.6547ZM23.62 22.3947C24.236 21.915 24.9995 21.664 25.78 21.6847H27.39V18.4747H25.78C24.4052 18.4581 23.0619 18.886 21.95 19.6947C21.3243 20.156 20.5674 20.4049 19.79 20.4049C19.0126 20.4049 18.2557 20.156 17.63 19.6947C16.4899 18.9011 15.1341 18.4757 13.745 18.4757C12.3559 18.4757 11.0001 18.9011 9.86 19.6947C9.2343 20.156 8.4774 20.4049 7.7 20.4049C6.9226 20.4049 6.1657 20.156 5.54 19.6947C4.4144 18.8757 3.0518 18.4472 1.66 18.4747H0V21.6847H1.61C2.39051 21.664 3.154 21.915 3.77 22.3947C4.908 23.1889 6.2623 23.6147 7.65 23.6147C9.0377 23.6147 10.392 23.1889 11.53 22.3947C12.1468 21.9165 12.9097 21.6657 13.69 21.6847C14.4708 21.6623 15.2348 21.9135 15.85 22.3947C16.9901 23.1884 18.3459 23.6138 19.735 23.6138C21.1241 23.6138 22.4799 23.1884 23.62 22.3947Z"
                  fill="currentColor"
                />
              </svg>
            </Link>
            <button
              onClick={closeMobileMenu}
              className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
              aria-label="Close mobile menu"
            >
              <AiOutlineClose className="h-6 w-6" />
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-2">
              {menus.map((menu, index) => (
                <li key={index}>
                  <NavLink
                    className={({ isActive }) =>
                      `block py-3 px-4 text-lg font-medium rounded-lg transition-all duration-200 relative ${isActive
                        ? "text-teal-600 bg-teal-50 border-l-4 border-teal-600"
                        : "text-gray-700 hover:text-teal-600 hover:bg-gray-50"
                      }`
                    }
                    to={menu.href}
                    end={menu.href === "/"}
                    onClick={closeMobileMenu}
                  >
                    {({ isActive }) => (
                      <div className="flex items-center justify-between">
                        <span>{menu.name}</span>
                        {isActive && <div className="w-2 h-2 bg-teal-600 rounded-full animate-pulse" />}
                      </div>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile Auth Buttons */}
          <div className="p-4 border-t border-gray-200 flex flex-col gap-3">
            <NavLink
              className={({ isActive }) =>
                `block w-full text-center rounded-md px-5 py-3 text-sm font-medium shadow-sm transition-colors ${isActive ? "bg-teal-700 text-white" : "bg-teal-600 text-white hover:bg-teal-700"
                }`
              }
              to="/login"
              onClick={closeMobileMenu}
            >
              Login
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `block w-full text-center rounded-md px-5 py-3 text-sm font-medium transition-colors ${isActive
                  ? "bg-gray-200 text-teal-700 border-2 border-teal-600"
                  : "bg-gray-100 text-teal-600 hover:bg-gray-200"
                }`
              }
              to="/register"
              onClick={closeMobileMenu}
            >
              Register
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
