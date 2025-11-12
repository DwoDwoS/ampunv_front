'use client';

import { useEffect, useState } from 'react';
import PublicNavbar from '@/components/layout/PublicNavbar';
import Footer from '@/components/layout/Footer';
import FurnitureGrid from '@/components/furniture/FurnitureGrid';
import { furnitureApi } from '@/lib/api/furnitures';
import { referenceApi } from '@/lib/api/reference';
import { Furniture, FurnitureType, Material, Color, City } from '@/types';

export default function CatalogPage() {
  const [furnitures, setFurnitures] = useState<Furniture[]>([]);
  const [filteredFurnitures, setFilteredFurnitures] = useState<Furniture[]>([]);
  const [loading, setLoading] = useState(true);
  const [furnitureTypes, setFurnitureTypes] = useState<FurnitureType[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [filters, setFilters] = useState({
    search: '',
    furnitureTypeId: '',
    materialId: '',
    colorId: '',
    cityId: '',
    minPrice: '',
    maxPrice: '',
    condition: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [furnituresData, referenceData, citiesData] = await Promise.all([
          furnitureApi.getAll(),
          referenceApi.getAll(),
          referenceApi.getCities(),
        ]);

        const availableFurnitures = furnituresData.filter(
          f => f.status === 'AVAILABLE'
        );

        setFurnitures(availableFurnitures);
        setFilteredFurnitures(availableFurnitures);
        setFurnitureTypes(referenceData.furnitureTypes);
        setMaterials(referenceData.materials);
        setColors(referenceData.colors);
        setCities(citiesData);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...furnitures];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        f =>
          f.title.toLowerCase().includes(searchLower) ||
          f.description.toLowerCase().includes(searchLower)
      );
    }

    if (filters.furnitureTypeId) {
      filtered = filtered.filter(
        f => f.furnitureTypeId === parseInt(filters.furnitureTypeId)
      );
    }

    if (filters.materialId) {
      filtered = filtered.filter(
        f => f.materialId === parseInt(filters.materialId)
      );
    }

    if (filters.colorId) {
      filtered = filtered.filter(f => f.colorId === parseInt(filters.colorId));
    }

    if (filters.cityId) {
      filtered = filtered.filter(f => f.cityId === parseInt(filters.cityId));
    }

    if (filters.minPrice) {
      filtered = filtered.filter(f => f.price >= parseFloat(filters.minPrice));
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(f => f.price <= parseFloat(filters.maxPrice));
    }

    if (filters.condition) {
      filtered = filtered.filter(f => f.condition === filters.condition);
    }

    setFilteredFurnitures(filtered);
  }, [filters, furnitures]);

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      furnitureTypeId: '',
      materialId: '',
      colorId: '',
      cityId: '',
      minPrice: '',
      maxPrice: '',
      condition: '',
    });
  };

  return (
    <>
      <PublicNavbar />

      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Catalogue de meubles
            </h1>
            <p className="text-gray-600">
              {filteredFurnitures.length} meuble{filteredFurnitures.length > 1 ? 's' : ''} disponible{filteredFurnitures.length > 1 ? 's' : ''}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 sticky top-20">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Filtres</h2>
                  <button
                    onClick={resetFilters}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Réinitialiser
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rechercher
                    </label>
                    <input
                      type="text"
                      placeholder="Titre ou description..."
                      value={filters.search}
                      onChange={e => handleFilterChange('search', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de meuble
                    </label>
                    <select
                      value={filters.furnitureTypeId}
                      onChange={e => handleFilterChange('furnitureTypeId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Tous les types</option>
                      {furnitureTypes.map(type => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Matériau
                    </label>
                    <select
                      value={filters.materialId}
                      onChange={e => handleFilterChange('materialId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Tous les matériaux</option>
                      {materials.map(material => (
                        <option key={material.id} value={material.id}>
                          {material.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Couleur
                    </label>
                    <select
                      value={filters.colorId}
                      onChange={e => handleFilterChange('colorId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Toutes les couleurs</option>
                      {colors.map(color => (
                        <option key={color.id} value={color.id}>
                          {color.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ville
                    </label>
                    <select
                      value={filters.cityId}
                      onChange={e => handleFilterChange('cityId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Toutes les villes</option>
                      {cities.map(city => (
                        <option key={city.id} value={city.id}>
                          {city.name} ({city.postalCode})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prix
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={e => handleFilterChange('minPrice', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={e => handleFilterChange('maxPrice', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      État
                    </label>
                    <select
                      value={filters.condition}
                      onChange={e => handleFilterChange('condition', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Tous les états</option>
                      <option value="Neuf">Neuf</option>
                      <option value="Très bon état">Très bon état</option>
                      <option value="Bon état">Bon état</option>
                      <option value="État correct">État correct</option>
                      <option value="À rénover">À rénover</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <FurnitureGrid
                  furnitures={filteredFurnitures}
                  emptyMessage="Aucun meuble ne correspond à vos critères. Essayez de modifier les filtres."
                />
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}