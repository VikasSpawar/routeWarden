

import { useState, useEffect } from 'react';
import { Play, Save, Eye, Plus, Trash2, Loader2 } from 'lucide-react';
import { useRequestStore } from '../store/requestStore';
import KeyValueEditor from './KeyValueEditor';
import JsonEditor from './JsonEditor';
import SaveModal from './SaveModal';
import EnvironmentModal from './EnvironmentModal';
import clsx from 'clsx';

export default function RequestPanel() {
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isEnvModalOpen, setIsEnvModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Params');
  
  const { 
    url, method, headers, queryParams, body, 
    setUrl, setMethod, setHeaders, setQueryParams, setBody, 
    sendRequest, isLoading, environments, activeEnvId, fetchEnvironments 
  } = useRequestStore();

  useEffect(() => { fetchEnvironments(); }, []);

  const activeEnvName = environments.find(e => e.id === activeEnvId)?.name || 'No Env';

const getMethodColor = (method) => {
  const colors = { 
    GET: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', 
    POST: 'text-amber-400 bg-amber-400/10 border-amber-400/20', 
    PUT: 'text-blue-400 bg-blue-400/10 border-blue-400/20', 
    DELETE: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
    PATCH: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20', // 🆕 PATCH COLOR
  };
  return colors[method] || 'text-slate-400 bg-slate-400/10 border-slate-400/20';
};

  return (
   <div className="flex-1 flex flex-col h-screen bg-[#0B0C10] relative z-0 min-w-[400px]">
    <SaveModal isOpen={isSaveModalOpen} onClose={() => setIsSaveModalOpen(false)} />
    <EnvironmentModal isOpen={isEnvModalOpen} onClose={() => setIsEnvModalOpen(false)} />

    {/* THE OMNIBAR SECTION */}
    <div className="p-4 pt-6 pb-2">
      <div className="flex items-center gap-3">
        
        {/* THE CAPSULE (Added min-w-0 to prevent overflow) */}
        <div className="flex-1 min-w-0 h-12 flex items-center bg-[#121212] border border-white/10 rounded-xl px-1 shadow-lg shadow-black/20 focus-within:ring-1 focus-within:ring-blue-500/30 focus-within:border-blue-500/50 transition-all duration-300 group">
          
          <div className="relative h-full flex items-center justify-center border-r border-white/5 pl-2 pr-1 shrink-0">
       <select 
  value={method}
  onChange={(e) => setMethod(e.target.value)}
  className={clsx("bg-transparent text-xs font-bold appearance-none focus:outline-none cursor-pointer text-center w-[70px] tracking-wide", getMethodColor(method))}
>
  <option value="GET">GET</option>
  <option value="POST">POST</option>
  <option value="PUT">PUT</option>
  <option value="PATCH">PATCH</option> 
  <option value="DELETE">DEL</option>
</select>
            </div>

            {/* URL Input */}
          <input 
            type="text" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.example.com/v1..."
            className="flex-1 min-w-0 bg-transparent px-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none font-mono h-full truncate"
            spellCheck="false"
          />

          <button 
            onClick={() => setIsEnvModalOpen(true)}
            className="mr-2 px-3 py-1.5 text-[10px] font-bold text-slate-500 hover:text-blue-400 bg-white/5 hover:bg-blue-500/10 rounded-md transition-colors border border-transparent hover:border-blue-500/20 shrink-0 whitespace-nowrap"
          >
            {activeEnvName}
          </button>
        </div>

        {/* ACTIONS (Added shrink-0) */}
        <button 
          onClick={() => setIsSaveModalOpen(true)}
          className="h-12 w-12 shrink-0 flex items-center justify-center bg-[#121212] border border-white/10 rounded-xl text-slate-400 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all shadow-lg shadow-black/20 active:scale-95"
          title="Save Request"
        >
          <Save size={18} />
        </button>

        <button 
          onClick={sendRequest}
          disabled={isLoading}
          className="h-12 px-6 shrink-0 bg-blue-600 hover:bg-blue-500 text-white rounded-xl flex items-center gap-2 font-bold text-sm shadow-[0_0_20px_-5px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_-5px_rgba(37,99,235,0.6)] active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none disabled:active:scale-100"
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} fill="currentColor" />}
          <span>SEND</span>
        </button>
      </div>
    </div>

      {/* 2. MINIMALIST TABS */}
      <div className="flex items-center px-4 gap-6 border-b border-white/5 mt-2">
        {['Params', 'Headers', 'Body'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              "pb-3 text-xs font-medium transition-all relative",
              activeTab === tab 
                ? "text-blue-400" 
                : "text-slate-500 hover:text-slate-300"
            )}
          >
            {tab}
            {/* Glowing Underline */}
            <div className={clsx(
              "absolute bottom-0 left-0 w-full h-[2px] rounded-t-full transition-all duration-300 shadow-[0_-2px_10px_rgba(96,165,250,0.5)]",
              activeTab === tab ? "bg-blue-400 opacity-100" : "bg-transparent opacity-0"
            )} />
          </button>
        ))}
      </div>

      {/* 3. EDITOR AREA */}
      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        
        {/* PARAMS & HEADERS */}
        {(activeTab === 'Params' || activeTab === 'Headers') && (
           <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
             <div className="mb-4 flex items-center justify-between">
               <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                 {activeTab === 'Params' ? 'Query Parameters' : 'HTTP Headers'}
               </h3>
             </div>
             {/* Using existing editor, we will style it in next step, but wrapping it here for context */}
             <div className="bg-[#121212] border border-white/5 rounded-xl p-4 shadow-inner">
                <KeyValueEditor 
                  pairs={activeTab === 'Params' ? queryParams : headers} 
                  setPairs={activeTab === 'Params' ? setQueryParams : setHeaders} 
                />
             </div>
           </div>
        )}

        {/* JSON BODY */}
        {activeTab === 'Body' && (
           <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
             <div className="flex justify-between items-center mb-3">
               <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Request Body</h3>
               <span className="text-[10px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">JSON</span>
             </div>
             
             <div className="flex-1 overflow-hidden rounded-xl border border-white/10 shadow-lg bg-[#0d0d0d]"> 
               <JsonEditor 
                 value={body} 
                 onChange={setBody} 
                 readOnly={false}
               />
             </div>
           </div>
        )}
      </div>
    </div>
  );
}

