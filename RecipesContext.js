import React, { createContext, useContext, useMemo, useState } from 'react';

const RecipesCtx = createContext(null);

export function RecipesProvider({ children }) {
  const [recipes, setRecipes] = useState([]); // {id, name, description, items: [{name}]}

  const createRecipe = ({ name, description }) => {
    const id = `rcp-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
    const recipe = { id, name, description: description ?? '', items: [] };
    setRecipes((prev) => [recipe, ...prev]);
    return id;
  };

  const updateRecipeMeta = (id, patch) => {
    setRecipes((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const removeRecipe = (id) => setRecipes((prev) => prev.filter((r) => r.id !== id));

  const addItemsToRecipe = (id, itemsToAdd) => {
    setRecipes((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              items: [
                ...r.items,
                // prevent duplicates by normalized name
                ...itemsToAdd.filter(
                  (it) => !r.items.some((e) => e.name.trim().toLowerCase() === it.name.trim().toLowerCase())
                ),
              ],
            }
          : r
      )
    );
  };

  const removeItemFromRecipe = (id, itemName) => {
    setRecipes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, items: r.items.filter((i) => i.name !== itemName) } : r))
    );
  };

  const value = useMemo(
    () => ({ recipes, createRecipe, updateRecipeMeta, removeRecipe, addItemsToRecipe, removeItemFromRecipe }),
    [recipes]
  );
  return <RecipesCtx.Provider value={value}>{children}</RecipesCtx.Provider>;
}

export function useRecipes() {
  const ctx = useContext(RecipesCtx);
  if (!ctx) throw new Error('useRecipes must be used within RecipesProvider');
  return ctx;
}
