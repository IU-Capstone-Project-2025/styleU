import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/color-type", label: "Color Type" },
  { to: "/body-shape", label: "Body Shape" },
  { to: "/login", label: "Login" },
];

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white bg-[#FFFFFF]">
      <div className="items-center">
        <div className="grid grid-cols-5 py-[6px]">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `no-underline text-[#000000] 
                 ${
                   isActive
                     ? "text-[#1A169F] font-semibold after:bg-[#1A169F]"
                     : "text-gray-700 hover:text-[#1A169F]"
                 }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
