import { supabase } from './supabaseClient';

/**
 * SERVIÇO DE BUSCA AVANÇADA
 * Busca em múltiplas fontes:
 * 1. Banco de dados local (Supabase)
 * 2. DuckDuckGo (gratuito, sem API key)
 * 3. Brave Search API (opcional, com API key)
 */

// ============================================================================
// 1. BUSCA INTERNA (Supabase)
// ============================================================================

export const searchLocalSuppliers = async (query) => {
  try {
    if (!query || query.trim() === '') return [];

    const { data, error } = await supabase
      .from('fornecedores')
      .select('*')
      .or(`nome.ilike.%${query}%,descricao.ilike.%${query}%`)
      .limit(10);

    if (error) throw error;

    // Transformar dados para formato padrão
    return data.map(item => ({
      id: `local-${item.id}`,
      title: item.nome,
      description: item.descricao,
      url: item.url,
      source: 'local',
      tags: ['cadastrado'],
      dbId: item.id // ID original no banco
    }));
  } catch (error) {
    console.error('Erro ao buscar fornecedores locais:', error);
    return [];
  }
};

// ============================================================================
// 2. BUSCA DUCKDUCKGO (Gratuito, sem API key)
// ============================================================================

export const searchDuckDuckGo = async (query) => {
  try {
    const searchQuery = `${query} autopeças fornecedor`;
    
    // DuckDuckGo API endpoint (sem autenticação necessária)
    const response = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(searchQuery)}&format=json`
    );

    if (!response.ok) throw new Error('Erro ao buscar DuckDuckGo');

    const data = await response.json();
    const results = [];

    // Extrair resultados de RelatedTopics
    if (data.RelatedTopics && Array.isArray(data.RelatedTopics)) {
      data.RelatedTopics.slice(0, 5).forEach(topic => {
        if (topic.FirstURL && topic.Text) {
          results.push({
            id: `ddg-${topic.FirstURL}`,
            title: topic.Text.substring(0, 60),
            description: topic.Text,
            url: topic.FirstURL,
            source: 'duckduckgo',
            tags: ['web']
          });
        }
      });
    }

    return results;
  } catch (error) {
    console.error('Erro ao buscar DuckDuckGo:', error);
    return [];
  }
};

// ============================================================================
// 3. BUSCA BRAVE SEARCH API (Opcional, requer API key)
// ============================================================================

export const searchBrave = async (query) => {
  try {
    const apiKey = import.meta.env.VITE_BRAVE_API_KEY;

    // Se não tiver API key, retorna array vazio (é opcional)
    if (!apiKey) {
      console.warn('VITE_BRAVE_API_KEY não configurada. Brave Search desabilitado.');
      return [];
    }

    const searchQuery = `${query} autopeças fornecedor`;

    const response = await fetch(
      `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(searchQuery)}&count=5`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-Subscription-Token': apiKey
        }
      }
    );

    if (!response.ok) {
      console.warn('Erro ao acessar Brave Search:', response.status);
      return [];
    }

    const data = await response.json();
    const results = [];

    // Extrair resultados da API Brave
    if (data.web && Array.isArray(data.web)) {
      data.web.slice(0, 5).forEach(item => {
        results.push({
          id: `brave-${item.url}`,
          title: item.title,
          description: item.description,
          url: item.url,
          source: 'brave',
          tags: ['web']
        });
      });
    }

    return results;
  } catch (error) {
    console.error('Erro ao buscar Brave:', error);
    return [];
  }
};

// ============================================================================
// 4. BUSCA UNIFICADA (Combina todas as fontes)
// ============================================================================

export const searchAll = async (query) => {
  try {
    if (!query || query.trim() === '') return [];

    // Executar todas as buscas em paralelo
    const [localResults, ddgResults, braveResults] = await Promise.all([
      searchLocalSuppliers(query),
      searchDuckDuckGo(query),
      searchBrave(query)
    ]);

    // Combinar todos os resultados
    let allResults = [...localResults, ...ddgResults, ...braveResults];

    // Remover duplicados pela URL
    const uniqueResults = [];
    const seenUrls = new Set();

    allResults.forEach(result => {
      if (!seenUrls.has(result.url)) {
        seenUrls.add(result.url);
        uniqueResults.push(result);
      }
    });

    // Ordenar: resultados locais primeiro, depois outros
    uniqueResults.sort((a, b) => {
      if (a.source === 'local' && b.source !== 'local') return -1;
      if (a.source !== 'local' && b.source === 'local') return 1;
      return 0;
    });

    return uniqueResults;
  } catch (error) {
    console.error('Erro ao buscar em todas as fontes:', error);
    return [];
  }
};

// ============================================================================
// 5. ADICIONAR FORNECEDOR AO BANCO
// ============================================================================

export const addSupplierToDatabase = async (supplier) => {
  try {
    // Validar dados
    if (!supplier.title || !supplier.url) {
      throw new Error('Nome e URL são obrigatórios');
    }

    // Preparar dados
    const newSupplier = {
      nome: supplier.title,
      descricao: supplier.description || 'Fornecedor adicionado via busca',
      url: supplier.url,
      instrucoes: 'Login via site',
      logo_url: null,
      tags: supplier.tags ? supplier.tags.join(',') : 'importado'
    };

    // Inserir no banco
    const { data, error } = await supabase
      .from('fornecedores')
      .insert([newSupplier])
      .select();

    if (error) throw error;

    return {
      success: true,
      message: 'Fornecedor adicionado com sucesso!',
      data: data[0]
    };
  } catch (error) {
    console.error('Erro ao adicionar fornecedor:', error);
    return {
      success: false,
      message: error.message || 'Erro ao adicionar fornecedor'
    };
  }
};

// ============================================================================
// 6. VERIFICAR SE FORNECEDOR JÁ EXISTE
// ============================================================================

export const checkSupplierExists = async (url) => {
  try {
    const { data, error } = await supabase
      .from('fornecedores')
      .select('id')
      .eq('url', url)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    return data ? true : false;
  } catch (error) {
    console.error('Erro ao verificar fornecedor:', error);
    return false;
  }
};

// ============================================================================
// 7. BUSCAR FORNECEDORES POR TAG
// ============================================================================

export const searchByTag = async (tag) => {
  try {
    const { data, error } = await supabase
      .from('fornecedores')
      .select('*')
      .ilike('tags', `%${tag}%`)
      .limit(10);

    if (error) throw error;

    return data.map(item => ({
      id: `local-${item.id}`,
      title: item.nome,
      description: item.descricao,
      url: item.url,
      source: 'local',
      tags: item.tags ? item.tags.split(',') : [],
      dbId: item.id
    }));
  } catch (error) {
    console.error('Erro ao buscar por tag:', error);
    return [];
  }
};

export default {
  searchAll,
  searchLocalSuppliers,
  searchDuckDuckGo,
  searchBrave,
  addSupplierToDatabase,
  checkSupplierExists,
  searchByTag
};
