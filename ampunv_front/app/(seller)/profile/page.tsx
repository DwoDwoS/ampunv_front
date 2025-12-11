'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import PublicNavbar from '@/components/layout/PublicNavbar';
import Footer from '@/components/layout/Footer';
import { authApi } from '@/lib/api/auth';
import { userApi } from '@/lib/api/users';
import { referenceApi } from '@/lib/api/reference';
import { User, City } from '@/types';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'danger'>('profile');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [cityId, setCityId] = useState<number>(0);
  const [profileSaving, setProfileSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, citiesData] = await Promise.all([
          userApi.getMyProfile(),
          referenceApi.getCities(),
        ]);
        
        setUser(userData);
        setFirstname(userData.firstname);
        setLastname(userData.lastname);
        setEmail(userData.email);
        setCityId(userData.cityId);
        setCities(citiesData);
        setError(null);
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'Impossible de charger votre profil';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstname.trim() || !lastname.trim() || !email.trim() || !cityId) {
      alert('Tous les champs sont obligatoires');
      return;
    }

    try {
      setProfileSaving(true);
      const updatedUser = await userApi.updateMyProfile({
        firstname,
        lastname,
        email,
        cityId,
      });
      
      setUser(updatedUser);
      
      const currentUser = authApi.getUser();
      if (currentUser) {
        authApi.saveAuth({
          token: authApi.getToken() || '',
          type: 'Bearer',
          userId: updatedUser.id,
          email: updatedUser.email,
          firstname: updatedUser.firstname,
          lastname: updatedUser.lastname,
          role: updatedUser.role,
        });
      }
      
      alert('Profil mis à jour avec succès !');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('Tous les champs sont obligatoires');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    
    if (newPassword.length < 8) {
      alert('Le nouveau mot de passe doit contenir au moins 8 caractères');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      alert('Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial (@#$%^&+=!)');
      return;
    }

    try {
      setPasswordSaving(true);
      await userApi.updatePassword({
        currentPassword,
        newPassword,
      });
      
      alert('Mot de passe mis à jour avec succès !');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erreur lors de la mise à jour du mot de passe');
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'SUPPRIMER') {
      alert('Veuillez taper "SUPPRIMER" pour confirmer');
      return;
    }

    if (!confirm('Êtes-vous absolument sûr ? Cette action est irréversible et supprimera toutes vos annonces.')) {
      return;
    }

    try {
      setDeleting(true);
      await userApi.deleteMyAccount();
      
      authApi.logout();
      router.push('/');
      alert('Votre compte a été supprimé avec succès');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erreur lors de la suppression du compte');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <PublicNavbar />
        <main className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </main>
        <Footer />
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <PublicNavbar />
        <main className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur de chargement</h3>
              <p className="text-sm text-gray-500 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                aria-label="Réessayer le chargement du profil"
              >
                Réessayer
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <PublicNavbar />
      
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Mon profil</h1>
            <p className="mt-2 text-gray-600">Gérez vos informations personnelles</p>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('profile')}
                  aria-label="Afficher les informations personnelles"
                  className={`py-4 px-6 text-sm font-medium border-b-2 ${
                    activeTab === 'profile'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Informations personnelles
                </button>
                <button
                  onClick={() => setActiveTab('password')}
                  aria-label="Afficher le formulaire de changement de mot de passe"
                  className={`py-4 px-6 text-sm font-medium border-b-2 ${
                    activeTab === 'password'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Mot de passe
                </button>
                <button
                  onClick={() => setActiveTab('danger')}
                  aria-label="Afficher les options de suppression de compte"
                  className={`py-4 px-6 text-sm font-medium border-b-2 ${
                    activeTab === 'danger'
                      ? 'border-red-600 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Supprimer son compte
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'profile' && (
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prénom *
                      </label>
                      <input
                        type="text"
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                        className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom *
                      </label>
                      <input
                        type="text"
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                        className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ville *
                    </label>
                    <select
                      value={cityId}
                      onChange={(e) => setCityId(Number(e.target.value))}
                      className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Sélectionnez une ville</option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={profileSaving}
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      aria-label="Enregistrer les modifications du profil"
                    >
                      {profileSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                    </button>
                  </div>
                </form>
              )}

              {activeTab === 'password' && (
                <form onSubmit={handlePasswordUpdate} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mot de passe actuel *
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nouveau mot de passe *
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      minLength={8}
                      required
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Au moins 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial (@#$%^&+=!)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmer le nouveau mot de passe *
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      minLength={8}
                      required
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={passwordSaving}
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      aria-label="Changer le mot de passe"
                    >
                      {passwordSaving ? 'Mise à jour...' : 'Changer le mot de passe'}
                    </button>
                  </div>
                </form>
              )}

              {activeTab === 'danger' && (
                <div className="space-y-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-red-900 mb-2">
                      Supprimer mon compte
                    </h3>
                    <p className="text-sm text-red-700 mb-4">
                      Cette action est irréversible. Toutes vos annonces seront supprimées définitivement.
                    </p>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-red-900 mb-2">
                        Pour confirmer, tapez <strong>"SUPPRIMER"</strong> ci-dessous :
                      </label>
                      <input
                        type="text"
                        value={deleteConfirmation}
                        onChange={(e) => setDeleteConfirmation(e.target.value)}
                        className="w-full px-4 py-2 border border-red-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-600"
                        placeholder="SUPPRIMER"
                      />
                    </div>

                    <button
                      onClick={handleDeleteAccount}
                      disabled={deleting || deleteConfirmation !== 'SUPPRIMER'}
                      className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      aria-label="Supprimer définitivement mon compte"
                    >
                      {deleting ? 'Suppression...' : 'Supprimer définitivement mon compte'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </ProtectedRoute>
  );
}