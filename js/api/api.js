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
    const response = await fetch(`${API_BASE_URL}/escolas/${id}`, {
      method: 'GET',
      headers: getHeaders()
    });
    
    return handleResponse(response);
  },
  
  criar: async (dadosEscola) => {
    const response = await fetch(`${API_BASE_URL}/escolas`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(dadosEscola)
    });
    
    return handleResponse(response);
  },
  
  atualizar: async (id, dadosEscola) => {
    const response = await fetch(`${API_BASE_URL}/escolas/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(dadosEscola)
    });
    
    return handleResponse(response);
  },
  
  excluir: async (id) => {
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
    const queryString = search ? `?search=${search}` : '';
    
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
    const queryString = search ? `?search=${search}` : '';
    
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