/**
 * Navbar.jsx - Barra de navegação
 * Exibe logo, nome do usuário e botão de logout
 */

import React from 'react';
import { LogOut, Zap } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import './Navbar.css';

export default function Navbar({ user, onLogout }) {
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      onLogout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        {/* Logo e Título */}
        <div className="navbar-brand">
          <div className="navbar-logo">
            <Zap size={24} />
          </div>
          <div className="navbar-title">
            <h1>AutoHub</h1>
            <p>Portal de Autopeças</p>
          </div>
        </div>

        {/* Info do usuário e Logout */}
        <div className="navbar-user">
          <div className="user-info">
            <span className="user-email">{user?.email}</span>
          </div>
          <button
            className="btn btn-secondary"
            onClick={handleLogout}
            title="Fazer logout"
          >
            <LogOut size={18} />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
