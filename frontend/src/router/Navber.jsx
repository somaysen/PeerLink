import { NavLink } from "react-router"; // ✅ use react-router-dom, not react-router

function Navbar() {
  const linkClasses =
    "px-4 py-2 rounded-lg transition-all duration-300 hover:bg-blue-100 hover:text-blue-600";

  const activeClasses =
    "bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md";

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center h-16">
        {/* Logo */}
        <div className="text-xl font-bold text-blue-600">P2P Connect</div>

        {/* Nav Links */}
        <div className="flex gap-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? activeClasses : linkClasses
            }
          >
            💬 Chat
          </NavLink>

          <NavLink
            to="/video-call"
            className={({ isActive }) =>
              isActive ? activeClasses : linkClasses
            }
          >
            🎥 Video Call
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
