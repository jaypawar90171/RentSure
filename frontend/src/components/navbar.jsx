"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { FileText, Home, Menu, User, X } from "lucide-react"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false) // State for dropdown
  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState(null)
  const [scrolled, setScrolled] = useState(false)

  // Check for user info on component mount
  useEffect(() => {
    const data = localStorage.getItem("user-info")
    if (data) {
      setUserInfo(JSON.parse(data))
    }

    // Add scroll listener
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user-info")
    localStorage.removeItem("token")
    setUserInfo(null)
    navigate("/")
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-sm shadow-md py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center px-6">
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg transform transition-all duration-300 group-hover:rotate-6">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            RentSure
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <div className="flex space-x-6">
            <Link to="/" className="text-gray-700 hover:text-indigo-600 transition-colors text-sm font-medium">
              Home
            </Link>
            <Link to="/properties" className="text-gray-700 hover:text-indigo-600 transition-colors text-sm font-medium">
              Properties
            </Link>
            <Link to="/gemini" className="text-gray-700 hover:text-indigo-600 transition-colors text-sm font-medium">
              Gemini
            </Link>
          </div>
          <div className="relative">
            {userInfo ? (
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-medium">
                  {userInfo.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="text-gray-700 text-sm">{userInfo.name}</span>
              </div>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg border-0"
                  onClick={() => navigate("/login")}
                >
                  Log In
                </Button>
               
              </>
            )}

            {/* Dropdown Menu */}
            {isDropdownOpen && (
    <div
      className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-xl z-50 animate-fade-in
      py-2 transition-all duration-200"
      style={{ minWidth: "10rem" }}
    >
      <button
        onClick={handleLogout}
        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors rounded"
      >
        Logout
      </button>
    </div>
  )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 hover:text-indigo-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg z-50 border-b animate-fade-in rounded-b-2xl">
          <div className="container mx-auto py-4 px-6 flex flex-col space-y-4">
            <Link
              to="/"
              className="text-gray-700 hover:text-indigo-600 transition-colors py-3 flex items-center space-x-3 border-b border-gray-100 pb-3"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link
              to="/properties"
              className="text-gray-700 hover:text-indigo-600 transition-colors py-3 flex items-center space-x-3 border-b border-gray-100 pb-3"
              onClick={() => setIsMenuOpen(false)}
            >
              <FileText className="h-5 w-5" />
              <span>Properties</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}