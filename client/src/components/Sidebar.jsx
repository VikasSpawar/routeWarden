// import { useEffect, useState } from 'react'; // Import useState
// import { Layout, Clock, FolderOpen, ChevronRight, ChevronDown, Activity, LogOut } from 'lucide-react';
// import { useRequestStore } from '../store/requestStore';
// import { supabase } from '../lib/supabaseClient'; // 👈 Import Supabase
// import clsx from 'clsx';

// export default function Sidebar() {
//   const { history, collections, fetchHistory, fetchCollections, setUrl, setMethod, setBody, setHeaders, setQueryParams } = useRequestStore();
//   const [activeTab, setActiveTab] = useState('history'); // 'history' or 'collections'
//   const [openFolders, setOpenFolders] = useState({}); // Track which folders are expanded

//   useEffect(() => {
//     fetchHistory();
//     fetchCollections();
//   }, []);

//   const toggleFolder = (id) => {
//     setOpenFolders(prev => ({ ...prev, [id]: !prev[id] }));
//   };

//   const loadRequest = (req) => {
//     setUrl(req.url);
//     setMethod(req.method);
//     setBody(req.body || '');
//     setHeaders(Array.isArray(req.headers) ? req.headers : []);
//     setQueryParams(Array.isArray(req.query_params) ? req.query_params : []);
//   };
  
//   // Helper for Method Colors
//   const getMethodColor = (method) => {
//     const colors = { GET: 'text-green-400', POST: 'text-yellow-400', PUT: 'text-blue-400', DELETE: 'text-red-400' };
//     return colors[method] || 'text-slate-400';
//   };

//   // 🆕 LOGOUT FUNCTION
//   const handleLogout = async () => {
//     await supabase.auth.signOut();
//     // The App.jsx listener will automatically detect this and switch to AuthPage
//   };

//   return (
//     <div className="w-64 bg-surface h-screen border-r border-slate-700 flex flex-col">
//       <div className="p-4 border-b border-slate-700 flex items-center gap-2">
//         <div className="bg-primary p-1 rounded"><Layout size={20} className="text-white" /></div>
//         <h1 className="font-bold text-lg tracking-tight">RouteWarden</h1>
//       </div>

//       {/* TAB SWITCHER */}
//       <div className="flex border-b border-slate-700">
//         <button 
//           onClick={() => setActiveTab('history')}
//           className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide flex justify-center items-center gap-2 ${activeTab === 'history' ? 'text-white border-b-2 border-primary' : 'text-slate-500 hover:text-slate-300'}`}
//         >
//           <Clock size={14} /> History
//         </button>
//         <button 
//           onClick={() => setActiveTab('collections')}
//           className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide flex justify-center items-center gap-2 ${activeTab === 'collections' ? 'text-white border-b-2 border-primary' : 'text-slate-500 hover:text-slate-300'}`}
//         >
//           <FolderOpen size={14} /> Collections
//         </button>
//       </div>
      
//       <div className="flex-1 overflow-y-auto">
        
//         {/* HISTORY VIEW */}
//         {activeTab === 'history' && history.map((req) => (
//           <button key={req.id} onClick={() => loadRequest(req)} className="w-full text-left px-4 py-3 hover:bg-slate-700 border-b border-slate-700/50 group transition-colors">
//             <div className="flex items-center gap-2 mb-1">
//               <span className={clsx("text-xs font-bold w-12", getMethodColor(req.method))}>{req.method}</span>
//               <span className={`text-xs px-1.5 py-0.5 rounded ${req.status >= 400 ? 'bg-red-900/50 text-red-200' : 'bg-green-900/50 text-green-200'}`}>{req.status || '---'}</span>
//             </div>
//             <div className="text-sm text-slate-300 truncate font-mono opacity-80 group-hover:opacity-100">{req.url.replace(/^https?:\/\//, '')}</div>
//           </button>
//         ))}

//         {/* COLLECTIONS VIEW */}
//         {activeTab === 'collections' && (
//           <div className="p-2">
//             {collections.length === 0 && <div className="text-slate-500 text-center text-xs mt-4">No collections yet.<br/>Save a request to start.</div>}
            
//             {collections.map((col) => (
//               <div key={col.id} className="mb-1">
//                 <button 
//                   onClick={() => toggleFolder(col.id)}
//                   className="w-full flex items-center gap-2 px-2 py-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded text-sm font-semibold"
//                 >
//                   {openFolders[col.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
//                   <FolderOpen size={14} className="text-blue-400" />
//                   {col.name}
//                 </button>

//                 {openFolders[col.id] && (
//                   <div className="ml-2 pl-2 border-l border-slate-700 mt-1 space-y-1">
//                     {col.collection_items.map(item => (
//                       <button 
//                         key={item.id} 
//                         onClick={() => loadRequest(item)}
//                         className="w-full flex items-center gap-2 px-2 py-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded text-xs"
//                       >
//                          <span className={clsx("font-bold text-[10px] w-8", getMethodColor(item.method))}>{item.method}</span>
//                          <span className="truncate">{item.name}</span>
//                       </button>
//                     ))}
//                     {col.collection_items.length === 0 && <div className="text-slate-600 text-[10px] pl-2 italic">Empty</div>}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}

//       </div>
//       {/* 👇 UPDATED BOTTOM SECTION */}
//       <div className="p-4 border-t border-slate-700 mt-auto">
//         <button 
//           onClick={handleLogout}
//           className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-red-900/20 hover:border-red-900/50 border border-transparent rounded transition-colors"
//         >
//           <LogOut size={18} />
//           Sign Out
//         </button>
//       </div>
//     </div>
//   );
// }


// import { useEffect, useState } from 'react';
// import { Layout, FolderOpen, Clock, LogOut, ChevronRight, ChevronDown, Search } from 'lucide-react';
// import { useRequestStore } from '../store/requestStore';
// import { supabase } from '../lib/supabaseClient';
// import clsx from 'clsx';

// export default function Sidebar() {
//   const { history, collections, fetchHistory, fetchCollections, setUrl, setMethod, setBody, setHeaders, setQueryParams } = useRequestStore();
//   const [activeTab, setActiveTab] = useState('history');
//   const [openFolders, setOpenFolders] = useState({});

//   useEffect(() => {
//     fetchHistory();
//     fetchCollections();
//   }, []);

//   const handleLogout = async () => {
//     await supabase.auth.signOut();
//   };

//   const toggleFolder = (id) => {
//     setOpenFolders(prev => ({ ...prev, [id]: !prev[id] }));
//   };

//   const loadRequest = (req) => {
//     setUrl(req.url);
//     setMethod(req.method);
//     setBody(req.body || '');
//     setHeaders(Array.isArray(req.headers) ? req.headers : []);
//     setQueryParams(Array.isArray(req.query_params) ? req.query_params : []);
//   };

//   const getMethodColor = (method) => {
//     const colors = { 
//       GET: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', 
//       POST: 'text-amber-400 bg-amber-400/10 border-amber-400/20', 
//       PUT: 'text-blue-400 bg-blue-400/10 border-blue-400/20', 
//       DELETE: 'text-rose-400 bg-rose-400/10 border-rose-400/20' 
//     };
//     return colors[method] || 'text-slate-400 bg-slate-400/10 border-slate-400/20';
//   };

//   return (
//     <div className="w-64 h-screen bg-[#0B0C10] border-r border-white/5 flex flex-col font-sans text-slate-400 select-none">
      
//       {/* 1. BRAND HEADER */}
//       <div className="p-6 pb-4">
//         <div className="flex items-center gap-3 mb-6">
//           <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_-3px_rgba(37,99,235,0.4)]">
//              <Layout size={16} className="text-white" />
//           </div>
//           <h1 className="font-bold text-lg text-slate-100 tracking-tight">RouteWarden</h1>
//         </div>

//         {/* 2. MINIMALIST TAB SWITCHER */}
//         <div className="flex p-1 bg-white/5 rounded-lg">
//           <button 
//             onClick={() => setActiveTab('history')}
//             className={clsx(
//               "flex-1 py-1.5 text-xs font-medium rounded-md transition-all duration-300",
//               activeTab === 'history' ? "bg-white/10 text-white shadow-sm" : "hover:text-slate-200"
//             )}
//           >
//             History
//           </button>
//           <button 
//             onClick={() => setActiveTab('collections')}
//             className={clsx(
//               "flex-1 py-1.5 text-xs font-medium rounded-md transition-all duration-300",
//               activeTab === 'collections' ? "bg-white/10 text-white shadow-sm" : "hover:text-slate-200"
//             )}
//           >
//             Collections
//           </button>
//         </div>
//       </div>

//       {/* 3. SCROLLABLE CONTENT */}
//       <div className="flex-1 overflow-y-auto px-3 space-y-1 custom-scrollbar">
        
//         {/* HISTORY LIST */}
//         {activeTab === 'history' && history.map((req) => (
//           <button 
//             key={req.id}
//             onClick={() => loadRequest(req)}
//             className="w-full text-left px-3 py-3 rounded-lg hover:bg-white/5 group transition-all duration-200 border border-transparent hover:border-white/5 relative overflow-hidden"
//           >
//             <div className="flex items-center justify-between mb-1.5">
//               <span className={clsx("text-[10px] font-bold px-1.5 py-0.5 rounded border", getMethodColor(req.method))}>
//                 {req.method}
//               </span>
//               <span className="text-[10px] text-slate-600 group-hover:text-slate-400 transition-colors">
//                 {req.status || '...'}
//               </span>
//             </div>
//             <div className="text-xs text-slate-500 truncate font-medium group-hover:text-slate-300 group-hover:translate-x-1 transition-transform duration-300">
//               {req.url.replace(/^https?:\/\//, '')}
//             </div>
//           </button>
//         ))}

//         {/* COLLECTIONS LIST */}
//         {activeTab === 'collections' && collections.map((col) => (
//           <div key={col.id} className="mb-1">
//             <button 
//               onClick={() => toggleFolder(col.id)}
//               className="w-full flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-sm font-medium group"
//             >
//               <span className="opacity-50 group-hover:opacity-100 transition-opacity">
//                 {openFolders[col.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
//               </span>
//               <FolderOpen size={14} className={openFolders[col.id] ? "text-blue-400" : "text-slate-500"} />
//               <span className="group-hover:translate-x-1 transition-transform duration-200">{col.name}</span>
//             </button>

//             {/* EXPANDED ITEMS */}
//             <div className={clsx("overflow-hidden transition-all duration-300 ease-in-out", openFolders[col.id] ? "max-h-[500px] opacity-100 mt-1" : "max-h-0 opacity-0")}>
//               <div className="ml-4 pl-3 border-l border-white/10 space-y-1">
//                 {col.collection_items.map(item => (
//                   <button 
//                     key={item.id} 
//                     onClick={() => loadRequest(item)}
//                     className="w-full flex items-center gap-2 px-2 py-2 text-slate-500 hover:text-slate-200 hover:bg-white/5 rounded-md text-xs transition-all"
//                   >
//                      <span className={clsx("w-1.5 h-1.5 rounded-full", getMethodColor(item.method).split(' ')[0].replace('text-', 'bg-'))}></span>
//                      <span className="truncate hover:translate-x-1 transition-transform duration-200">{item.name}</span>
//                   </button>
//                 ))}
//                 {col.collection_items.length === 0 && <div className="text-slate-700 text-[10px] pl-2 italic py-1">Empty Folder</div>}
//               </div>
//             </div>
//           </div>
//         ))}
        
//         {/* Empty State */}
//         {activeTab === 'history' && history.length === 0 && (
//             <div className="text-center mt-10 opacity-30">
//                 <Clock size={32} className="mx-auto mb-2"/>
//                 <p className="text-xs">No history yet</p>
//             </div>
//         )}
//       </div>

//       {/* 4. FOOTER */}
//       <div className="p-4 border-t border-white/5">
//         <button 
//           onClick={handleLogout}
//           className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all duration-300"
//         >
//           <LogOut size={14} />
//           <span>Sign Out</span>
//         </button>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState, useRef, useCallback } from 'react';
import { Layout, FolderOpen, Clock, LogOut, ChevronRight, ChevronDown } from 'lucide-react';
import { useRequestStore } from '../store/requestStore';
import { supabase } from '../lib/supabaseClient';
import clsx from 'clsx';

export default function Sidebar() {
  const { history, collections, fetchHistory, fetchCollections, setUrl, setMethod, setBody, setHeaders, setQueryParams } = useRequestStore();
  const [activeTab, setActiveTab] = useState('history');
  const [openFolders, setOpenFolders] = useState({});
  
  // ↔️ RESIZE STATE
  const [width, setWidth] = useState(260); // Default width
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef(null);

  useEffect(() => {
    fetchHistory();
    fetchCollections();
  }, []);

  // 🖱️ RESIZE LOGIC
  const startResizing = useCallback(() => {
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback((mouseMoveEvent) => {
    if (isResizing) {
      const newWidth = mouseMoveEvent.clientX;
      if (newWidth > 160 && newWidth < 480) { // Min 160px, Max 480px
        setWidth(newWidth);
      }
    }
  }, [isResizing]);

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);


  const handleLogout = async () => await supabase.auth.signOut();
  const toggleFolder = (id) => setOpenFolders(prev => ({ ...prev, [id]: !prev[id] }));

  const loadRequest = (req) => {
    setUrl(req.url);
    setMethod(req.method);
    setBody(req.body || '');
    setHeaders(Array.isArray(req.headers) ? req.headers : []);
    setQueryParams(Array.isArray(req.query_params) ? req.query_params : []);
  };

  const getMethodColor = (method) => {
    const colors = { 
      GET: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', 
      POST: 'text-amber-400 bg-amber-400/10 border-amber-400/20', 
      PUT: 'text-blue-400 bg-blue-400/10 border-blue-400/20', 
      DELETE: 'text-rose-400 bg-rose-400/10 border-rose-400/20' 
    };
    return colors[method] || 'text-slate-400 bg-slate-400/10 border-slate-400/20';
  };

  return (
    <div 
      ref={sidebarRef}
      className="relative h-screen bg-[#0B0C10] flex flex-col font-sans text-slate-400 select-none group/sidebar"
      style={{ width: `${width}px` }} // Apply dynamic width
    >
      
      {/* 1. BRAND HEADER */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_-3px_rgba(37,99,235,0.4)]">
             <Layout size={16} className="text-white" />
          </div>
          <h1 className="font-bold text-lg text-slate-100 tracking-tight whitespace-nowrap overflow-hidden">RouteWarden</h1>
        </div>

        {/* TAB SWITCHER */}
        <div className="flex p-1 bg-white/5 rounded-lg">
          <button onClick={() => setActiveTab('history')} className={clsx("flex-1 py-1.5 text-xs font-medium rounded-md transition-all duration-300", activeTab === 'history' ? "bg-white/10 text-white shadow-sm" : "hover:text-slate-200")}>History</button>
          <button onClick={() => setActiveTab('collections')} className={clsx("flex-1 py-1.5 text-xs font-medium rounded-md transition-all duration-300", activeTab === 'collections' ? "bg-white/10 text-white shadow-sm" : "hover:text-slate-200")}>Collections</button>
        </div>
      </div>

      {/* 2. SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto px-3 space-y-1 custom-scrollbar">
        {/* HISTORY */}
        {activeTab === 'history' && history.map((req) => (
          <button key={req.id} onClick={() => loadRequest(req)} className="w-full text-left px-3 py-3 rounded-lg hover:bg-white/5 group transition-all duration-200 border border-transparent hover:border-white/5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-1.5">
              <span className={clsx("text-[10px] font-bold px-1.5 py-0.5 rounded border", getMethodColor(req.method))}>{req.method}</span>
              <span className="text-[10px] text-slate-600 group-hover:text-slate-400">{req.status || '...'}</span>
            </div>
            <div className="text-xs text-slate-500 truncate font-medium group-hover:text-slate-300 group-hover:translate-x-1 transition-transform duration-300">
              {req.url.replace(/^https?:\/\//, '')}
            </div>
          </button>
        ))}

        {/* COLLECTIONS */}
        {activeTab === 'collections' && collections.map((col) => (
          <div key={col.id} className="mb-1">
            <button onClick={() => toggleFolder(col.id)} className="w-full flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-sm font-medium group">
              <span className="opacity-50 group-hover:opacity-100">{openFolders[col.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</span>
              <FolderOpen size={14} className={openFolders[col.id] ? "text-blue-400" : "text-slate-500"} />
              <span className="truncate group-hover:translate-x-1 transition-transform duration-200">{col.name}</span>
            </button>
            <div className={clsx("overflow-hidden transition-all duration-300", openFolders[col.id] ? "max-h-[500px] opacity-100 mt-1" : "max-h-0 opacity-0")}>
              <div className="ml-4 pl-3 border-l border-white/10 space-y-1">
                {col.collection_items.map(item => (
                  <button key={item.id} onClick={() => loadRequest(item)} className="w-full flex items-center gap-2 px-2 py-2 text-slate-500 hover:text-slate-200 hover:bg-white/5 rounded-md text-xs transition-all">
                     <span className={clsx("w-1.5 h-1.5 rounded-full", getMethodColor(item.method).split(' ')[0].replace('text-', 'bg-'))}></span>
                     <span className="truncate hover:translate-x-1 transition-transform duration-200">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. FOOTER */}
      <div className="p-4 border-t border-white/5">
        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all duration-300">
          <LogOut size={14} /> <span>Sign Out</span>
        </button>
      </div>

      {/* 4. ↔️ THE DRAG HANDLE */}
      <div 
        onMouseDown={startResizing}
        className={clsx(
          "absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-500/50 transition-colors z-50",
          isResizing ? "bg-blue-500" : "bg-transparent"
        )} 
      />
      {/* 1px visible border */}
      <div className="absolute top-0 right-0 w-[1px] h-full bg-white/5 pointer-events-none" />
    </div>
  );
}