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
    ChevronDown,
    Truck,
} from "lucide-react";
import logo from './assets/REA.png';

const Nav = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const toggleServicesDropdown = () => {
        setIsServicesDropdownOpen(!isServicesDropdownOpen);
    };

    const closeServicesDropdown = () => {
        setIsServicesDropdownOpen(false);
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
                        <img src={logo} height='200px' width='200px'/>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <a
                                href="#"
                                className="text-gray-700 hover:text-blue-900 font-medium transition-colors"
                                onClick={(e) => e.preventDefault()}
                            >
                                HOME
                            </a>
                            <div className="relative">
                                <button
                                    className="flex items-center space-x-1 text-gray-700 hover:text-blue-900 font-medium transition-colors"
                                    onClick={toggleServicesDropdown}
                                    onMouseEnter={() => setIsServicesDropdownOpen(true)}
                                    onMouseLeave={() => setIsServicesDropdownOpen(false)}
                                >
                                    <span>SERVICES</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${isServicesDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                
                                {/* Services Dropdown */}
                                {isServicesDropdownOpen && (
                                    <div 
                                        className="absolute top-full left-0 mt-2 w-56 bg-white shadow-lg border border-gray-200 rounded-lg z-50"
                                        onMouseEnter={() => setIsServicesDropdownOpen(true)}
                                        onMouseLeave={() => setIsServicesDropdownOpen(false)}
                                    >
                                        <div className="py-2">
                                            <a
                                                href="#"
                                                className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-900 transition-colors"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    closeServicesDropdown();
                                                }}
                                            >
                                                HOME REMOVALS
                                            </a>
                                            <a
                                                href="#"
                                                className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-900 transition-colors"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    closeServicesDropdown();
                                                }}
                                            >
                                                FURNITURE REMOVALS
                                            </a>
                                            <a
                                                href="#"
                                                className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-900 transition-colors"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    closeServicesDropdown();
                                                }}
                                            >
                                                PIANO REMOVALS
                                            </a>
                                            <a
                                                href="#"
                                                className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-900 transition-colors"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    closeServicesDropdown();
                                                }}
                                            >
                                                OTHER REMOVALS
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
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
                            <div>
                                <button
                                    className="flex items-center justify-between w-full py-2 text-gray-700 hover:text-blue-900 font-medium transition-colors"
                                    onClick={toggleServicesDropdown}
                                >
                                    <span>SERVICES</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${isServicesDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isServicesDropdownOpen && (
                                    <div className="ml-4 mt-2 space-y-1">
                                        <a
                                            href="#"
                                            className="block py-2 text-sm text-gray-600 hover:text-blue-900 transition-colors"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                closeMobileMenu();
                                            }}
                                        >
                                            HOME REMOVALS
                                        </a>
                                        <a
                                            href="#"
                                            className="block py-2 text-sm text-gray-600 hover:text-blue-900 transition-colors"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                closeMobileMenu();
                                            }}
                                        >
                                            FURNITURE REMOVALS
                                        </a>
                                        <a
                                            href="#"
                                            className="block py-2 text-sm text-gray-600 hover:text-blue-900 transition-colors"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                closeMobileMenu();
                                            }}
                                        >
                                            PIANO REMOVALS
                                        </a>
                                        <a
                                            href="#"
                                            className="block py-2 text-sm text-gray-600 hover:text-blue-900 transition-colors"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                closeMobileMenu();
                                            }}
                                        >
                                            OTHER REMOVALS
                                        </a>
                                    </div>
                                )}
                            </div>
                            
                            
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