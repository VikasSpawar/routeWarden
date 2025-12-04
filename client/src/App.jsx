import "./App.css";
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import { useRequestStore } from './store/requestStore';
import AuthPage from './components/AuthPage';
import Sidebar from './components/Sidebar';
import RequestPanel from './components/RequestPanel';
import ResponsePanel from './components/ResponsePanel';

function App() {
  const { setUser } = useRequestStore();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check active session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 2. Listen for changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="h-screen w-full bg-background flex items-center justify-center text-slate-500">Loading RouteWarden...</div>;
  }

  // If no user, show Auth Page
  if (!session) {
    return <AuthPage />;
  }

  // If user, show Main App
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-white">
      <Sidebar />
      <RequestPanel />
      <ResponsePanel />
    </div>
  );
}

export default App;