import { useState } from "react";
import {
  MapPin,
  Mail,
  Search,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Menu,
  X,
  ChevronRight,
  Truck,
} from "lucide-react";
// import logo from '../assets/REA.png';

const Nav = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top contact bar */}
      <div className="bg-gray-800 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <MapPin className="text-red-500 w-4 h-4" />
              <span className="text-sm hidden sm:inline">Location</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="text-red-500 w-4 h-4" />
              <span className="text-sm">info@reliancemove.com</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-white hover:text-red-500 transition-colors">
              <Search className="w-4 h-4" />
            </button>
            <button className="text-white hover:text-red-500 transition-colors">
              <Facebook className="w-4 h-4" />
            </button>
            <button className="text-white hover:text-red-500 transition-colors">
              <Twitter className="w-4 h-4" />
            </button>
            <button className="text-white hover:text-red-500 transition-colors">
              <Instagram className="w-4 h-4" />
            </button>
            <button className="text-white hover:text-red-500 transition-colors">
              <Linkedin className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <nav className="bg-white shadow-md relative z-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-24">
            {/* Logo */}
            {/* <img src={logo} height='10px' width='10px'/> */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-blue-900">
                  RELIANCE
                </span>
                <div className="ml-2">
                  <Truck className="w-8 h-8 text-red-500" />
                </div>
              </div>
              <div className="text-blue-900 font-medium">
                <div className="text-sm leading-none">MOVE</div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#"
                className="text-gray-700 hover:text-blue-900 font-medium transition-colors"
                onClick={(e) => e.preventDefault()}
              >
                HOME
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-blue-900 font-medium transition-colors"
                onClick={(e) => e.preventDefault()}
              >
                SERVICES
              </a>
              
            </div>

            {/* Contact Us Button */}
            <div className="hidden md:flex">
              <div className="flex">
                <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-4 font-semibold transition-colors">
                  CONTACT US
                </button>
                <button className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-3 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-gray-700 hover:text-blue-900 transition-colors"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-2 space-y-2">
              <a
                href="#"
                className="block py-2 text-gray-700 hover:text-blue-900 font-medium transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  closeMobileMenu();
                }}
              >
                HOME
              </a>
              <a
                href="#"
                className="block py-2 text-gray-700 hover:text-blue-900 font-medium transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  closeMobileMenu();
                }}
              >
                SERVICES
              </a>
              <a
                href="#"
                className="block py-2 text-gray-700 hover:text-blue-900 font-medium transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  closeMobileMenu();
                }}
              >
                ABOUT
              </a>
              <a
                href="#"
                className="block py-2 text-gray-700 hover:text-blue-900 font-medium transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  closeMobileMenu();
                }}
              >
                PORTFOLIO
              </a>
              <a
                href="#"
                className="block py-2 text-gray-700 hover:text-blue-900 font-medium transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  closeMobileMenu();
                }}
              >
                BLOG
              </a>
              <div className="pt-2">
                <button
                  className="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-3 font-semibold transition-colors"
                  onClick={closeMobileMenu}
                >
                  CONTACT US
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>


    </>
  );
};

export default Nav;
