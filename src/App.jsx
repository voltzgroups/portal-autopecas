/**
 * App.jsx - Componente raiz da aplicação
 * Gerencia autenticação, roteamento e estado global
 */

import React, { useState, useEffect } from 'react';
import { supabase } from './services/supabaseClient';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SearchSuppliers from './pages/SearchSuppliers';
import './index.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard'); // 'dashboard' ou 'search'

  // Verifica se há usuário logado ao montar o componente
  useEffect(() => {
    checkUser();

    // Escuta mudanças de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      }
    );

    return () => authListener?.subscription.unsubscribe();
  }, []);

  // Verifica usuário atualmente logado
  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
      }
    } catch (error) {
      console.error('Erro ao verificar usuário:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    checkUser();
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('dashboard'); // Volta para dashboard ao fazer logout
  };

  if (isLoading) {
    return <div className="app-loading">Carregando...</div>;
  }

  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <>
      {currentPage === 'dashboard' ? (
        <Dashboard
          user={user}
          onLogout={handleLogout}
          onNavigateSearch={() => setCurrentPage('search')}
        />
      ) : (
        <SearchSuppliers
          user={user}
          onLogout={handleLogout}
          onNavigateDashboard={() => setCurrentPage('dashboard')}
          onNavigateSearch={() => setCurrentPage('search')}
        />
      )}
    </>
  );
}
