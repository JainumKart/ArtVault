'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Artwork, ArtworkVariant, CartItem, FramingOption } from '@/types';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  taxGst: number;
  shippingFee: number;
  total: number;
  isCartOpen: boolean;
  addItem: (artwork: Artwork, variant: ArtworkVariant, framing?: FramingOption) => void;
  removeItem: (itemId: string) => void;
  updateFraming: (itemId: string, framing: FramingOption) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('artvault_cart');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
  }, []);

  const saveItems = (newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem('artvault_cart', JSON.stringify(newItems));
  };

  const addItem = (
    artwork: Artwork,
    variant: ArtworkVariant,
    framing?: FramingOption
  ) => {
    if (!variant.inStock) {
      setIsCartOpen(true);
      return;
    }

    const existing = items.find(
      i => i.artworkId === artwork.id && i.variantId === variant.id && i.selectedFraming?.id === framing?.id
    );

    const variantQuantity = items
      .filter(i => i.artworkId === artwork.id && i.variantId === variant.id)
      .reduce((quantity, item) => quantity + item.quantity, 0);

    if (
      variant.type === 'LIMITED_PRINT' &&
      variant.editionAvailable !== undefined &&
      variantQuantity >= variant.editionAvailable
    ) {
      setIsCartOpen(true);
      return;
    }

    // If it's an original, maximum quantity allowed in cart is 1
    if (variant.type === 'ORIGINAL') {
      const alreadyHasOriginal = items.some(i => i.artworkId === artwork.id && i.variantType === 'ORIGINAL');
      if (alreadyHasOriginal) {
        setIsCartOpen(true);
        return;
      }
    }

    if (existing && variant.type !== 'ORIGINAL') {
      const updated = items.map(item =>
        item.id === existing.id
          ? {
              ...item,
              quantity: item.quantity + 1,
              totalItemPrice: (item.unitPrice + item.framingPrice) * (item.quantity + 1),
            }
          : item
      );
      saveItems(updated);
    } else {
      const framingPrice = framing ? framing.priceDelta : 0;
      const unitPrice = variant.price;
      const editionNumber =
        variant.type === 'LIMITED_PRINT' && variant.editionTotal && variant.editionAvailable
          ? variant.editionTotal - variant.editionAvailable + 1
          : undefined;

      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        artworkId: artwork.id,
        artworkTitle: artwork.title,
        artworkImage: artwork.images[0],
        artistId: artwork.artistId,
        artistName: artwork.artistName,
        variantId: variant.id,
        variantTitle: variant.title,
        variantType: variant.type,
        editionNumber,
        selectedFraming: framing,
        unitPrice,
        framingPrice,
        totalItemPrice: unitPrice + framingPrice,
        quantity: 1,
      };

      saveItems([...items, newItem]);
    }

    setIsCartOpen(true);
  };

  const removeItem = (itemId: string) => {
    const filtered = items.filter(i => i.id !== itemId);
    saveItems(filtered);
  };

  const updateFraming = (itemId: string, framing: FramingOption) => {
    const updated = items.map(item => {
      if (item.id === itemId) {
        const framingPrice = framing.priceDelta;
        return {
          ...item,
          selectedFraming: framing,
          framingPrice,
          totalItemPrice: (item.unitPrice + framingPrice) * item.quantity,
        };
      }
      return item;
    });
    saveItems(updated);
  };

  const clearCart = () => {
    saveItems([]);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.totalItemPrice, 0);
  const taxGst = Math.round(subtotal * 0.12); // 12% GST on artwork
  const shippingFee = subtotal > 15000 || subtotal === 0 ? 0 : 1500; // Free above ₹15,000
  const total = subtotal + taxGst + shippingFee;

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        taxGst,
        shippingFee,
        total,
        isCartOpen,
        addItem,
        removeItem,
        updateFraming,
        clearCart,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
