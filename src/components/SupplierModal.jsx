/**
 * SupplierModal.jsx - Modal do fornecedor
 * Exibe detalhes completos do fornecedor e opção de abrir
 */

import React from 'react';
import { X, ExternalLink, Package } from 'lucide-react';
import './SupplierModal.css';

export default function SupplierModal({ supplier, isOpen, onClose }) {
  if (!isOpen || !supplier) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleOpenSupplier = () => {
    // Abre o link do fornecedor em uma nova aba
    window.open(supplier.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content animate-in">
        {/* Header do Modal */}
        <div className="modal-header">
          <div className="modal-supplier-info">
            <div className="modal-logo">
              {supplier.logo_url ? (
                <img src={supplier.logo_url} alt={supplier.nome} />
              ) : (
                <Package size={32} color="#2563eb" />
              )}
            </div>
            <h2 className="modal-title">{supplier.nome}</h2>
          </div>
          <button
            className="modal-close-btn"
            onClick={onClose}
            title="Fechar modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Divisor */}
        <div className="modal-divider"></div>

        {/* Body do Modal */}
        <div className="modal-body">
          {/* Descrição */}
          <div className="modal-section">
            <h3 className="modal-section-title">Descrição</h3>
            <p className="modal-text">{supplier.descricao}</p>
          </div>

          {/* Instruções de Acesso */}
          <div className="modal-section">
            <h3 className="modal-section-title">Como Acessar</h3>
            <div className="modal-instructions">
              <div className="instruction-item">
                <div className="instruction-badge">ℹ️</div>
                <p className="modal-text">{supplier.instrucoes}</p>
              </div>
            </div>
          </div>

          {/* URL (oculto, para referência) */}
          <div className="modal-section">
            <h3 className="modal-section-title">Portal</h3>
            <p className="modal-url">{supplier.url}</p>
          </div>
        </div>

        {/* Footer do Modal */}
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Fechar
          </button>
          <button className="btn btn-primary" onClick={handleOpenSupplier}>
            <ExternalLink size={18} />
            Abrir Fornecedor
          </button>
        </div>
      </div>
    </div>
  );
}
