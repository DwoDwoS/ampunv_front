'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PublicNavbar from '@/components/layout/PublicNavbar';
import Footer from '@/components/layout/Footer';
import FurnitureGrid from '@/components/furniture/FurnitureGrid';
import { furnitureApi } from '@/lib/api/furnitures';
import { Furniture } from '@/types';

export default function HomePage() {
  const [featuredFurnitures, setFeaturedFurnitures] = useState<Furniture[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedFurnitures = async () => {
      try {
        const furnitures = await furnitureApi.getAll();
        const featured = furnitures
          .filter(f => f.status === 'APPROVED')
          .slice(0, 8);
        setFeaturedFurnitures(featured);
      } catch (error) {
        console.error('Erreur lors du chargement des meubles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedFurnitures();
  }, []);

  return (
    <>
      <PublicNavbar />
      
      <main>
        <section className="bg-linear-to-r from-blue-600 to-blue-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                Donnez une seconde vie à vos meubles
              </h1>
              <p className="text-xl sm:text-2xl mb-8 text-blue-100">
                Ancien Meuble Pour Une Nouvelle Vie
              </p>
              <p className="text-lg mb-10 max-w-2xl mx-auto text-blue-50">
                Achetez et vendez des meubles d'occasion entre particuliers. 
                Une plateforme simple, écologique et économique.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/catalog"
                  className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition shadow-lg"
                >
                  Découvrir le catalogue
                </Link>
                <Link
                  href="/register"
                  className="px-8 py-4 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-400 transition shadow-lg"
                >
                  Devenir vendeur
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {featuredFurnitures.length}+
                </div>
                <div className="text-gray-600">Meubles disponibles</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
                <div className="text-gray-600">Écologique</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">0€</div>
                <div className="text-gray-600">Frais d'inscription</div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-linear-to-r from-blue-600 to-blue-800 text-blue-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Meubles en vedette
              </h2>
              <p className="text-blue-200">
                Découvrez notre sélection de meubles d'occasion
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                <FurnitureGrid 
                  furnitures={featuredFurnitures}
                  emptyMessage="Aucun meuble disponible pour le moment. Revenez bientôt !"
                />
                
                {featuredFurnitures.length > 0 && (
                  <div className="text-center mt-12">
                    <Link
                      href="/catalog"
                      className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                      Voir tout le catalogue
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Comment ça marche ?
              </h2>
              <p className="text-gray-600">
                Vendez vos meubles en 3 étapes simples
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full text-2xl font-bold mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Inscrivez-vous gratuitement
                </h3>
                <p className="text-gray-600">
                  Créez votre compte vendeur en quelques clics
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full text-2xl font-bold mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Publiez votre annonce
                </h3>
                <p className="text-gray-600">
                  Ajoutez des photos et une description de votre meuble
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full text-2xl font-bold mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Vendez facilement
                </h3>
                <p className="text-gray-600">
                  Les acheteurs vous contactent directement
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link
                href="/register"
                className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Commencer maintenant
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 bg-linear-to-r from-blue-600 to-blue-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Pourquoi choisir AMPUNV ?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-blue-300 mb-2">
                  Écologique
                </h3>
                <p className="text-blue-200 text-sm">
                  Réduisez les déchets en donnant une seconde vie aux meubles
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-blue-300 mb-2">
                  Économique
                </h3>
                <p className="text-blue-200 text-sm">
                  Trouvez des meubles de qualité à prix réduit
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                  <svg
                    className="w-8 h-8 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-blue-300 mb-2">
                  Entre particuliers
                </h3>
                <p className="text-blue-200 text-sm">
                  Achetez directement auprès des vendeurs locaux
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                  <svg
                    className="w-8 h-8 text-yellow-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-blue-300 mb-2">
                  Simple et sécurisé
                </h3>
                <p className="text-blue-200 text-sm">
                  Plateforme facile à utiliser et transactions sécurisées
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}