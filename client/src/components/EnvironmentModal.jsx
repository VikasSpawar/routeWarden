import { useState, useEffect } from 'react';
import { X, Plus, Eye } from 'lucide-react';
import { useRequestStore } from '../store/requestStore';
import KeyValueEditor from './KeyValueEditor';
import { createPortal } from 'react-dom';

export default function EnvironmentModal({ isOpen, onClose }) {
  const { environments, activeEnvId, createEnvironment, updateEnvironment, setActiveEnv } = useRequestStore();
  const [selectedEnvId, setSelectedEnvId] = useState(null);

  // Sync selection when modal opens
  useEffect(() => {
    if (activeEnvId) setSelectedEnvId(activeEnvId);
    else if (environments.length > 0) setSelectedEnvId(environments[0].id);
  }, [isOpen, activeEnvId, environments]);

  const handleCreate = () => {
    const name = prompt("Enter Environment Name (e.g., Production):");
    if (name) createEnvironment(name);
  };

  const currentEnv = environments.find(e => e.id === selectedEnvId);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed  inset-0 bg-black/50 flex items-center justify-center z-100">
      <div className="bg-surface backdrop-blur-sm border border-slate-700 w-[600px] h-[500px] rounded-lg shadow-xl flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-700">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Eye size={20} className="text-primary" /> Manage Environments
          </h2>
          <button onClick={onClose}><X size={20} className="text-slate-400 hover:text-white"/></button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          
          {/* Left: List of Environments */}
          <div className="w-48 border-r border-slate-700 bg-slate-900/50 flex flex-col">
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {environments.map(env => (
                <button
                  key={env.id}
                  onClick={() => setSelectedEnvId(env.id)}
                  className={`w-full text-left px-3 py-2 rounded text-sm ${selectedEnvId === env.id ? 'bg-primary/20 text-primary border border-primary/30' : 'text-slate-400 hover:bg-slate-800'}`}
                >
                  {env.name}
                </button>
              ))}
            </div>
            <button 
              onClick={handleCreate}
              className="p-3 border-t border-slate-700 text-xs font-bold uppercase text-slate-400 hover:text-white flex items-center justify-center gap-2"
            >
              <Plus size={14} /> New Environment
            </button>
          </div>

          {/* Right: Variables Editor */}
          <div className="flex-1 p-4 overflow-y-auto bg-surface">
            {currentEnv ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-slate-200">{currentEnv.name} Variables</h3>
                  {activeEnvId !== currentEnv.id && (
                     <button 
                       onClick={() => setActiveEnv(currentEnv.id)}
                       className="text-xs bg-slate-700 hover:bg-green-700 hover:text-white px-3 py-1 rounded transition-colors"
                     >
                       Set Active
                     </button>
                  )}
                  {activeEnvId === currentEnv.id && (
                     <span className="text-xs bg-green-900/50 text-green-400 px-3 py-1 rounded border border-green-900">
                       Active Environment
                     </span>
                  )}
                </div>
                
                <KeyValueEditor 
                  pairs={currentEnv.variables || []} 
                  setPairs={(newPairs) => updateEnvironment(currentEnv.id, newPairs)}
                />
              </div>
            ) : (
              <div className="text-center text-slate-500 mt-20">Select or create an environment</div>
            )}
          </div>

        </div>
      </div>
    </div>,
    document.body
  );
}

