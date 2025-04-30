// Configuração base da API
// Função para determinar a URL base correta dependendo do ambiente
function getApiBaseUrl() {
  // Em produção na Vercel, usamos o caminho relativo
  const host = window.location.origin;
  console.log("Origin:", host);
  return `${host}/api`;
}

const API_BASE_URL = getApiBaseUrl();
console.log("API URL:", API_BASE_URL);

// Dados simulados para fallback
const MOCK_DATA = {
  regioes: [
    { id: 1, nome: "Região 1", criadoEm: "2023-01-01", atualizadoEm: "2023-01-01" },
    { id: 2, nome: "Região 2", criadoEm: "2023-01-01", atualizadoEm: "2023-01-01" },
    { id: 3, nome: "Região 3", criadoEm: "2023-01-01", atualizadoEm: "2023-01-01" },
    { id: 4, nome: "Região 4", criadoEm: "2023-01-01", atualizadoEm: "2023-01-01" },
    { id: 5, nome: "Região 5", criadoEm: "2023-01-01", atualizadoEm: "2023-01-01" }
  ],
  grupos: [
    { id: 1, nome: "Grupo 1", criadoEm: "2023-01-01", atualizadoEm: "2023-01-01" },
    { id: 2, nome: "Grupo 2", criadoEm: "2023-01-01", atualizadoEm: "2023-01-01" },
    { id: 3, nome: "Grupo 3", criadoEm: "2023-01-01", atualizadoEm: "2023-01-01" },
    { id: 4, nome: "Grupo 4", criadoEm: "2023-01-01", atualizadoEm: "2023-01-01" },
    { id: 5, nome: "Grupo 5", criadoEm: "2023-01-01", atualizadoEm: "2023-01-01" }
  ],
  escolas: [
    { 
      id: 1, 
      nome: "Escola Municipal João da Silva", 
      regiaoId: 1, 
      regiao: { id: 1, nome: "Região 1" },
      grupoId: 1, 
      grupo: { id: 1, nome: "Grupo 1" },
      criadoEm: "2023-01-01", 
      atualizadoEm: "2023-01-01",
      _count: { turmas: 8, alunos: 240 }
    },
    { 
      id: 2, 
      nome: "Escola Estadual Maria José", 
      regiaoId: 2, 
      regiao: { id: 2, nome: "Região 2" },
      grupoId: 2, 
      grupo: { id: 2, nome: "Grupo 2" },
      criadoEm: "2023-01-01", 
      atualizadoEm: "2023-01-01",
      _count: { turmas: 12, alunos: 360 }
    }
  ]
};

// Flag para indicar se devemos usar dados simulados
let useMockData = true;

// Verificar a conectividade e decidir usar mock data
async function checkConnection() {
  try {
    const response = await fetch(`${API_BASE_URL}/status`, { 
      method: 'GET',
      headers: getHeaders(),
      // Adicionar um timeout curto para não bloquear a interface
      signal: AbortSignal.timeout(3000) 
    });
    
    if (response.ok) {
      console.log('✅ Conexão com API estabelecida');
      // Manter usando dados simulados mesmo com API disponível
      useMockData = true;
      return true;
    } else {
      console.warn('⚠️ API retornou erro, usando dados simulados');
      useMockData = true;
      return false;
    }
  } catch (error) {
    console.warn('⚠️ Erro na conexão com API, usando dados simulados:', error);
    useMockData = true;
    return false;
  }
}

// Iniciar verificação de conexão
checkConnection();

// Função para obter o token - sempre retorna um token fixo (simulando autenticação permanente)
const getToken = () => 'token-simulado-autenticacao-permanente';

// Headers básicos para todas as requisições
const getHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
  };
};

// Função para verificar se a resposta é válida
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: 'Ocorreu um erro na requisição'
    }));
    throw new Error(error.error || 'Ocorreu um erro na requisição');
  }
  
  return response.json();
};

// API de autenticação - simplificada pois não há mais login
const authAPI = {
  // Mantemos o método login, mas ele apenas simula um login bem-sucedido
  login: async (email, senha) => {
    // Simula uma resposta de login bem-sucedida
    return {
      token: getToken(),
      usuario: {
        email: email || 'usuario@exemplo.com',
        nome: 'Usuário Padrão',
        tipo: 'admin'
      }
    };
  },
  
  // Sempre retorna que o token é válido
  verificarToken: async () => {
    return { 
      valid: true,
      usuario: {
        email: 'usuario@exemplo.com',
        nome: 'Usuário Padrão',
        tipo: 'admin'
      }
    };
  },
  
  // Método de logout mantido por compatibilidade
  logout: () => {
    // Não faz nada, pois não há mais necessidade de logout
    console.log('Logout simulado');
  }
};

// API de escolas
const escolasAPI = {
  listar: async (filtros = {}) => {
    // Se estiver usando dados simulados, retorna imediatamente
    if (useMockData) {
      console.log('📋 Usando dados simulados para escolas');
      
      // Aplicar filtros aos dados simulados
      let result = [...MOCK_DATA.escolas];
      
      if (filtros.regiaoId) {
        result = result.filter(escola => escola.regiaoId === parseInt(filtros.regiaoId));
      }
      
      if (filtros.grupoId) {
        result = result.filter(escola => escola.grupoId === parseInt(filtros.grupoId));
      }
      
      if (filtros.search) {
        const searchLower = filtros.search.toLowerCase();
        result = result.filter(escola => escola.nome.toLowerCase().includes(searchLower));
      }
      
      return result;
    }
  
    // Construir query string com os filtros
    const queryParams = new URLSearchParams();
    if (filtros.regiaoId) queryParams.append('regiaoId', filtros.regiaoId);
    if (filtros.grupoId) queryParams.append('grupoId', filtros.grupoId);
    if (filtros.search) queryParams.append('search', filtros.search);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    const response = await fetch(`${API_BASE_URL}/escolas${queryString}`, {
      method: 'GET',
      headers: getHeaders()
    });
    
    return handleResponse(response);
  },
  
  buscarPorId: async (id) => {
    // Se estiver usando dados simulados, retorna imediatamente
    if (useMockData) {
      console.log(`📋 Usando dados simulados para escola com ID ${id}`);
      const escola = MOCK_DATA.escolas.find(e => e.id === id);
      
      if (!escola) {
        throw new Error('Escola não encontrada');
      }
      
      return escola;
    }
    
    const response = await fetch(`${API_BASE_URL}/escolas/${id}`, {
      method: 'GET',
      headers: getHeaders()
    });
    
    return handleResponse(response);
  },
  
  criar: async (dadosEscola) => {
    // Se estiver usando dados simulados, simula a criação
    if (useMockData) {
      console.log('📋 Simulando criação de escola:', dadosEscola);
      
      // Encontrar o maior ID para criar um novo
      const maxId = MOCK_DATA.escolas.reduce((max, escola) => Math.max(max, escola.id), 0);
      
      // Crie um novo objeto com os dados fornecidos
      const novaEscola = {
        id: maxId + 1,
        ...dadosEscola,
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString(),
        _count: { turmas: 0, alunos: 0 }
      };
      
      // Adicionar informações de região e grupo
      if (dadosEscola.regiaoId) {
        const regiao = MOCK_DATA.regioes.find(r => r.id === dadosEscola.regiaoId);
        if (regiao) {
          novaEscola.regiao = { id: regiao.id, nome: regiao.nome };
        }
      }
      
      if (dadosEscola.grupoId) {
        const grupo = MOCK_DATA.grupos.find(g => g.id === dadosEscola.grupoId);
        if (grupo) {
          novaEscola.grupo = { id: grupo.id, nome: grupo.nome };
        }
      }
      
      // Adicionar ao array de escolas
      MOCK_DATA.escolas.push(novaEscola);
      
      return novaEscola;
    }
    
    const response = await fetch(`${API_BASE_URL}/escolas`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(dadosEscola)
    });
    
    return handleResponse(response);
  },
  
  atualizar: async (id, dadosEscola) => {
    // Se estiver usando dados simulados, simula a atualização
    if (useMockData) {
      console.log(`📋 Simulando atualização de escola com ID ${id}:`, dadosEscola);
      
      // Encontrar a escola a ser atualizada
      const index = MOCK_DATA.escolas.findIndex(e => e.id === id);
      
      if (index === -1) {
        throw new Error('Escola não encontrada');
      }
      
      // Atualizar os dados
      const escolaAtualizada = {
        ...MOCK_DATA.escolas[index],
        ...dadosEscola,
        atualizadoEm: new Date().toISOString()
      };
      
      // Atualizar informações de região e grupo se necessário
      if (dadosEscola.regiaoId) {
        const regiao = MOCK_DATA.regioes.find(r => r.id === dadosEscola.regiaoId);
        if (regiao) {
          escolaAtualizada.regiao = { id: regiao.id, nome: regiao.nome };
        }
      }
      
      if (dadosEscola.grupoId) {
        const grupo = MOCK_DATA.grupos.find(g => g.id === dadosEscola.grupoId);
        if (grupo) {
          escolaAtualizada.grupo = { id: grupo.id, nome: grupo.nome };
        }
      }
      
      // Atualizar no array
      MOCK_DATA.escolas[index] = escolaAtualizada;
      
      return escolaAtualizada;
    }
    
    const response = await fetch(`${API_BASE_URL}/escolas/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(dadosEscola)
    });
    
    return handleResponse(response);
  },
  
  excluir: async (id) => {
    // Se estiver usando dados simulados, simula a exclusão
    if (useMockData) {
      console.log(`📋 Simulando exclusão de escola com ID ${id}`);
      
      // Verificar se a escola existe
      const index = MOCK_DATA.escolas.findIndex(e => e.id === id);
      
      if (index === -1) {
        throw new Error('Escola não encontrada');
      }
      
      // Remover do array
      MOCK_DATA.escolas.splice(index, 1);
      
      return { success: true };
    }
    
    const response = await fetch(`${API_BASE_URL}/escolas/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    
    return handleResponse(response);
  }
};

// API de regiões
const regioesAPI = {
  listar: async (search = '') => {
    // Se estiver usando dados simulados, retorna imediatamente
    if (useMockData) {
      console.log('📋 Usando dados simulados para regiões');
      
      // Aplicar filtro de pesquisa se necessário
      if (search) {
        const searchLower = search.toLowerCase();
        return MOCK_DATA.regioes.filter(r => r.nome.toLowerCase().includes(searchLower));
      }
      
      return MOCK_DATA.regioes;
    }
    
    // Construir query string com os filtros
    const queryParams = new URLSearchParams();
    if (search) queryParams.append('search', search);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    const response = await fetch(`${API_BASE_URL}/regioes${queryString}`, {
      method: 'GET',
      headers: getHeaders()
    });
    
    return handleResponse(response);
  },
  
  buscarPorId: async (id) => {
    const response = await fetch(`${API_BASE_URL}/regioes/${id}`, {
      method: 'GET',
      headers: getHeaders()
    });
    
    return handleResponse(response);
  },
  
  criar: async (nome) => {
    const response = await fetch(`${API_BASE_URL}/regioes`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ nome })
    });
    
    return handleResponse(response);
  },
  
  atualizar: async (id, nome) => {
    const response = await fetch(`${API_BASE_URL}/regioes/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ nome })
    });
    
    return handleResponse(response);
  },
  
  excluir: async (id) => {
    const response = await fetch(`${API_BASE_URL}/regioes/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    
    return handleResponse(response);
  }
};

// API de grupos
const gruposAPI = {
  listar: async (search = '') => {
    // Se estiver usando dados simulados, retorna imediatamente
    if (useMockData) {
      console.log('📋 Usando dados simulados para grupos');
      
      // Aplicar filtro de pesquisa se necessário
      if (search) {
        const searchLower = search.toLowerCase();
        return MOCK_DATA.grupos.filter(g => g.nome.toLowerCase().includes(searchLower));
      }
      
      return MOCK_DATA.grupos;
    }
    
    // Construir query string com os filtros
    const queryParams = new URLSearchParams();
    if (search) queryParams.append('search', search);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    const response = await fetch(`${API_BASE_URL}/grupos${queryString}`, {
      method: 'GET',
      headers: getHeaders()
    });
    
    return handleResponse(response);
  },
  
  buscarPorId: async (id) => {
    const response = await fetch(`${API_BASE_URL}/grupos/${id}`, {
      method: 'GET',
      headers: getHeaders()
    });
    
    return handleResponse(response);
  },
  
  criar: async (nome) => {
    const response = await fetch(`${API_BASE_URL}/grupos`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ nome })
    });
    
    return handleResponse(response);
  },
  
  atualizar: async (id, nome) => {
    const response = await fetch(`${API_BASE_URL}/grupos/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ nome })
    });
    
    return handleResponse(response);
  },
  
  excluir: async (id) => {
    const response = await fetch(`${API_BASE_URL}/grupos/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    
    return handleResponse(response);
  }
};

// API de turmas
const turmasAPI = {
  listar: async (escolaId = null) => {
    const queryString = escolaId ? `?escolaId=${escolaId}` : '';
    
    const response = await fetch(`${API_BASE_URL}/turmas${queryString}`, {
      method: 'GET',
      headers: getHeaders()
    });
    
    return handleResponse(response);
  },
  
  buscarPorId: async (id) => {
    const response = await fetch(`${API_BASE_URL}/turmas/${id}`, {
      method: 'GET',
      headers: getHeaders()
    });
    
    return handleResponse(response);
  },
  
  buscarAlunosDaTurma: async (turmaId) => {
    const response = await fetch(`${API_BASE_URL}/turmas/${turmaId}/alunos`, {
      method: 'GET',
      headers: getHeaders()
    });
    
    return handleResponse(response);
  },
  
  criar: async (dadosTurma) => {
    const response = await fetch(`${API_BASE_URL}/turmas`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(dadosTurma)
    });
    
    return handleResponse(response);
  },
  
  atualizar: async (id, dadosTurma) => {
    const response = await fetch(`${API_BASE_URL}/turmas/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(dadosTurma)
    });
    
    return handleResponse(response);
  },
  
  excluir: async (id) => {
    const response = await fetch(`${API_BASE_URL}/turmas/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    
    return handleResponse(response);
  }
};

// Exportar todas as APIs
const API = {
  auth: authAPI,
  escolas: escolasAPI,
  regioes: regioesAPI,
  grupos: gruposAPI,
  turmas: turmasAPI
}; 