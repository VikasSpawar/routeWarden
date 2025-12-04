import { useState, useEffect } from 'react';
import { X, FolderPlus } from 'lucide-react';
import { useRequestStore } from '../store/requestStore';
import { createPortal } from 'react-dom';

export default function SaveModal({ isOpen, onClose }) {
  const { collections, fetchCollections, createCollection, saveRequestToCollection } = useRequestStore();
  const [reqName, setReqName] = useState('');
  const [selectedCol, setSelectedCol] = useState('');
  const [newColName, setNewColName] = useState('');
  const [isCreatingCol, setIsCreatingCol] = useState(false);

  useEffect(() => {
    if (isOpen) fetchCollections();
  }, [isOpen]);

  const handleSave = async () => {
    if (!reqName || !selectedCol) return;
    await saveRequestToCollection(selectedCol, reqName);
    onClose();
    setReqName('');
  };

  const handleCreateCollection = async () => {
    if (!newColName) return;
    const newCol = await createCollection(newColName);
    if (newCol) {
      setSelectedCol(newCol.id);
      setIsCreatingCol(false);
      setNewColName('');
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed  inset-0 bg-black/50 flex items-center justify-center z-100">
      <div className="bg-surface border border-slate-700 p-6 rounded-lg w-96 shadow-xl backdrop-blur-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Save Request</h2>
          <button onClick={onClose}><X size={20} className="text-slate-400 hover:text-white"/></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Request Name</label>
            <input 
              className="w-full bg-background border border-slate-600 rounded p-2 text-sm focus:border-primary focus:outline-none"
              placeholder="e.g. Fetch User Profile"
              value={reqName}
              onChange={(e) => setReqName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Collection (Folder)</label>
            
            {!isCreatingCol ? (
              <div className="flex gap-2">
                <select 
                  className="flex-1 bg-background border border-slate-600 rounded p-2 text-sm focus:border-primary focus:outline-none"
                  value={selectedCol}
                  onChange={(e) => setSelectedCol(e.target.value)}
                >
                  <option className='text-black' value="">Select a folder...</option>
                  {collections.map(c => <option  className="text-black" key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <button 
                  onClick={() => setIsCreatingCol(true)}
                  className="p-2 bg-slate-700 rounded hover:bg-slate-600"
                  title="Create New Folder"
                >
                  <FolderPlus size={18} />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input 
                  className="flex-1 bg-background border border-slate-600 rounded p-2 text-sm"
                  placeholder="New Folder Name"
                  value={newColName}
                  onChange={(e) => setNewColName(e.target.value)}
                  autoFocus
                />
                <button onClick={handleCreateCollection} className="text-xs bg-primary px-3 rounded">Add</button>
                <button onClick={() => setIsCreatingCol(false)} className="text-xs text-slate-400 px-2">Cancel</button>
              </div>
            )}
          </div>

          <button 
            onClick={handleSave}
            className="w-full bg-primary hover:bg-blue-600 py-2 rounded font-medium mt-2"
          >
            Save
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

