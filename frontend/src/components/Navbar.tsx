import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md text-gray-800' : 'bg-gray-800 text-white'}`}>
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <span className={`text-xl font-bold transition-all duration-300 ${scrolled ? 'text-indigo-600' : 'text-white'}`}>
                App Template
              </span>
            </Link>
            
            {/* Desktop Menu */}
            <div className="hidden ml-10 md:block">
              <div className="flex items-baseline space-x-4">
                <Link 
                  to="/" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive('/') 
                      ? (scrolled ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-900 text-white') 
                      : (scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 hover:bg-gray-700 hover:text-white')
                  }`}
                >
                  Inicio
                </Link>

                <Link 
                  to="/empleados" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive('/empleados') 
                      ? (scrolled ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-900 text-white') 
                      : (scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 hover:bg-gray-700 hover:text-white')
                  }`}
                >
                  Empleados
                </Link>
              </div>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md ${
                scrolled 
                  ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-100' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              } focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white`}
              aria-expanded="false"
            >
              <span className="sr-only">Abrir menu principal</span>
              {isOpen ? (
                <svg 
                  className="block w-6 h-6" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg 
                  className="block w-6 h-6" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 ${scrolled ? 'bg-white' : 'bg-gray-800'}`}>
          <Link 
            to="/" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/') 
                ? (scrolled ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-900 text-white') 
                : (scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 hover:bg-gray-700 hover:text-white')
            }`}
            onClick={() => setIsOpen(false)}
          >
            Inicio
          </Link>

          <Link 
            to="/empleados" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/empleados') 
                ? (scrolled ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-900 text-white') 
                : (scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 hover:bg-gray-700 hover:text-white')
            }`}
            onClick={() => setIsOpen(false)}
          >
            Empleados
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;