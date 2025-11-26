'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import PublicNavbar from '@/components/layout/PublicNavbar';
import Footer from '@/components/layout/Footer';
import { furnitureApi } from '@/lib/api/furnitures';
import { referenceApi } from '@/lib/api/reference';
import { Furniture, ReferenceData } from '@/types';

export default function EditFurniturePage() {
  const router = useRouter();
  const params = useParams();
  const furnitureId = Number(params.id);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [furniture, setFurniture] = useState<Furniture | null>(null);
  const [referenceData, setReferenceData] = useState<ReferenceData | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    furnitureTypeId: '',
    materialId: '',
    condition: '',
    cityId: '',
  });

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, [furnitureId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const baseData = await referenceApi.getAll();
      const cities = await referenceApi.getCities();
      setReferenceData({ ...baseData, cities });

      const furnitureData = await furnitureApi.getById(furnitureId);
      console.log("FURNITURE DATA:", furnitureData);

      setFurniture(furnitureData);

      setFormData({
        title: furnitureData.title || '',
        description: furnitureData.description || '',
        price: furnitureData.price?.toString() || '',
        furnitureTypeId: furnitureData.furnitureTypeId?.toString() || '',
        materialId: furnitureData.materialId?.toString() || '',
        condition: furnitureData.condition || '',
        cityId: furnitureData.cityId?.toString() || '',
      });

      if (furnitureData.images && furnitureData.images.length > 0) {
        setExistingImages(furnitureData.images.map(img => img.url));
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      alert('Impossible de charger le meuble');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewImages([...newImages, ...files]);
    }
  };

  const handleRemoveNewImage = (index: number) => {
    setNewImages(newImages.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (imageUrl: string) => {
    setExistingImages(existingImages.filter(img => img !== imageUrl));
    setImagesToDelete([...imagesToDelete, imageUrl]);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.price || !formData.furnitureTypeId) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      setSubmitting(true);

      const updateData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        furnitureTypeId: parseInt(formData.furnitureTypeId),
        materialId: parseInt(formData.materialId),
        condition: formData.condition,
        cityId: parseInt(formData.cityId),
        images: newImages,
        imagesToDelete: imagesToDelete,
      };

      await furnitureApi.update(furnitureId, updateData);
      
      alert('Meuble modifié avec succès ! Il sera soumis à nouveau pour validation.');
      router.push('/dashboard');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erreur lors de la modification du meuble');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <PublicNavbar />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </main>
        <Footer />
      </ProtectedRoute>
    );
  }

  if (!furniture || !referenceData) {
    return null;
  }

  return (
    <ProtectedRoute>
      <PublicNavbar />
      
      <main className="min-h-screen bg-gray-50 py-4 sm:py-8">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Modifier mon annonce
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              {furniture.title}
            </p>
          </div>

          {furniture.status === 'REJECTED' && furniture.rejectionReason && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <div className="shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Votre annonce a été rejetée
                  </h3>
                  <p className="mt-2 text-sm text-red-700">
                    <span className="font-semibold">Motif :</span> {furniture.rejectionReason}
                  </p>
                  <p className="mt-2 text-sm text-red-700">
                    Veuillez corriger les points mentionnés et soumettre à nouveau votre annonce.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow p-4 sm:p-6 space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Informations de base
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titre de l'annonce *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Table en chêne massif"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Décrivez votre meuble en détail..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prix (€) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type de meuble *
                  </label>
                  <select
                    name="furnitureTypeId"
                    value={formData.furnitureTypeId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Sélectionner</option>
                    {referenceData.furnitureTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Matériau *
                  </label>
                  <select
                    name="materialId"
                    value={formData.materialId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Sélectionner</option>
                    {referenceData.materials.map((material) => (
                      <option key={material.id} value={material.id}>
                        {material.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    État *
                  </label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Neuf">Neuf</option>
                    <option value="Très bon état">Très bon état</option>
                    <option value="Bon état">Bon état</option>
                    <option value="État correct">État correct</option>
                    <option value="À rénover">À rénover</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ville *
                </label>
                <select
                  name="cityId"
                  value={formData.cityId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-600 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionner une ville</option>
                  {referenceData.cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name} ({city.postalCode})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4 border-t pt-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Photos
              </h2>

              {existingImages.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Images actuelles
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {existingImages.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={imageUrl}
                          alt={`Image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingImage(imageUrl)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {newImages.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nouvelles images à ajouter
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {newImages.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Nouvelle ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border-2 border-blue-300"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveNewImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ajouter des photos
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="w-full flex flex-col items-center px-4 py-6 bg-white border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                    <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="mt-2 text-sm text-gray-600">
                      Cliquez pour ajouter des photos
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
              >
                {submitting ? 'Modification en cours...' : 'Enregistrer les modifications'}
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </ProtectedRoute>
  );
}