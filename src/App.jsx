/**
 * App.jsx - Componente raiz da aplicação
 * Gerencia autenticação, roteamento e estado global
 */

import React, { useState, useEffect } from 'react';
import { supabase } from './services/supabaseClient';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import './index.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;

      if (data?.session?.user) {
        setUser(data.session.user);
      }
    } catch (error) {
      console.error('Erro ao verificar usuário:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--lighter)',
        fontFamily: 'var(--font-family)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(37, 99, 235, 0.2)',
            borderTop: '3px solid #2563eb',
            borderRadius: '50%',
            margin: '0 auto 1rem',
            animation: 'spin 1s linear infinite',
          }}></div>
          <p style={{ color: 'var(--gray-500)' }}>Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não tem usuário logado, mostra a página de login
  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Se tem usuário logado, mostra o dashboard
  return (
    <Dashboard user={user} onLogout={handleLogout} />
  );
}
