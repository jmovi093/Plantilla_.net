import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  
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

  const handleLogout = () => {
    logout();
    setIsOpen(false); // Cerrar menú móvil si está abierto
    navigate('/login'); // Redirigir al login
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md text-gray-800' : 'bg-gray-800 text-white'}`}>
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center flex-shrink-0">
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
                  to="/dashboard" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive('/') || isActive('/dashboard')
                      ? (scrolled ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-900 text-white') 
                      : (scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 hover:bg-gray-700 hover:text-white')
                  }`}
                >
                  Inicio
                </Link>
                
                {isAuthenticated && (
                  <Link 
                    to="/departments" 
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      isActive('/departments') 
                        ? (scrolled ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-900 text-white') 
                        : (scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 hover:bg-gray-700 hover:text-white')
                    }`}
                  >
                    Departamentos
                  </Link>
                )}
              </div>
            </div>
          </div>
          
          {/* User section - Desktop */}
          <div className="hidden md:block">
            <div className="flex items-center ml-4 md:ml-6">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className={`text-sm font-medium ${scrolled ? 'text-gray-700' : 'text-gray-300'}`}>
                    Hola, {user?.userName}
                  </span>
                  <button
                    onClick={handleLogout}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      scrolled 
                        ? 'text-red-600 hover:bg-red-50 hover:text-red-700' 
                        : 'text-red-300 hover:bg-red-900 hover:text-white'
                    }`}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="w-4 h-4 mr-2" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link 
                    to="/login" 
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      scrolled 
                        ? 'text-gray-700 hover:bg-gray-100' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link 
                    to="/register" 
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      scrolled 
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                        : 'bg-indigo-500 text-white hover:bg-indigo-600'
                    }`}
                  >
                    Registrarse
                  </Link>
                </div>
              )}
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
              <span className="sr-only">Abrir menú principal</span>
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

      {/* Mobile menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 ${scrolled ? 'bg-white' : 'bg-gray-800'}`}>
          <Link 
            to="/" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/') || isActive('/dashboard')
                ? (scrolled ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-900 text-white') 
                : (scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 hover:bg-gray-700 hover:text-white')
            }`}
            onClick={() => setIsOpen(false)}
          >
            Inicio
          </Link>

          {isAuthenticated && (
            <Link 
              to="/departments" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/departments') 
                  ? (scrolled ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-900 text-white') 
                  : (scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 hover:bg-gray-700 hover:text-white')
              }`}
              onClick={() => setIsOpen(false)}
            >
              Departamentos
            </Link>
          )}

          {/* User section - Mobile */}
          {isAuthenticated ? (
            <div className={`border-t pt-4 mt-4 ${scrolled ? 'border-gray-200' : 'border-gray-700'}`}>
              <div className={`px-3 py-2 text-base font-medium ${scrolled ? 'text-gray-700' : 'text-gray-300'}`}>
                Hola, {user?.userName}
              </div>
              <button
                onClick={handleLogout}
                className={`flex items-center w-full px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                  scrolled 
                    ? 'text-red-600 hover:bg-red-50 hover:text-red-700' 
                    : 'text-red-300 hover:bg-red-900 hover:text-white'
                }`}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="w-5 h-5 mr-3" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <div className={`border-t pt-4 mt-4 space-y-1 ${scrolled ? 'border-gray-200' : 'border-gray-700'}`}>
              <Link 
                to="/login" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Iniciar Sesión
              </Link>
              <Link 
                to="/register" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  scrolled 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                    : 'bg-indigo-500 text-white hover:bg-indigo-600'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;