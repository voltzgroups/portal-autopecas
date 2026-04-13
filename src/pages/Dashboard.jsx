/**
 * Dashboard.jsx - Página principal do portal
 * Exibe fornecedores, barra de busca e sistema de favoritos
 */

import React, { useState, useEffect } from 'react';
import { Search, Heart, Loader } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import SupplierCard from '../components/SupplierCard';
import SupplierModal from '../components/SupplierModal';
import Navbar from '../components/Navbar';
import './Dashboard.css';

export default function Dashboard({ user, onLogout }) {
  const [suppliers, setSuppliers] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filterFavorites, setFilterFavorites] = useState(false);

  // Carrega fornecedores e favoritos ao montar o componente
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);

      // Carrega fornecedores
      const { data: suppliersData, error: suppliersError } = await supabase
        .from('fornecedores')
        .select('*')
        .order('nome');

      if (suppliersError) throw suppliersError;
      setSuppliers(suppliersData || []);

      // Carrega favoritos do usuário
      const { data: favoritesData, error: favoritesError } = await supabase
        .from('favoritos')
        .select('fornecedor_id')
        .eq('user_id', user.id);

      if (favoritesError) throw favoritesError;
      setFavorites(favoritesData?.map((f) => f.fornecedor_id) || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      alert('Erro ao carregar fornecedores');
    } finally {
      setIsLoading(false);
    }
  };

  // Filtra fornecedores por termo de busca e favoritos
  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchSearch = supplier.nome
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
      supplier.descricao
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchFavorite = !filterFavorites || favorites.includes(supplier.id);

    return matchSearch && matchFavorite;
  });

  // Abre o modal com os detalhes do fornecedor
  const handleCardClick = (supplier) => {
    setSelectedSupplier(supplier);
    setIsModalOpen(true);
  };

  // Fecha o modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSupplier(null);
  };

  // Adiciona ou remove um fornecedor dos favoritos
  const handleToggleFavorite = async (supplierId) => {
    try {
      const isFavorite = favorites.includes(supplierId);

      if (isFavorite) {
        // Remove dos favoritos
        const { error } = await supabase
          .from('favoritos')
          .delete()
          .eq('user_id', user.id)
          .eq('fornecedor_id', supplierId);

        if (error) throw error;
        setFavorites(favorites.filter((id) => id !== supplierId));
      } else {
        // Adiciona aos favoritos
        const { error } = await supabase
          .from('favoritos')
          .insert([
            {
              user_id: user.id,
              fornecedor_id: supplierId,
            },
          ]);

        if (error) throw error;
        setFavorites([...favorites, supplierId]);
      }
    } catch (error) {
      console.error('Erro ao atualizar favoritos:', error);
      alert('Erro ao atualizar favoritos');
    }
  };

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <Navbar user={user} onLogout={onLogout} />

      {/* Conteúdo Principal */}
      <main className="dashboard-main">
        <div className="container">
          {/* Header com Título */}
          <div className="dashboard-header">
            <div>
              <h1>Fornecedores Parceiros</h1>
              <p>Acesse os portais de nossos fornecedores de autopeças</p>
            </div>
          </div>

          {/* Controles de Busca e Filtro */}
          <div className="dashboard-controls">
            {/* Barra de Busca */}
            <div className="search-wrapper">
              <Search size={20} className="search-icon" />
              <input
                type="search"
                placeholder="Buscar fornecedor por nome ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            {/* Botão de Filtro Favoritos */}
            <button
              className={`btn btn-filter ${filterFavorites ? 'active' : ''}`}
              onClick={() => setFilterFavorites(!filterFavorites)}
              title={
                filterFavorites
                  ? 'Mostrar todos os fornecedores'
                  : 'Mostrar apenas favoritos'
              }
            >
              <Heart size={18} />
              <span>Favoritos</span>
            </button>
          </div>

          {/* Resultado da Busca */}
          {searchTerm && (
            <div className="search-result-info">
              <p>
                {filteredSuppliers.length} fornecedor(es) encontrado(s) para "
                <strong>{searchTerm}</strong>"
              </p>
            </div>
          )}

          {/* Grid de Fornecedores */}
          {isLoading ? (
            <div className="loading-container">
              <Loader size={32} className="loading-spinner" />
              <p>Carregando fornecedores...</p>
            </div>
          ) : filteredSuppliers.length > 0 ? (
            <div className="suppliers-grid">
              {filteredSuppliers.map((supplier) => (
                <SupplierCard
                  key={supplier.id}
                  supplier={supplier}
                  isFavorite={favorites.includes(supplier.id)}
                  onCardClick={handleCardClick}
                  onFavoriteToggle={handleToggleFavorite}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>Nenhum fornecedor encontrado</h3>
              <p>
                {filterFavorites
                  ? 'Você ainda não adicionou fornecedores aos favoritos'
                  : 'Tente ajustar seus critérios de busca'}
              </p>
              {filterFavorites && (
                <button
                  className="btn btn-primary mt-4"
                  onClick={() => setFilterFavorites(false)}
                >
                  Ver todos os fornecedores
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Modal do Fornecedor */}
      <SupplierModal
        supplier={selectedSupplier}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
