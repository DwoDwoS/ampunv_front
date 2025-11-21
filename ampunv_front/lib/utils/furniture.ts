import { Furniture } from '@/types';

export const addPrimaryImageUrl = (furniture: Furniture): Furniture => {
  const primaryImage = furniture.images?.find(img => img.isPrimary) || furniture.images?.[0];
  return {
    ...furniture,
    primaryImageUrl: primaryImage?.url || ''
  };
};

export const addPrimaryImageUrlToList = (furnitures: Furniture[]): Furniture[] => {
  return furnitures.map(addPrimaryImageUrl);
};