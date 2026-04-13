/**
 * Login.jsx - Página de autenticação
 * Login com email e senha usando Supabase Auth
 */

import React, { useState } from 'react';
import { Mail, Lock, Zap, AlertCircle } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import './Login.css';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Registro de novo usuário
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}`,
          },
        });

        if (signUpError) throw signUpError;

        setError('');
        setEmail('');
        setPassword('');
        setIsSignUp(false);
        alert('Cadastro realizado! Verifique seu email para confirmação.');
      } else {
        // Login
        const { data, error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (loginError) throw loginError;

        if (data.user) {
          onLoginSuccess(data.user);
        }
      }
    } catch (err) {
      console.error('Erro na autenticação:', err);
      setError(err.message || 'Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <div className="login-logo">
            <Zap size={40} />
          </div>
          <h1>AutoHub</h1>
          <p>Portal de Autopeças B2B</p>
        </div>

        {/* Forma de Login */}
        <form onSubmit={handleSubmit} className="login-form">
          {/* Título */}
          <h2>{isSignUp ? 'Criar Conta' : 'Fazer Login'}</h2>

          {/* Mensagem de erro */}
          {error && (
            <div className="error-message">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Campo Email */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          {/* Campo Senha */}
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Botão de Envio */}
          <button
            type="submit"
            className="btn btn-primary btn-login"
            disabled={isLoading}
          >
            {isLoading
              ? 'Processando...'
              : isSignUp
              ? 'Criar Conta'
              : 'Entrar'}
          </button>

          {/* Divisor */}
          <div className="form-divider">
            <span>ou</span>
          </div>

          {/* Botão de Toggle */}
          <button
            type="button"
            className="btn btn-secondary btn-toggle"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
          >
            {isSignUp
              ? 'Já tem conta? Faça login'
              : 'Não tem conta? Cadastre-se'}
          </button>
        </form>

        {/* Footer */}
        <div className="login-footer">
          <p>
            Use este portal para acessar fornecedores parceiros de autopeças.
          </p>
        </div>
      </div>

      {/* Decoração de Background */}
      <div className="login-decoration"></div>
    </div>
  );
}
