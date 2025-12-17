import React, { createContext, useContext, useMemo, useState } from 'react';

const UiCtx = createContext(null);

export function UiProvider({ children }) {

  const [overlayHidden, setOverlayHidden] = useState(false);

  // Name of the currently focused top tab (Folders | Recipes | Settings).
  const [currentScreen, setCurrentScreen] = useState(''); // set by each tab

  const value = useMemo(
    () => ({
      overlayHidden,
      setOverlayHidden,
      currentScreen,
      setCurrentScreen,
    }),
    [overlayHidden, currentScreen]
  );

  return <UiCtx.Provider value={value}>{children}</UiCtx.Provider>;
}

export function useUi() {
  const ctx = useContext(UiCtx);
  if (!ctx) throw new Error('useUi must be used within UiProvider');
  return ctx;
}
