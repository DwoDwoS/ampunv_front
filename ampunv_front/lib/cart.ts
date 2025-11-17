import { Furniture } from '@/types';

export interface CartItem {
  furniture: Furniture;
  addedAt: string;
}

export const cartManager = {
  getCart: (): CartItem[] => {
    if (typeof window === 'undefined') return [];
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  },

  addToCart: (furniture: Furniture): boolean => {
    if (typeof window === 'undefined') return false;
    
    const cart = cartManager.getCart();
    
    const exists = cart.some(item => item.furniture.id === furniture.id);
    if (exists) {
      return false;
    }

    const newItem: CartItem = {
      furniture,
      addedAt: new Date().toISOString(),
    };

    cart.push(newItem);
    localStorage.setItem('cart', JSON.stringify(cart));
    
    window.dispatchEvent(new Event('cartUpdated'));
    
    return true;
  },

  removeFromCart: (furnitureId: number): void => {
    if (typeof window === 'undefined') return;
    
    const cart = cartManager.getCart();
    const updatedCart = cart.filter(item => item.furniture.id !== furnitureId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    window.dispatchEvent(new Event('cartUpdated'));
  },

  clearCart: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('cart');
    window.dispatchEvent(new Event('cartUpdated'));
  },

  getCartCount: (): number => {
    return cartManager.getCart().length;
  },

  getTotal: (): number => {
    const cart = cartManager.getCart();
    return cart.reduce((total, item) => total + item.furniture.price, 0);
  },

  isInCart: (furnitureId: number): boolean => {
    const cart = cartManager.getCart();
    return cart.some(item => item.furniture.id === furnitureId);
  },
};