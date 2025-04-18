import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { FileText, Home, Menu, User, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

  // Check for user info on component mount
  useState(() => {
    const data = localStorage.getItem('user-info');
    if (data) {
      setUserInfo(JSON.parse(data));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user-info');
    localStorage.removeItem('token');
    setUserInfo(null);
    navigate('/');
  };

  return (
    <nav className="bg-white border-b shadow-sm py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <FileText className="h-6 w-6 text-rentsure-600" />
          <span className="font-bold text-xl text-rentsure-800">RentSure</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <div className="flex space-x-4">
            <Link to="/" className="text-gray-600 hover:text-rentsure-600 transition-colors">
              Home
            </Link>
            <Link to="/landlord" className="text-gray-600 hover:text-rentsure-600 transition-colors">
              Landlord
            </Link>
            <Link to="/tenant" className="text-gray-600 hover:text-rentsure-600 transition-colors">
              Tenant
            </Link>
            <Link to="/contracts" className="text-gray-600 hover:text-rentsure-600 transition-colors">
              Contracts
            </Link>
          </div>
          <div className="flex space-x-2">
            {userInfo ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">{userInfo.name}</span>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white text-gray-600 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Log Out
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="bg-white text-gray-600 hover:bg-gray-100"
                onClick={() => navigate('/login')}
              >
                Log In
              </Button>
            )}
          </div>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-600" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-md z-50 border-b animate-fade-in">
          <div className="container mx-auto py-4 px-6 flex flex-col space-y-4">
            <Link to="/" className="text-gray-600 hover:text-rentsure-600 transition-colors py-2 flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link to="/landlord" className="text-gray-600 hover:text-rentsure-600 transition-colors py-2 flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
              <User className="h-4 w-4" />
              <span>Landlord</span>
            </Link>
            <Link to="/tenant" className="text-gray-600 hover:text-rentsure-600 transition-colors py-2 flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
              <User className="h-4 w-4" />
              <span>Tenant</span>
            </Link>
            <Link to="/contracts" className="text-gray-600 hover:text-rentsure-600 transition-colors py-2 flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
              <FileText className="h-4 w-4" />
              <span>Contracts</span>
            </Link>
            <div className="flex flex-col space-y-2 pt-2 border-t">
              {userInfo ? (
                <>
                  <div className="text-center py-2">{userInfo.name}</div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                  >
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      navigate('/login');
                      setIsMenuOpen(false);
                    }}
                  >
                    Log In
                  </Button>
                  <Button size="sm" className="w-full bg-rentsure-600 hover:bg-rentsure-700">
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}