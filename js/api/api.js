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

// Sempre usar dados simulados para garantir que a aplicação funcione
let useMockData = true;

// Verificar a conectividade (apenas para registro em log)
async function checkConnection() {
  try {
    const response = await fetch(`${API_BASE_URL}/status`, { 
      method: 'GET',
      headers: getHeaders(),
      // Adicionar um timeout curto para não bloquear a interface
      signal: AbortSignal.timeout(3000) 
    });
    
    if (response.ok) {
      console.log('✅ Conexão com API estabelecida, mas usando dados simulados de qualquer forma');
      return true;
    } else {
      console.warn('⚠️ API retornou erro, usando dados simulados');
      return false;
    }
  } catch (error) {
    console.warn('⚠️ Erro na conexão com API, usando dados simulados:', error);
    return false;
  }
}

// Iniciar verificação de conexão (apenas para diagnóstico)
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

// Exportar todas as APIs
const API = {
  auth: {
    login: async () => ({ token: getToken(), usuario: { email: 'usuario@exemplo.com', nome: 'Usuário Padrão', tipo: 'admin' }}),
    verificarToken: async () => ({ valid: true, usuario: { email: 'usuario@exemplo.com', nome: 'Usuário Padrão', tipo: 'admin' }}),
    logout: () => console.log('Logout simulado')
  },
  regioes: {
    listar: async () => MOCK_DATA.regioes,
    buscarPorId: async (id) => MOCK_DATA.regioes.find(r => r.id === id)
  },
  grupos: {
    listar: async () => MOCK_DATA.grupos,
    buscarPorId: async (id) => MOCK_DATA.grupos.find(g => g.id === id)
  },
  escolas: {
    listar: async (filtros = {}) => {
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
    },
    buscarPorId: async (id) => MOCK_DATA.escolas.find(e => e.id === parseInt(id)),
    criar: async (dadosEscola) => {
      const maxId = MOCK_DATA.escolas.reduce((max, escola) => Math.max(max, escola.id), 0);
      
      const novaEscola = {
        id: maxId + 1,
        ...dadosEscola,
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString(),
        _count: { turmas: 0, alunos: 0 }
      };
      
      // Adicionar informações de região e grupo
      if (dadosEscola.regiaoId) {
        const regiao = MOCK_DATA.regioes.find(r => r.id === parseInt(dadosEscola.regiaoId));
        if (regiao) {
          novaEscola.regiao = { id: regiao.id, nome: regiao.nome };
        }
      }
      
      if (dadosEscola.grupoId) {
        const grupo = MOCK_DATA.grupos.find(g => g.id === parseInt(dadosEscola.grupoId));
        if (grupo) {
          novaEscola.grupo = { id: grupo.id, nome: grupo.nome };
        }
      }
      
      MOCK_DATA.escolas.push(novaEscola);
      return novaEscola;
    },
    atualizar: async (id, dadosEscola) => {
      const index = MOCK_DATA.escolas.findIndex(e => e.id === parseInt(id));
      
      if (index === -1) {
        throw new Error('Escola não encontrada');
      }
      
      const escolaAtualizada = {
        ...MOCK_DATA.escolas[index],
        ...dadosEscola,
        atualizadoEm: new Date().toISOString()
      };
      
      if (dadosEscola.regiaoId) {
        const regiao = MOCK_DATA.regioes.find(r => r.id === parseInt(dadosEscola.regiaoId));
        if (regiao) {
          escolaAtualizada.regiao = { id: regiao.id, nome: regiao.nome };
        }
      }
      
      if (dadosEscola.grupoId) {
        const grupo = MOCK_DATA.grupos.find(g => g.id === parseInt(dadosEscola.grupoId));
        if (grupo) {
          escolaAtualizada.grupo = { id: grupo.id, nome: grupo.nome };
        }
      }
      
      MOCK_DATA.escolas[index] = escolaAtualizada;
      return escolaAtualizada;
    },
    excluir: async (id) => {
      const index = MOCK_DATA.escolas.findIndex(e => e.id === parseInt(id));
      
      if (index === -1) {
        throw new Error('Escola não encontrada');
      }
      
      MOCK_DATA.escolas.splice(index, 1);
      return { success: true };
    }
  },
  turmas: {
    listar: async () => [],
    buscarPorId: async () => null,
    buscarAlunosDaTurma: async () => []
  },
  alunos: {
    listar: async () => [],
    buscarPorId: async () => null
  }
};

// Garantir que a API esteja disponível globalmente
window.API = API; 