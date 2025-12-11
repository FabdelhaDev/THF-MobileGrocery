import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AppState } from 'react-native';

let Storage = null;
try { Storage = require('@react-native-async-storage/async-storage').default; }
catch { Storage = { getItem: async () => null, setItem: async () => {}, removeItem: async () => {} }; }

const STORAGE_KEY = 'onboarding_tutorial_v2';
const TutorialCtx = createContext(null);

export function TutorialProvider({ children }) {
  const [state, setState] = useState({
    hasSeenPrompt: false,
    isActive: false,
    // New order: no centered-scroll step; add addItemsToRecipe
    currentStep: 'idle', // createFolder → createList → addThreeItems → createRecipe → addItemsToRecipe → done
    progress: { itemsAddedCount: 0 },
  });

  useEffect(() => { Storage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {}); }, [state]);
  useEffect(() => { (async () => { try { const raw = await Storage.getItem(STORAGE_KEY); if (raw) setState(JSON.parse(raw)); } catch {} })(); }, []);
  useEffect(() => { const sub = AppState.addEventListener('change', () => {}); return () => sub.remove(); }, []);

  const begin = useCallback(() => {
    setState({ hasSeenPrompt: true, isActive: true, currentStep: 'createFolder', progress: { itemsAddedCount: 0 } });
  }, []);
  const skip  = useCallback(() => {
    setState({ hasSeenPrompt: true, isActive: false, currentStep: 'done', progress: { itemsAddedCount: 0 } });
  }, []);
  const restart = useCallback(() => {
    setState({ hasSeenPrompt: true, isActive: true, currentStep: 'createFolder', progress: { itemsAddedCount: 0 } });
  }, []);

  const goToNextStep = useCallback(() => {
    setState((prev) => {
      if (!prev.isActive) return prev;
      const order = ['createFolder','createList','addThreeItems','createRecipe','addItemsToRecipe','done'];
      const idx = order.indexOf(prev.currentStep);
      const next = idx >= 0 && idx < order.length - 1 ? order[idx + 1] : 'done';
      return { ...prev, currentStep: next, isActive: next !== 'done' };
    });
  }, []);

  // Auto-advance signals from the app
  const report = useCallback((event) => {
    setState((prev) => {
      if (!prev.isActive) return prev;

      if (prev.currentStep === 'createFolder' && event.type === 'FOLDER_CREATED') {
        return { ...prev, currentStep: 'createList', progress: { ...prev.progress, folderId: event.folderId } };
      }
      if (prev.currentStep === 'createList' && event.type === 'LIST_CREATED') {
        return { ...prev, currentStep: 'addThreeItems', progress: { ...prev.progress, listId: event.listId } };
      }
      if (prev.currentStep === 'addThreeItems' && event.type === 'ITEM_ADDED') {
        const nextCount = (prev.progress.itemsAddedCount || 0) + 1;
        return { ...prev, currentStep: nextCount >= 3 ? 'createRecipe' : 'addThreeItems', progress: { ...prev.progress, itemsAddedCount: nextCount } };
      }
      if (prev.currentStep === 'createRecipe' && event.type === 'RECIPE_CREATED') {
        return { ...prev, currentStep: 'addItemsToRecipe' };
      }
      if (prev.currentStep === 'addItemsToRecipe' && event.type === 'RECIPE_ITEM_ADDED') {
        return { ...prev, currentStep: 'done', isActive: false };
      }
      return prev;
    });
  }, []);

  const value = useMemo(() => ({ state, begin, skip, restart, goToNextStep, report }), [state, begin, skip, restart, goToNextStep, report]);
  return <TutorialCtx.Provider value={value}>{children}</TutorialCtx.Provider>;
}

export function useTutorial() {
  const ctx = useContext(TutorialCtx);
  if (!ctx) throw new Error('useTutorial must be used within TutorialProvider');
  return ctx;

}