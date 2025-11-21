import { createContext, useContext, useState, useMemo } from "react";

const FoldersCtx = createContext(null);

export function FoldersProvider({ children }) {
  const [folders, setFolders] = useState([]);

  const addFolder = ({ name, description, image }) => {
    const id = `fld-${Date.now()}`;
    setFolders(prev => [...prev, { id, name, description, image: image ?? null, lists: [] }]);
    return id;
  };

  const updateFolder = (id, patch) => {
    setFolders(prev => prev.map(f => f.id === id ? { ...f, ...patch } : f));
  };

  const removeFolder = (id) => {
    setFolders(prev => prev.filter(f => f.id !== id));
  };

  // LISTS
  const createListInFolder = (folderId, { name, description, image }) => {
    const id = `lst-${Date.now()}`;
    setFolders(prev =>
      prev.map(f =>
        f.id === folderId
          ? { ...f, lists: [...f.lists, { id, name, description, image: image ?? null, items: [] }] }
          : f
      )
    );
    return id;
  };

  const updateList = (folderId, listId, patch) => {
    setFolders(prev =>
      prev.map(f =>
        f.id === folderId
          ? {
              ...f,
              lists: f.lists.map(l => (l.id === listId ? { ...l, ...patch } : l)),
            }
          : f
      )
    );
  };

  const removeList = (folderId, listId) => {
    setFolders(prev =>
      prev.map(f =>
        f.id === folderId
          ? { ...f, lists: f.lists.filter(l => l.id !== listId) }
          : f
      )
    );
  };

  const addItemToList = (folderId, listId, item) => {
    const id = `itm-${Date.now()}`;
    setFolders(prev =>
      prev.map(f =>
        f.id === folderId
          ? {
              ...f,
              lists: f.lists.map(l =>
                l.id === listId
                  ? { ...l, items: [...l.items, { id, ...item }] }
                  : l
              ),
            }
          : f
      )
    );
    return id;
  };

  const updateItem = (folderId, listId, itemId, patch) => {
    setFolders(prev =>
      prev.map(f =>
        f.id === folderId
          ? {
              ...f,
              lists: f.lists.map(l =>
                l.id === listId
                  ? {
                      ...l,
                      items: l.items.map(i =>
                        i.id === itemId ? { ...i, ...patch } : i
                      ),
                    }
                  : l
              ),
            }
          : f
      )
    );
  };

  const removeItem = (folderId, listId, itemId) => {
    setFolders(prev =>
      prev.map(f =>
        f.id === folderId
          ? {
              ...f,
              lists: f.lists.map(l =>
                l.id === listId
                  ? { ...l, items: l.items.filter(i => i.id !== itemId) }
                  : l
              ),
            }
          : f
      )
    );
  };

  const value = useMemo(
    () => ({
      folders,
      addFolder, updateFolder, removeFolder,
      createListInFolder, updateList, removeList,
      addItemToList, updateItem, removeItem,
    }),
    [folders]
  );

  return <FoldersCtx.Provider value={value}>{children}</FoldersCtx.Provider>;
}

export const useFolders = () => {
  const c = useContext(FoldersCtx);
  if (!c) throw new Error("useFolders must be used inside provider");
  return c;
};
