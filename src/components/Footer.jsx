import React, { useState } from 'react';
import { MapPin, Mail, Phone, Send, Facebook, Instagram, Linkedin, Twitter, Dribbble } from 'lucide-react';

export default function RelianceFooter() {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    // Handle newsletter signup logic here
    setEmail('');
  };

  return (
    <footer className="bg-gray-900 text-white py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info Section */}
          <div className="space-y-6">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-white">RELIANCE</span>
              <div className="relative">
                <div className="w-8 h-6 bg-red-600 rounded-sm transform rotate-12"></div>
                <span className="absolute -bottom-1 left-0 text-xs text-white font-semibold">MOVE</span>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start space-x-3">
              <MapPin className="text-red-600 mt-1 flex-shrink-0" size={20} />
              <div>
                <p className="text-gray-300 leading-relaxed">
                  19 LONGHAYES AVENUE, ROMFORD, RM6 5HB.
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center space-x-3">
              <Mail className="text-red-600 flex-shrink-0" size={20} />
              <a href="mailto:info@reliancemove.com" className="text-gray-300 hover:text-white transition-colors">
                info@reliancemove.com
              </a>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <p className="text-gray-400 text-sm font-medium">FEEL FREE TO CALL US</p>
              <div className="flex items-center space-x-3">
                <div className="bg-red-600 p-2 rounded-sm">
                  <Phone className="text-white" size={20} />
                </div>
                <a href="tel:020-3051-6033" className="text-2xl font-bold text-white hover:text-red-400 transition-colors">
                  020-3051-6033
                </a>
              </div>
            </div>
          </div>

          {/* Our Services Section */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Our Services</h3>
              <div className="w-12 h-0.5 bg-red-600 mb-6"></div>
            </div>
            <nav className="space-y-4">
              <a href="#" className="block text-gray-300 hover:text-white transition-colors">
                Furniture Removals
              </a>
              <a href="#" className="block text-gray-300 hover:text-white transition-colors">
                Piano Removals
              </a>
              <a href="#" className="block text-gray-300 hover:text-white transition-colors">
                Home Removals
              </a>
              <a href="#" className="block text-gray-300 hover:text-white transition-colors">
                Other Removals
              </a>
            </nav>
          </div>

          {/* Quick Links Section */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
              <div className="w-12 h-0.5 bg-red-600 mb-6"></div>
            </div>
            <nav className="space-y-4">
              <a href="#" className="block text-gray-300 hover:text-white transition-colors">
                About Us
              </a>
              <a href="#" className="block text-gray-300 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="block text-gray-300 hover:text-white transition-colors">
                Terms & Conditions
              </a>
            </nav>
          </div>

          {/* Newsletter Section */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Newsletter</h3>
              <div className="w-12 h-0.5 bg-red-600 mb-6"></div>
            </div>
            
            <p className="text-gray-300 text-sm leading-relaxed">
              Subscribe our newsletter to Get the latest news, tips and special offers.
            </p>

            {/* Newsletter Form */}
            <div className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email Address"
                className="flex-1 bg-transparent border border-gray-600 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-600 transition-colors"
              />
              <button
                onClick={handleNewsletterSubmit}
                className="bg-red-600 hover:bg-red-700 px-4 py-3 transition-colors"
              >
                <Send size={20} />
              </button>
            </div>

            {/* Social Media Icons */}
            <div className="flex space-x-4 pt-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Dribbble size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Back to Top Button */}
        <div className="flex justify-end mt-12">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-red-600 hover:bg-red-700 p-3 transition-colors group"
          >
            <svg 
              className="w-6 h-6 text-white transform group-hover:-translate-y-1 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>

      </div>
      {/* Copyright Section */}
        <div className="border-t border-gray-700 mt-8 pt-4">
          <div className=" text-gray-400 text-sm flex justify-center items-end">
            <p>Copyright © 2025 | All Rights are Reserved | Design & Developed by ORBITS Business Solutions Ltd.</p>
          </div>
        </div>
    </footer>
  );
}