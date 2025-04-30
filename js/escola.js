document.addEventListener('DOMContentLoaded', async function() {
    // Verificar se o objeto API existe, caso contrário criar uma versão mínima
    if (typeof API === 'undefined') {
        console.warn('⚠️ API não encontrada, criando versão de fallback');
        
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
        
        // Criar API de fallback
        window.API = {
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
                    
                    MOCK_DATA.escolas.push(novaEscola);
                    return novaEscola;
                },
                atualizar: async (id, dadosEscola) => {
                    const index = MOCK_DATA.escolas.findIndex(e => e.id === id);
                    
                    if (index === -1) {
                        throw new Error('Escola não encontrada');
                    }
                    
                    const escolaAtualizada = {
                        ...MOCK_DATA.escolas[index],
                        ...dadosEscola,
                        atualizadoEm: new Date().toISOString()
                    };
                    
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
                    
                    MOCK_DATA.escolas[index] = escolaAtualizada;
                    return escolaAtualizada;
                },
                excluir: async (id) => {
                    const index = MOCK_DATA.escolas.findIndex(e => e.id === id);
                    
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
    }
    
    // Referências aos elementos
    const btnNovaEscola = document.getElementById('btn-nova-escola');
    const modalEscola = document.getElementById('modal-escola');
    const fecharModal = document.getElementById('fechar-modal');
    const cancelarEscola = document.getElementById('cancelar-escola');
    const formEscola = document.getElementById('form-escola');
    const filtroRegiao = document.getElementById('filtro-regiao');
    const filtroGrupo = document.getElementById('filtro-grupo');
    const pesquisa = document.getElementById('pesquisa');
    
    // Armazenar as escolas
    let escolas = [];
    let regioes = [];
    let grupos = [];
    
    // Carregar dados iniciais
    try {
        await carregarDados();
    } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error);
        // Não exibir alerta para não assustar o usuário
        // Tentar carregar dados básicos para que a interface continue funcionando
        escolas = API.escolas.listar();
        atualizarTabela();
    }
    
    // Event Listeners
    if (btnNovaEscola) btnNovaEscola.addEventListener('click', abrirModal);
    if (fecharModal) fecharModal.addEventListener('click', fecharModalEscola);
    if (cancelarEscola) cancelarEscola.addEventListener('click', fecharModalEscola);
    if (formEscola) formEscola.addEventListener('submit', salvarEscola);
    if (filtroRegiao) filtroRegiao.addEventListener('change', filtrarEscolas);
    if (filtroGrupo) filtroGrupo.addEventListener('change', filtrarEscolas);
    if (pesquisa) pesquisa.addEventListener('input', filtrarEscolas);
    
    // Configurar eventos para os botões de editar e excluir
    configurarBotoes();
    
    // Funções
    async function carregarDados() {
        try {
            // Carregar as regiões
            regioes = await API.regioes.listar();
            
            // Preencher o select de regiões
            const regiaoSelect = document.getElementById('regiao-escola');
            const filtroRegiaoSelect = document.getElementById('filtro-regiao');
            
            if (regiaoSelect) {
                regiaoSelect.innerHTML = '<option value="">Selecione uma região</option>';
                regioes.forEach(regiao => {
                    const option = document.createElement('option');
                    option.value = regiao.id;
                    option.textContent = regiao.nome;
                    regiaoSelect.appendChild(option);
                });
            }
            
            if (filtroRegiaoSelect) {
                filtroRegiaoSelect.innerHTML = '<option value="">Todas as regiões</option>';
                regioes.forEach(regiao => {
                    const option = document.createElement('option');
                    option.value = regiao.id;
                    option.textContent = regiao.nome;
                    filtroRegiaoSelect.appendChild(option);
                });
            }
            
            // Carregar os grupos
            grupos = await API.grupos.listar();
            
            // Preencher o select de grupos
            const grupoSelect = document.getElementById('grupo-escola');
            const filtroGrupoSelect = document.getElementById('filtro-grupo');
            
            if (grupoSelect) {
                grupoSelect.innerHTML = '<option value="">Selecione um grupo</option>';
                grupos.forEach(grupo => {
                    const option = document.createElement('option');
                    option.value = grupo.id;
                    option.textContent = grupo.nome;
                    grupoSelect.appendChild(option);
                });
            }
            
            if (filtroGrupoSelect) {
                filtroGrupoSelect.innerHTML = '<option value="">Todos os grupos</option>';
                grupos.forEach(grupo => {
                    const option = document.createElement('option');
                    option.value = grupo.id;
                    option.textContent = grupo.nome;
                    filtroGrupoSelect.appendChild(option);
                });
            }
            
            // Carregar as escolas
            await carregarEscolas();
        } catch (error) {
            console.error('Erro ao carregar dados iniciais:', error);
            // Não exibir alerta para não assustar o usuário
            throw error; // Repassar o erro para ser tratado no nível superior
        }
    }
    
    async function carregarEscolas() {
        try {
            const filtros = {};
            
            if (filtroRegiao && filtroRegiao.value) {
                filtros.regiaoId = filtroRegiao.value;
            }
            
            if (filtroGrupo && filtroGrupo.value) {
                filtros.grupoId = filtroGrupo.value;
            }
            
            if (pesquisa && pesquisa.value) {
                filtros.search = pesquisa.value;
            }
            
            escolas = await API.escolas.listar(filtros);
            atualizarTabela();
        } catch (error) {
            console.error('Erro ao carregar escolas:', error);
            // Não exibir alerta para não assustar o usuário
            // Usar a variável escolas atual, mesmo que vazia
            atualizarTabela();
        }
    }
    
    function filtrarEscolas() {
        carregarEscolas();
    }
    
    function abrirModal() {
        modalEscola.classList.remove('hidden');
        document.getElementById('nome-escola').focus();
        
        // Limpar o formulário
        formEscola.reset();
        formEscola.removeAttribute('data-editing-id');
        
        // Restaurar o botão de salvar
        const btnSubmit = formEscola.querySelector('button[type="submit"]');
        btnSubmit.textContent = 'Salvar';
    }
    
    function fecharModalEscola() {
        modalEscola.classList.add('hidden');
        formEscola.reset();
        formEscola.removeAttribute('data-editing-id');
    }
    
    async function salvarEscola(e) {
        e.preventDefault();
        
        const nomeEscola = document.getElementById('nome-escola').value;
        const regiaoId = document.getElementById('regiao-escola').value;
        const grupoId = document.getElementById('grupo-escola').value;
        
        if (!nomeEscola) {
            alert('Por favor, informe o nome da escola.');
            return;
        }
        
        if (!regiaoId) {
            alert('Por favor, selecione a região da escola.');
            return;
        }
        
        // Preparar os dados da escola
        const dadosEscola = {
            nome: nomeEscola,
            regiaoId: Number(regiaoId),
            grupoId: grupoId ? Number(grupoId) : null
        };
        
        try {
            const idEdicao = formEscola.getAttribute('data-editing-id');
            
            if (idEdicao) {
                // Atualizar uma escola existente
                await API.escolas.atualizar(Number(idEdicao), dadosEscola);
                alert('Escola atualizada com sucesso!');
            } else {
                // Criar uma nova escola
                await API.escolas.criar(dadosEscola);
                alert('Escola cadastrada com sucesso!');
            }
            
            // Recarregar as escolas e fechar o modal
            await carregarEscolas();
            fecharModalEscola();
            
        } catch (error) {
            console.error('Erro ao salvar escola:', error);
            alert(error.message || 'Erro ao salvar escola. Por favor, tente novamente mais tarde.');
        }
    }
    
    function atualizarTabela() {
        const tbody = document.querySelector('table tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        if (escolas.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td colspan="7" class="px-6 py-4 text-center text-gray-500">
                    Nenhuma escola encontrada
                </td>
            `;
            tbody.appendChild(tr);
            return;
        }
        
        escolas.forEach(escola => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${escola.id}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${escola.nome}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${escola.regiao ? escola.regiao.nome : '-'}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${escola.grupo ? escola.grupo.nome : '-'}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${escola._count ? escola._count.turmas : 0}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button class="text-blue-600 hover:text-blue-900 mr-3 btn-editar" data-id="${escola.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="text-red-600 hover:text-red-900 btn-excluir" data-id="${escola.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        // Reconfigura os botões após atualizar a tabela
        configurarBotoes();
        
        // Atualizar contador de resultados
        const resultadosMsg = document.querySelector('.bg-white.px-4.py-3 .text-sm.text-gray-700');
        if (resultadosMsg) {
            resultadosMsg.innerHTML = `
                Mostrando <span class="font-medium">${escolas.length}</span> resultados
            `;
        }
    }
    
    function configurarBotoes() {
        // Botões de editar
        document.querySelectorAll('.btn-editar').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                editarEscola(id);
            });
        });
        
        // Botões de excluir
        document.querySelectorAll('.btn-excluir').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                excluirEscola(id);
            });
        });
    }
    
    async function editarEscola(id) {
        try {
            // Buscar os dados da escola
            const escola = await API.escolas.buscarPorId(id);
            
            if (escola) {
                document.getElementById('nome-escola').value = escola.nome;
                document.getElementById('regiao-escola').value = escola.regiaoId;
                document.getElementById('grupo-escola').value = escola.grupoId || '';
                
                // Modificar o formulário para modo de edição
                formEscola.setAttribute('data-editing-id', id);
                
                // Alterar o texto do botão para "Atualizar"
                const btnSubmit = formEscola.querySelector('button[type="submit"]');
                btnSubmit.textContent = 'Atualizar';
                
                // Abrir o modal
                modalEscola.classList.remove('hidden');
            }
        } catch (error) {
            console.error('Erro ao buscar dados da escola:', error);
            alert(error.message || 'Erro ao buscar dados da escola. Por favor, tente novamente mais tarde.');
        }
    }
    
    async function excluirEscola(id) {
        if (confirm('Tem certeza que deseja excluir esta escola?')) {
            try {
                await API.escolas.excluir(id);
                alert('Escola excluída com sucesso!');
                await carregarEscolas();
            } catch (error) {
                console.error('Erro ao excluir escola:', error);
                alert(error.message || 'Erro ao excluir escola. Por favor, tente novamente mais tarde.');
            }
        }
    }
}); 