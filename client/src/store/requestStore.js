import { create } from 'zustand';
import axios from 'axios';
import { supabase } from '../lib/supabaseClient';

export const useRequestStore = create((set, get) => ({
  // ... (keep existing state) ...
  url: 'https://dummyjson.com/products',
  method: 'GET',
  headers: [{ id: 1, key: 'Content-Type', value: 'application/json', active: true }],
  queryParams: [{ id: 1, key: '', value: '', active: true }],
  body: '{\n  "title": "foo",\n  "body": "bar",\n  "userId": 1\n}', 
  
  isLoading: false,
  response: null,
  error: null,
  
  // 🆕 USER STATE
  user: null, 

  history: [], 
  collections: [],
  environments: [],
  activeEnvId: null,

  // ... (keep existing setters) ...
  setUrl: (url) => set({ url }),
  setMethod: (method) => set({ method }),
  setHeaders: (headers) => set({ headers }),
  setQueryParams: (queryParams) => set({ queryParams }),
  setBody: (body) => set({ body }),

  // 🆕 ACTION: SET USER
  setUser: (user) => set({ user }),

  // FETCH HISTORY (RLS handles filtering by user automatically)
  fetchHistory: async () => {
    const { data, error } = await supabase
      .from('request_history')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (!error) set({ history: data });
  },

  // FETCH COLLECTIONS (RLS handles filtering by user automatically)
  fetchCollections: async () => {
    const { data, error } = await supabase
      .from('collections')
      .select('*, collection_items(*)')
      .order('created_at', { ascending: true });
    
    if (!error) set({ collections: data });
  },

  // 🆕 UPDATED: CREATE COLLECTION (With User ID)
  createCollection: async (name) => {
    const { user } = get();
    if (!user) return; // Guard clause

    const { data, error } = await supabase
      .from('collections')
      .insert({ 
        name,
        user_id: user.id // 👈 Assign owner
      })
      .select()
      .single();

    if (!error) {
      set((state) => ({ collections: [...state.collections, { ...data, collection_items: [] }] }));
      return data;
    }
  },

  // SAVE REQUEST TO COLLECTION
  saveRequestToCollection: async (collectionId, name) => {
    const { url, method, headers, queryParams, body } = get();
    
    // Note: collection_items doesn't need user_id, it inherits permissions from the parent collection
    const { data, error } = await supabase
      .from('collection_items')
      .insert({
        collection_id: collectionId,
        name, 
        url,
        method,
        headers,
        query_params: queryParams,
        body
      })
      .select()
      .single();

    if (!error) {
      set((state) => ({
        collections: state.collections.map((c) => 
          c.id === collectionId 
            ? { ...c, collection_items: [...c.collection_items, data] }
            : c
        )
      }));
    }
  },

  // FETCH ENVIRONMENTS
  fetchEnvironments: async () => {
    const { data, error } = await supabase.from('environments').select('*').order('name');
    if (!error) set({ environments: data });
  },

  // 🆕 UPDATED: CREATE ENVIRONMENT (With User ID)
  createEnvironment: async (name) => {
    const { user } = get();
    if (!user) return;

    const { data } = await supabase
      .from('environments')
      .insert({ 
        name, 
        variables: [],
        user_id: user.id // 👈 Assign owner
      })
      .select()
      .single();

    if (data) {
      set((state) => ({ 
        environments: [...state.environments, data],
        activeEnvId: data.id 
      }));
    }
  },

  updateEnvironment: async (id, variables) => {
    set((state) => ({
      environments: state.environments.map(e => e.id === id ? { ...e, variables } : e)
    }));

    await supabase.from('environments').update({ variables }).eq('id', id);
  },

  setActiveEnv: (id) => set({ activeEnvId: id }),

  processVariables: (text) => {
    if (!text || typeof text !== 'string') return text;
    
    const { environments, activeEnvId } = get();
    if (!activeEnvId) return text;

    const activeEnv = environments.find(e => e.id === activeEnvId);
    if (!activeEnv || !activeEnv.variables) return text;

    let processedText = text;
    activeEnv.variables.forEach(variable => {
      if (variable.active && variable.key) {
        const regex = new RegExp(`{{${variable.key}}}`, 'g');
        processedText = processedText.replace(regex, variable.value);
      }
    });

    return processedText;
  },

  // ⚡ SEND REQUEST
  sendRequest: async () => {
    const { url, method, headers, queryParams, body, processVariables } = get(); 
    set({ isLoading: true, response: null, error: null });

    const startTime = Date.now();

    try {
      // 1. PROCESS VARIABLES
      const finalUrl = processVariables(url);
      
      const cleanHeaders = headers.filter(h => h.active && h.key).reduce((acc, h) => ({ 
        ...acc, 
        [h.key]: processVariables(h.value) 
      }), {});

      const cleanParams = queryParams.filter(p => p.active && p.key).reduce((acc, p) => ({ 
        ...acc, 
        [p.key]: processVariables(p.value) 
      }), {});

      const finalBodyString = processVariables(body);
      const finalBody = method !== 'GET' ? JSON.parse(finalBodyString || '{}') : undefined;

      // 2. SEND TO PROXY
  // ✅ Use the external API base URL from the environment
const API_BASE_URL = import.meta.env.VITE_API_URL;
const res = await axios.post(`${API_BASE_URL}/proxy`, {
        url: finalUrl,
        method,
        headers: cleanHeaders,
        params: cleanParams, 
        body: finalBody,
      });
      
      const duration = Date.now() - startTime;

      // 3. UPDATE UI
      set({ 
        isLoading: false, 
        response: { ...res.data, time: `${duration}ms` } 
      });

      // 4. SAVE TO SUPABASE (Updated with User ID) 💾
      const { user } = get();
      
      // Only save history if a user is logged in
      if (user) {
        await supabase.from('request_history').insert({
          user_id: user.id, // 👈 Attach ID
          url,
          method,
          headers: headers,
          query_params: queryParams,
          body: body,
          status: res.data.status,
          duration_ms: duration
        });
        
        // 5. Refresh History
        get().fetchHistory();
      }

    } catch (err) {
      console.error(err);
      set({ 
        isLoading: false, 
        error: err.response?.data?.details || err.message || 'Failed to fetch' 
      });
    }
  },
}));