// import { useRequestStore } from '../store/requestStore';
// import JsonEditor from './JsonEditor';

// export default function ResponsePanel() {
//   const { response, error, isLoading } = useRequestStore();

//   // Helper to color code status
//   const getStatusColor = (status) => {
//     if (status >= 200 && status < 300) return 'text-green-400';
//     if (status >= 300 && status < 400) return 'text-yellow-400';
//     return 'text-red-400';
//   };

//   return (
//     <div className="flex-1 h-screen flex flex-col bg-surface min-w-[300px]">
//       <div className="h-14 border-b border-slate-700 flex items-center px-4 justify-between">
//         <span className="text-sm font-semibold text-slate-400">Response</span>
        
//         {response && (
//           <div className="flex gap-4 text-xs text-slate-400">
//             <span>Status: <span className={getStatusColor(response.status)}>{response.status} {response.statusText}</span></span>
//             <span>Time: <span className="text-blue-400">{response.time}</span></span>
//             <span>Size: <span className="text-yellow-400">{response.size}</span></span>
//           </div>
//         )}
//       </div>

//       <div className="flex-1 p-4 overflow-auto font-mono text-sm text-slate-300">
//         {isLoading && <div className="text-slate-400 animate-pulse">Sending Request...</div>}
        
//         {!isLoading && error && (
//             <div className="text-red-400 p-2 border border-red-900 bg-red-900/20 rounded">
//                 Error: {error}
//             </div>
//         )}

//     {!isLoading && response && (
//           <div className="h-full">
//             <JsonEditor 
//               value={JSON.stringify(response.data, null, 2)} 
//               readOnly={true} 
//             />
//           </div>
//         )}

//         {!isLoading && !response && !error && (
//           <div className="text-slate-500 italic text-center mt-10">
//             Enter a URL and hit Send
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRequestStore } from '../store/requestStore';
import JsonEditor from './JsonEditor';
import { Clock, HardDrive, Check, Copy, AlertCircle, Terminal } from 'lucide-react';
import clsx from 'clsx';

export default function ResponsePanel() {
  const { response, error, isLoading } = useRequestStore();
  const [copied, setCopied] = useState(false);
  
  // ↔️ RESIZE LOGIC
  const [width, setWidth] = useState(400); // Default width
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = useCallback(() => setIsResizing(true), []);
  const stopResizing = useCallback(() => setIsResizing(false), []);

  const resize = useCallback((mouseMoveEvent) => {
    if (isResizing) {
      // Calculate width from the RIGHT side of the screen
      const newWidth = window.innerWidth - mouseMoveEvent.clientX;
      if (newWidth > 300 && newWidth < 800) { // Min 300px, Max 800px
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

  // ... (Keep existing helpers like getStatusColor, handleCopy) ...
  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20 shadow-[0_0_15px_-5px_rgba(52,211,153,0.3)]';
    if (status >= 300 && status < 400) return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    return 'text-rose-400 bg-rose-400/10 border-rose-400/20 shadow-[0_0_15px_-5px_rgba(251,113,133,0.3)]';
  };

  const handleCopy = () => {
    if (response?.data) {
      navigator.clipboard.writeText(JSON.stringify(response.data, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div 
      className="relative h-screen flex flex-col bg-[#0B0C10] border-l border-white/5 flex-shrink-0"
      style={{ width: `${width}px` }} // Apply dynamic width
    >
      
      {/* ↔️ THE DRAG HANDLE (Left Edge) */}
      <div 
        onMouseDown={startResizing}
        className={clsx(
          "absolute top-0 left-0 w-1 h-full cursor-col-resize hover:bg-blue-500/50 transition-colors z-50",
          isResizing ? "bg-blue-500" : "bg-transparent"
        )} 
      />

      {/* HEADER (METADATA) */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-[#0B0C10] overflow-hidden whitespace-nowrap">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Response</h2>
        
        {response && !isLoading && (
          <div className="flex items-center gap-3">
             {/* ... (Keep existing Time/Size badges) ... */}
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/5 text-[10px] text-slate-400 font-mono">
              <Clock size={10} /> <span>{response.time}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/5 text-[10px] text-slate-400 font-mono">
              <HardDrive size={10} /> <span>{response.size}</span>
            </div>
            <div className={clsx("flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold font-mono transition-all duration-300", getStatusColor(response.status))}>
              <div className={clsx("w-1.5 h-1.5 rounded-full", response.status >= 400 ? "bg-rose-400" : "bg-emerald-400")} />
              <span>{response.status}</span>
            </div>
          </div>
        )}
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 relative overflow-hidden flex flex-col">
        {/* ... (Keep existing loading/error/success/empty states exactly as they were) ... */}
        
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0B0C10] z-10">
             <div className="w-12 h-12 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
             <p className="mt-4 text-xs font-mono text-blue-400 animate-pulse">Sending...</p>
          </div>
        )}

        {!isLoading && error && (
          <div className="p-6">
            <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-xl flex items-start gap-3">
               <AlertCircle size={18} className="text-rose-400 mt-0.5" />
               <div>
                 <h3 className="text-sm font-bold text-rose-400">Error</h3>
                 <p className="text-xs text-rose-300/70 mt-1 font-mono break-all">{error}</p>
               </div>
            </div>
          </div>
        )}

     {!isLoading && response && (
  <div className="flex-1 flex flex-col h-full min-h-0"> {/* Added min-h-0 for safety */}
    <div className="flex justify-end px-4 py-2 shrink-0"> {/* flex-shrink-0 prevents header collapse */}
       <button onClick={handleCopy} className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/10 text-[10px] text-slate-500 hover:text-slate-300 transition-colors">
                 {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                 <span>{copied ? 'Copied' : 'Copy JSON'}</span>
               </button>
            </div>
   <div className="flex-1 overflow-hidden px-4 pb-4 min-h-0"> {/* Added min-h-0 */}
      <div className="h-full rounded-xl overflow-hidden border border-white/5 shadow-inner bg-[#0e0e0e]">
        <JsonEditor 
          value={JSON.stringify(response.data, null, 2)} 
          readOnly={true} 
        />
              </div>
            </div>
          </div>
        )}

        {!isLoading && !response && !error && (
          <div className="flex-1 flex flex-col items-center justify-center opacity-20 select-none pointer-events-none">
            <div className="w-24 h-24 rounded-2xl bg-white/5 flex items-center justify-center mb-4 rotate-12">
               <Terminal size={48} />
            </div>
            <p className="text-sm font-medium">Ready to intercept</p>
          </div>
        )}
      </div>
    </div>
  );
}