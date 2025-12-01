import { Trash2, Plus } from 'lucide-react';

export default function KeyValueEditor({ pairs, setPairs }) {
  
  const updatePair = (id, field, value) => {
    const newPairs = pairs.map(p => p.id === id ? { ...p, [field]: value } : p);
    setPairs(newPairs);
  };

  const removePair = (id) => {
    setPairs(pairs.filter(p => p.id !== id));
  };

  const addPair = () => {
    setPairs([...pairs, { id: Date.now(), key: '', value: '', active: true }]);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex font-semibold text-xs text-slate-400 mb-1 px-2">
        <div className="w-8"></div>
        <div className="flex-1">Key</div>
        <div className="flex-1">Value</div>
        <div className="w-8"></div>
      </div>
      
      {pairs.map((pair) => (
        <div key={pair.id} className="flex gap-2 items-center">
          {/* Checkbox to toggle active/inactive */}
          <input 
            type="checkbox" 
            checked={pair.active}
            onChange={(e) => updatePair(pair.id, 'active', e.target.checked)}
            className="w-4 h-4 accent-primary cursor-pointer"
          />
          
          <input 
            className="flex-1 bg-surface border border-slate-700 rounded px-2 py-1 text-sm focus:border-primary focus:outline-none"
            placeholder="Key"
            value={pair.key}
            onChange={(e) => updatePair(pair.id, 'key', e.target.value)}
          />
          
          <input 
            className="flex-1 bg-surface border border-slate-700 rounded px-2 py-1 text-sm focus:border-primary focus:outline-none"
            placeholder="Value"
            value={pair.value}
            onChange={(e) => updatePair(pair.id, 'value', e.target.value)}
          />

          <button 
            onClick={() => removePair(pair.id)}
            className="text-slate-500 hover:text-red-400 p-1"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}

      <button 
        onClick={addPair}
        className="self-start mt-2 flex items-center gap-2 text-xs text-primary hover:text-blue-400 font-semibold uppercase tracking-wide px-2 py-1 hover:bg-slate-800 rounded transition-colors"
      >
        <Plus size={14} /> Add New
      </button>
    </div>
  );
}