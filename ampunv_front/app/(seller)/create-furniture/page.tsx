'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import PublicNavbar from '@/components/layout/PublicNavbar';
import Footer from '@/components/layout/Footer';
import { furnitureApi } from '@/lib/api/furnitures';
import { imageApi } from '@/lib/api/images';
import { referenceApi } from '@/lib/api/reference';
import { FurnitureType, Material, Color, City } from '@/types';

export default function CreateFurniturePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [furnitureTypes, setFurnitureTypes] = useState<FurnitureType[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    furnitureTypeId: '',
    materialId: '',
    colorId: '',
    cityId: '',
    condition: 'Bon état',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [referenceData, citiesData] = await Promise.all([
          referenceApi.getAll(),
          referenceApi.getCities(),
        ]);

        setFurnitureTypes(referenceData.furnitureTypes);
        setMaterials(referenceData.materials);
        setColors(referenceData.colors);
        setCities(citiesData);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        alert('Impossible de charger les données de référence');
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    if (imageFiles.length + files.length > 5) {
      alert('Vous ne pouvez sélectionner que 5 images maximum');
      return;
    }

    const validFiles = files.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} est trop volumineux (max 5MB)`);
        return false;
      }
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} n'est pas une image`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setImageFiles((prev) => [...prev, ...validFiles]);

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Le titre est obligatoire';
    if (!formData.description.trim()) newErrors.description = 'La description est obligatoire';
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Le prix doit être supérieur à 0';
    }
    if (!formData.furnitureTypeId) newErrors.furnitureTypeId = 'Sélectionnez un type';
    if (!formData.materialId) newErrors.materialId = 'Sélectionnez un matériau';
    if (!formData.colorId) newErrors.colorId = 'Sélectionnez une couleur';
    if (!formData.cityId) newErrors.cityId = 'Sélectionnez une ville';
    if (imageFiles.length === 0) newErrors.images = 'Ajoutez au moins une photo';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      alert('Veuillez corriger les erreurs du formulaire');
      return;
    }

    setLoading(true);

    try {
      const furnitureData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        furnitureTypeId: parseInt(formData.furnitureTypeId),
        materialId: parseInt(formData.materialId),
        colorId: parseInt(formData.colorId),
        cityId: parseInt(formData.cityId),
        condition: formData.condition,
      };

      console.log('Création du meuble...', furnitureData);
      let createdFurniture;
      let furnitureId;
      
      try {
        createdFurniture = await furnitureApi.create(furnitureData);
        furnitureId = createdFurniture.id;
      } catch (furnitureError: any) {
        throw new Error(`Impossible de créer le meuble: ${furnitureError.response?.data?.message || furnitureError.message}`);
      }

      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const altText = i === 0 ? 'Image principale' : `Image ${i + 1}`;
        
        try {
          await imageApi.uploadImageForFurniture(file, furnitureId, altText);
        } catch (imageError: any) {
          throw new Error(`Erreur lors de l'upload de l'image "${file.name}": ${imageError.response?.data?.message || imageError.message}`);
        }
      }

      alert('Annonce créée avec succès avec ' + imageFiles.length + ' image(s) !');
      router.push('/dashboard');
    } catch (error: any) {
      
      let errorMessage = 'Erreur lors de la création de l\'annonce';
      
      if (error.message && error.message.includes('upload de l\'image')) {
        errorMessage = `Le meuble a été créé mais l'upload des images a échoué.\n\n`
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data) {
        errorMessage = typeof error.response.data === 'string' 
          ? error.response.data 
          : JSON.stringify(error.response.data);
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <ProtectedRoute>
        <PublicNavbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <PublicNavbar />

      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Créer une annonce
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photos ({imageFiles.length}/5) *
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square relative rounded-lg overflow-hidden border-2 border-gray-300">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                          Principal
                        </div>
                      )}
                    </div>
                  ))}

                  {imageFiles.length < 5 && (
                    <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                      <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-xs text-gray-600 mt-2">Ajouter</span>
                    </label>
                  )}
                </div>

                <p className="text-xs text-gray-500">
                  Formats acceptés : JPG, PNG, WEBP (max 5MB par image). La première image sera l'image principale.
                </p>
                {errors.images && (
                  <p className="text-red-600 text-sm mt-1">{errors.images}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre de l'annonce *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ex: Table en chêne massif"
                  className={`w-full px-3 py-2 border rounded-md text-black ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.title && (
                  <p className="text-red-600 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Décrivez votre meuble en détail..."
                  className={`w-full px-3 py-2 border rounded-md text-black ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.description && (
                  <p className="text-red-600 text-sm mt-1">{errors.description}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix (€) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  max="1000000"
                  placeholder="0.00"
                  className={`w-full px-3 py-2 border rounded-md text-black ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.price && (
                  <p className="text-red-600 text-sm mt-1">{errors.price}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de meuble *
                  </label>
                  <select
                    name="furnitureTypeId"
                    value={formData.furnitureTypeId}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md text-black ${
                      errors.furnitureTypeId ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Sélectionnez</option>
                    {furnitureTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                  {errors.furnitureTypeId && (
                    <p className="text-red-600 text-sm mt-1">{errors.furnitureTypeId}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Matériau *
                  </label>
                  <select
                    name="materialId"
                    value={formData.materialId}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md text-black ${
                      errors.materialId ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Sélectionnez</option>
                    {materials.map((material) => (
                      <option key={material.id} value={material.id}>
                        {material.name}
                      </option>
                    ))}
                  </select>
                  {errors.materialId && (
                    <p className="text-red-600 text-sm mt-1">{errors.materialId}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Couleur *
                  </label>
                  <select
                    name="colorId"
                    value={formData.colorId}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md text-black ${
                      errors.colorId ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Sélectionnez</option>
                    {colors.map((color) => (
                      <option key={color.id} value={color.id}>
                        {color.name}
                      </option>
                    ))}
                  </select>
                  {errors.colorId && (
                    <p className="text-red-600 text-sm mt-1">{errors.colorId}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ville *
                  </label>
                  <select
                    name="cityId"
                    value={formData.cityId}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md text-black ${
                      errors.cityId ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Sélectionnez</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name} ({city.postalCode})
                      </option>
                    ))}
                  </select>
                  {errors.cityId && (
                    <p className="text-red-600 text-sm mt-1">{errors.cityId}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  État du meuble *
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                >
                  <option value="Neuf">Neuf</option>
                  <option value="Très bon état">Très bon état</option>
                  <option value="Bon état">Bon état</option>
                  <option value="État correct">État correct</option>
                  <option value="À rénover">À rénover</option>
                </select>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Publication en cours...' : 'Publier l\'annonce'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </ProtectedRoute>
  );
}