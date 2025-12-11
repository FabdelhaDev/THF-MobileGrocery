import React, { createContext, useContext, useMemo, useState } from 'react';
import { useTutorial } from './TutorialContext';

const RecipesCtx = createContext(null);
function makeId(prefix) { return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,5)}`; }

export function RecipesProvider({ children }) {
  const [recipes, setRecipes] = useState([]); 
  const { report } = useTutorial();

  const createRecipe = ({ name, description }) => {
    const id = makeId('rcp');
    const recipe = { id, name, description: description ?? '', items: [] };
    setRecipes((previous) => [recipe, ...previous]);
    report({ type: 'RECIPE_CREATED' });
    return id;
  };

  const updateRecipeMeta = (id, patch) => {
    setRecipes((previous) =>
      previous.map((recipe) => (recipe.id === id ? { ...recipe, ...patch } : recipe))
    );
  };

  const removeRecipe = (id) => {
    setRecipes((previousList) => previousList.filter((recipe) => recipe.id !== id));
  };

  const addItemsToRecipe = (id, itemsToAdd) => {
    setRecipes((previous) =>
      previous.map((recipe) =>
        recipe.id === id
          ? {
              ...recipe,
              items: [
                ...recipe.items,
                ...itemsToAdd.filter(
                  (incoming) =>
                    !recipe.items.some(
                      (existing) =>
                        existing.name.trim().toLowerCase() === incoming.name.trim().toLowerCase()
                    )
                ),
              ],
            }
          : recipe
      )
    );
    report({ type: 'RECIPE_ITEM_ADDED' }); // advance tutorial
  };

  const removeItemFromRecipe = (id, itemName) => {
    setRecipes((previous) =>
      previous.map((recipe) =>
        recipe.id === id
          ? { ...recipe, items: recipe.items.filter((i) => i.name !== itemName) }
          : recipe
      )
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
