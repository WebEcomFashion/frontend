"use client";

import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoSearch } from "react-icons/io5";
import { FaCartPlus } from "react-icons/fa";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import { CgProfile } from "react-icons/cg";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Logo from "../components/Logo";
import type { AppDispatch, RootState } from "../redux/store";
import { logoutUserThunk } from "../redux/thunks/authThunks";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const signOut = useSignOut();
  const totalQuantity = useSelector((state: RootState) =>
    state.cartR.cartItems.reduce((total, item) => total + item.quantity, 0)
  );
  const isLoggedIn = useSelector(
    (state: RootState) => state.authR.authenticated
  );
  const userRole = useSelector((state: RootState) => state.authR.userRole);

  const deleteCookie = (name: string) => {
    document.cookie = `${name}=; Max-Age=0; path=/;`;
    document.cookie = `${name}_state=; Max-Age=0; path=/;`;
    document.cookie = `${name}_type=; Max-Age=0; path=/;`;
  };

  const handleLogout = () => {
    signOut();
    dispatch(logoutUserThunk());
    deleteCookie("_auth");
    navigate("/");
  };

  useEffect(() => {}, [isLoggedIn]);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          <Logo />

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-8 text-sm font-medium">
            <NavLink
              className="text-gray-600 hover:text-black transition-colors relative"
              to={"/"}
            >
              Home
            </NavLink>
            <NavLink
              className="text-gray-600 hover:text-black transition-colors relative"
              to={"/collection"}
            >
              Collection
            </NavLink>

            <NavLink
              className="text-gray-600 hover:text-black transition-colors relative"
              to={"/about"}
            >
              About
            </NavLink>

            {isLoggedIn && userRole === "Admin" && (
              <NavLink
                className="text-gray-600 hover:text-black transition-colors relative"
                to={"/dashboard/admin"}
              >
                Dashboard
              </NavLink>
            )}
          </ul>

          {/* Right Side Icons */}
          <div className="flex items-center gap-6">
           
            <div className="group relative">
              <Link to={"/login"}>
                <CgProfile className="w-5 h-5 text-gray-600 hover:text-black transition-colors" />
              </Link>
              {isLoggedIn && (
                <div className="group-hover:block hidden absolute right-0 pt-4">
                  <div className="flex flex-col gap-1 w-40 py-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <Link to={"/profile"}>
                      <p className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                        My Profile
                      </p>
                    </Link>
                    <Link to={"/orders"}>
                      <p className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                        Orders
                      </p>
                    </Link>
                    {userRole === "Admin" && (
                      <Link to={"/dashboard/admin"}>
                        <p className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                          Admin Dashboard
                        </p>
                      </Link>
                    )}
                    <button onClick={handleLogout} className="w-full text-left">
                      <p className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                        Logout
                      </p>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <Link to="/cart" className="relative">
              <FaCartPlus className="w-5 h-5 text-gray-600 hover:text-black transition-colors" />
              {totalQuantity > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {totalQuantity}
                </span>
              )}
            </Link>

            <button
              onClick={() => setVisible(true)}
              className="md:hidden text-gray-600 hover:text-black transition-colors"
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 bottom-0 bg-white transition-all duration-300 ease-in-out z-50 ${
          visible ? "w-full sm:w-80" : "w-0"
        } overflow-hidden shadow-2xl`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <span className="space-grotesk text-xl font-bold">Menu</span>
            <button
              onClick={() => setVisible(false)}
              className="text-gray-600 hover:text-black transition-colors"
            >
              <CloseIcon />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col p-4">
              {[
                { name: "Home", path: "/" },
                { name: "Collection", path: "/collection" },
                { name: "About", path: "/about" },
              ].map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setVisible(false)}
                  className="py-4 px-4 text-gray-700 hover:bg-gray-50 hover:text-black transition-colors rounded-lg"
                >
                  {item.name}
                </Link>
              ))}
              {isLoggedIn && userRole === "Admin" && (
                <Link
                  to="/dashboard/admin"
                  onClick={() => setVisible(false)}
                  className="py-4 px-4 text-gray-700 hover:bg-gray-50 hover:text-black transition-colors rounded-lg"
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {visible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setVisible(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
