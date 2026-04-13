/**
 * Navbar.jsx - Barra de navegação
 * Exibe logo, abas de navegação, usuário e logout
 */

import React from 'react';
import { LogOut, Zap, Search } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import './Navbar.css';

export default function Navbar({ user, onLogout, currentPage, onNavigateSearch, onNavigateDashboard }) {
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
      <div className="navbar-container">
        {/* LOGO */}
        <div className="navbar-logo" onClick={onNavigateDashboard} style={{ cursor: 'pointer' }}>
          <Zap size={24} />
          <span>AutoHub</span>
        </div>

        {/* MENU DE NAVEGAÇÃO */}
        <div className="navbar-menu">
          <button
            className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={onNavigateDashboard}
          >
            📦 Fornecedores
          </button>
          <button
            className={`nav-link ${currentPage === 'search' ? 'active' : ''}`}
            onClick={onNavigateSearch}
          >
            <Search size={16} />
            Buscar
          </button>
        </div>

        {/* USER E LOGOUT */}
        <div className="navbar-user">
          <span className="user-email">{user?.email}</span>
          <button className="btn-logout" onClick={handleLogout} title="Sair">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
}
