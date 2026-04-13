/**
 * SupplierCard.jsx - Card do fornecedor
 * Exibe informações do fornecedor e ações
 */

import React from 'react';
import { Heart, Package } from 'lucide-react';
import './SupplierCard.css';

export default function SupplierCard({
  supplier,
  isFavorite,
  onCardClick,
  onFavoriteToggle,
}) {
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onFavoriteToggle(supplier.id);
  };

  return (
    <div className="supplier-card" onClick={() => onCardClick(supplier)}>
      {/* Header com Logo e Botão Favorito */}
      <div className="card-header">
        <div className="supplier-logo">
          {supplier.logo_url ? (
            <img src={supplier.logo_url} alt={supplier.nome} />
          ) : (
            <Package size={40} color="#2563eb" />
          )}
        </div>
        <button
          className={`favorite-btn ${isFavorite ? 'active' : ''}`}
          onClick={handleFavoriteClick}
          title={isFavorite ? 'Remover de favoritos' : 'Adicionar aos favoritos'}
        >
          <Heart size={20} />
        </button>
      </div>

      {/* Conteúdo */}
      <div className="card-content">
        <h3 className="supplier-name">{supplier.nome}</h3>
        <p className="supplier-description">{supplier.descricao}</p>
      </div>

      {/* Footer com Botão */}
      <div className="card-footer">
        <button className="btn btn-primary btn-block">
          Acessar Fornecedor
        </button>
      </div>
    </div>
  );
}
