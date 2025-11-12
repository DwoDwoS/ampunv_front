'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import { useState } from 'react';

export default function PublicNavbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = authApi.getUser();
  const isAuthenticated = authApi.isAuthenticated();

  const handleLogout = () => {
    authApi.logout();
    router.push('/login');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">AMPUNV</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Accueil
            </Link>
            <Link
              href="/catalog"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Catalogue
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              À propos
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-700">
                  👤 {user?.firstname}
                </span>
                {user?.role === 'ADMIN' ? (
                  <Link
                    href="/admin"
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
                  >
                    Admin
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    Mon espace
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-blue-600 hover:text-blue-800 transition"
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Devenir vendeur
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link
                href="/catalog"
                className="text-gray-700 hover:text-blue-600 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Catalogue
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-blue-600 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                À propos
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mon espace
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-blue-600 hover:text-blue-800 transition text-center border border-blue-600 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Devenir vendeur
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}