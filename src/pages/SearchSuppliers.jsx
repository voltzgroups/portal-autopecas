import { useState } from 'react';
import { Search, ExternalLink, Plus, AlertCircle } from 'lucide-react';
import {
  searchAll,
  addSupplierToDatabase,
  checkSupplierExists
} from '../services/searchService';
import Navbar from '../components/Navbar';
import './SearchSuppliers.css';

export default function SearchSuppliers({ user, onLogout, onNavigateDashboard, onNavigateSearch }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [addingId, setAddingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  /**
   * Executar busca
   */
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) {
      setError('Digite algo para buscar');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const searchResults = await searchAll(query);
      
      if (searchResults.length === 0) {
        setError('Nenhum resultado encontrado');
        setResults([]);
      } else {
        setResults(searchResults);
        setError('');
      }
    } catch (err) {
      setError('Erro ao realizar busca: ' + err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Adicionar fornecedor ao banco
   */
  const handleAddSupplier = async (supplier) => {
    setAddingId(supplier.id);

    try {
      // Verificar se já existe
      const exists = await checkSupplierExists(supplier.url);
      
      if (exists) {
        setError('Este fornecedor já está cadastrado!');
        setAddingId(null);
        return;
      }

      // Adicionar ao banco
      const response = await addSupplierToDatabase(supplier);

      if (response.success) {
        setSuccessMessage(`✅ ${supplier.title} adicionado com sucesso!`);
        
        // Remover do resultado após 2 segundos
        setTimeout(() => {
          setResults(results.filter(r => r.id !== supplier.id));
          setSuccessMessage('');
        }, 2000);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Erro ao adicionar fornecedor: ' + err.message);
    } finally {
      setAddingId(null);
    }
  };

  /**
   * Agrupar resultados por fonte
   */
  const groupedResults = {
    local: results.filter(r => r.source === 'local'),
    web: results.filter(r => r.source !== 'local')
  };

  return (
    <div className="search-suppliers">
      {/* Navbar */}
      <Navbar
        user={user}
        onLogout={onLogout}
        currentPage="search"
        onNavigateSearch={onNavigateSearch}
        onNavigateDashboard={onNavigateDashboard}
      />

      {/* HEADER */}
      <div className="search-header">
        <h1>🔍 Buscar Fornecedores</h1>
        <p>Encontre fornecedores de autopeças na web ou no nosso banco de dados</p>
      </div>

      {/* FORMULÁRIO DE BUSCA */}
      <form className="search-form" onSubmit={handleSearch}>
        <div className="search-input-group">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Digite o nome do fornecedor ou tipo de peça..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button" disabled={loading}>
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
      </form>

      {/* MENSAGENS */}
      {error && (
        <div className="message error-message">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {successMessage && (
        <div className="message success-message">
          {successMessage}
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="loading-container">
          <div className="loader"></div>
          <p>Buscando em múltiplas fontes...</p>
        </div>
      )}

      {/* RESULTADOS */}
      {!loading && results.length > 0 && (
        <div className="results-container">
          {/* FORNECEDORES CADASTRADOS */}
          {groupedResults.local.length > 0 && (
            <section className="results-section">
              <h2 className="section-title">
                📦 Fornecedores Cadastrados ({groupedResults.local.length})
              </h2>
              <div className="results-grid">
                {groupedResults.local.map(supplier => (
                  <SupplierResultCard
                    key={supplier.id}
                    supplier={supplier}
                    onAdd={handleAddSupplier}
                    isAdding={addingId === supplier.id}
                    isLocal={true}
                  />
                ))}
              </div>
            </section>
          )}

          {/* RESULTADOS DA WEB */}
          {groupedResults.web.length > 0 && (
            <section className="results-section">
              <h2 className="section-title">
                🌐 Resultados da Web ({groupedResults.web.length})
              </h2>
              <div className="results-grid">
                {groupedResults.web.map(supplier => (
                  <SupplierResultCard
                    key={supplier.id}
                    supplier={supplier}
                    onAdd={handleAddSupplier}
                    isAdding={addingId === supplier.id}
                    isLocal={false}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* ESTADO VAZIO */}
      {!loading && results.length === 0 && query && !error && (
        <div className="empty-state">
          <p>Digite algo acima para começar a buscar</p>
        </div>
      )}
    </div>
  );
}

/**
 * COMPONENTE: Card de Resultado
 */
function SupplierResultCard({ supplier, onAdd, isAdding, isLocal }) {
  return (
    <div className={`supplier-result-card ${supplier.source}`}>
      {/* BADGE DE FONTE */}
      <div className="source-badge">
        {supplier.source === 'local' ? '✓ Cadastrado' : 
         supplier.source === 'duckduckgo' ? 'DuckDuckGo' : 
         'Brave'}
      </div>

      {/* CONTEÚDO */}
      <div className="card-content">
        <h3 className="card-title">{supplier.title}</h3>
        <p className="card-description">{supplier.description}</p>

        {/* TAGS */}
        {supplier.tags && supplier.tags.length > 0 && (
          <div className="card-tags">
            {supplier.tags.map((tag, idx) => (
              <span key={idx} className="tag">{tag}</span>
            ))}
          </div>
        )}

        {/* FONTE */}
        <p className="card-source">
          Fonte: <strong>{supplier.source}</strong>
        </p>
      </div>

      {/* BOTÕES */}
      <div className="card-actions">
        {/* BOTÃO ACESSAR */}
        <a
          href={supplier.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary"
          title="Abrir fornecedor em nova aba"
        >
          <ExternalLink size={16} />
          Acessar
        </a>

        {/* BOTÃO ADICIONAR (se não é local) */}
        {!isLocal && (
          <button
            className="btn btn-primary"
            onClick={() => onAdd(supplier)}
            disabled={isAdding}
            title="Adicionar este fornecedor ao banco de dados"
          >
            <Plus size={16} />
            {isAdding ? 'Adicionando...' : 'Adicionar'}
          </button>
        )}

        {/* MENSAGEM (se é local) */}
        {isLocal && (
          <span className="badge-local">
            Já cadastrado
          </span>
        )}
      </div>
    </div>
  );
}
