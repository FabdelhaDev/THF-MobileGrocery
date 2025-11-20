import React, { createContext, useContext, useMemo, useState } from 'react';

const ItemsCtx = createContext(null);

export function ItemsProvider({ children }) {
  // Added a few items so the Recipes screen is testable immediately since there is no Api that we added currently.
  const [items, setItems] = useState([
    { id: 'it-1', name: 'Eggs' },
    { id: 'it-2', name: 'Flour' },
    { id: 'it-3', name: 'Milk' },
  ]);

  const addItem = (name) => {
    const id = `it-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setItems((prev) => [...prev, { id, name }]);
    return id;
  };

  const value = useMemo(() => ({ items, addItem }), [items]);
  return <ItemsCtx.Provider value={value}>{children}</ItemsCtx.Provider>;
}

export function useItems() {
  const ctx = useContext(ItemsCtx);
  if (!ctx) throw new Error('useItems must be used within ItemsProvider');
  return ctx;
}
