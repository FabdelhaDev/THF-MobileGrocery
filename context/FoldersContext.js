import React, { createContext, useContext, useMemo, useState } from "react";
import { useTutorial } from "./TutorialContext";

const FoldersCtx = createContext(null);
function makeId(prefix = 'id') { return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,6)}`; }

export function FoldersProvider({ children }) {
  const [folders, setFolders] = useState([]);
  const { report } = useTutorial();

  const addFolder = ({ name, description, image }) => {
    const id = makeId('fld');
    setFolders(prev => [...prev, { id, name, description, image: image ?? null, lists: [] }]);
    report({ type: 'FOLDER_CREATED', folderId: id });
    return id;
  };

  const updateFolder = (id, patch) => { setFolders(prev => prev.map(folder => folder.id === id ? { ...folder, ...patch } : folder)); };
  const removeFolder = (id) => { setFolders(prev => prev.filter(folder => folder.id !== id)); };

  const createListInFolder = (folderId, { name, description, image }) => {
    const id = makeId('lst');
    setFolders(prev =>
      prev.map(folder =>
        folder.id === folderId
          ? { ...folder, lists: [...folder.lists, { id, name, description, image: image ?? null, items: [] }] }
          : folder
      )
    );
    report({ type: 'LIST_CREATED', listId: id });
    return id;
  };

  const updateList = (folderId, listId, patch) => {
    setFolders(prev =>
      prev.map(folder =>
        folder.id === folderId
          ? { ...folder, lists: folder.lists.map(list => (list.id === listId ? { ...list, ...patch } : list)) }
          : folder
      )
    );
  };

  const removeList = (folderId, listId) => {
    setFolders(prev =>
      prev.map(folder =>
        folder.id === folderId ? { ...folder, lists: folder.lists.filter(list => list.id !== listId) } : folder
      )
    );
  };

  const addItemToList = (folderId, listId, item) => {
    const id = makeId('itm');
    setFolders(prev =>
      prev.map(folder =>
        folder.id === folderId
          ? {
              ...folder,
              lists: folder.lists.map(list =>
                list.id === listId ? { ...list, items: [...list.items, { id, ...item }] } : list
              ),
            }
          : folder
      )
    );
    report({ type: 'ITEM_ADDED' });
    return id;
  };

  const updateItem = (folderId, listId, itemId, patch) => {
    setFolders(prev =>
      prev.map(folder =>
        folder.id === folderId
          ? {
              ...folder,
              lists: folder.lists.map(list =>
                list.id === listId
                  ? { ...list, items: list.items.map(item => (item.id === itemId ? { ...item, ...patch } : item)) }
                  : list
              ),
            }
          : folder
      )
    );
  };

  const removeItem = (folderId, listId, itemId) => {
    setFolders(prev =>
      prev.map(folder =>
        folder.id === folderId
          ? { ...folder, lists: folder.lists.map(list => (list.id === listId ? { ...list, items: list.items.filter(item => item.id !== itemId) } : list)) }
          : folder
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