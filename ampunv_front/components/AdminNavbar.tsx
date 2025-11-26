'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api/auth';

export default function AdminNavbar() {
  const router = useRouter();
  const user = authApi.getUser();

  const handleLogout = () => {
    authApi.logout();
    router.push('/login');
  };

  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="shrink-0 flex items-center">
              <Link href="/admin" className="text-xl font-bold">
                Ampunv Admin
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/admin"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium hover:text-gray-300"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/users"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium hover:text-gray-300"
              >
                Utilisateurs
              </Link>
              <Link
                href="/admin/furnitures"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium hover:text-gray-300"
              >
                Meubles
              </Link>
              <Link
                href="/admin/reference-data"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium hover:text-gray-300"
              >
                Données de référence
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            {user && (
              <span className="text-sm mr-4">
                👤 {user.firstname} {user.lastname}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium transition"
              aria-label="Se déconnecter de l'administration"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}