// escolas-app.js - Script autônomo e completo para gerenciar escolas
// Não depende de nenhum outro arquivo ou biblioteca externa

// Dados simulados locais
const DADOS_SIMULADOS = {
    regioes: [
        { id: 1, nome: "Região 1" },
        { id: 2, nome: "Região 2" },
        { id: 3, nome: "Região 3" },
        { id: 4, nome: "Região 4" },
        { id: 5, nome: "Região 5" }
    ],
    grupos: [
        { id: 1, nome: "Grupo 1" },
        { id: 2, nome: "Grupo 2" },
        { id: 3, nome: "Grupo 3" },
        { id: 4, nome: "Grupo 4" },
        { id: 5, nome: "Grupo 5" }
    ],
    escolas: [
        { 
            id: 1, 
            nome: "Escola Municipal João da Silva", 
            regiaoId: 1, 
            regiao: { id: 1, nome: "Região 1" },
            grupoId: 1, 
            grupo: { id: 1, nome: "Grupo 1" },
            turmas: 8,
            alunos: 240
        },
        { 
            id: 2, 
            nome: "Escola Estadual Maria José", 
            regiaoId: 2, 
            regiao: { id: 2, nome: "Região 2" },
            grupoId: 2, 
            grupo: { id: 2, nome: "Grupo 2" },
            turmas: 12,
            alunos: 360
        }
    ]
};

// Inicialização - executada quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando aplicação de escolas...');
    
    // Cache dos elementos DOM
    const elementos = {
        btnNovaEscola: document.getElementById('btn-nova-escola'),
        modalEscola: document.getElementById('modal-escola'),
        fecharModal: document.getElementById('fechar-modal'),
        cancelarEscola: document.getElementById('cancelar-escola'),
        formEscola: document.getElementById('form-escola'),
        filtroRegiao: document.getElementById('filtro-regiao'),
        filtroGrupo: document.getElementById('filtro-grupo'),
        pesquisa: document.getElementById('pesquisa'),
        tbody: document.querySelector('table tbody'),
        totalResultados: document.querySelector('.text-sm.text-gray-700'),
        
        // Elementos do formulário
        nomeEscola: document.getElementById('nome-escola'),
        regiaoEscola: document.getElementById('regiao-escola'),
        grupoEscola: document.getElementById('grupo-escola')
    };
    
    // Estado da aplicação
    const estado = {
        escolas: [...DADOS_SIMULADOS.escolas],
        filtros: {
            regiaoId: '',
            grupoId: '',
            search: ''
        },
        escolaEmEdicao: null
    };
    
    // Inicializar os dados
    inicializarDados();
    
    // Configurar eventos
    configurarEventos();
    
    // Funções de inicialização
    function inicializarDados() {
        // Preencher selects de regiões
        preencherSelect(elementos.regiaoEscola, DADOS_SIMULADOS.regioes, 'Selecione uma região');
        preencherSelect(elementos.filtroRegiao, DADOS_SIMULADOS.regioes, 'Todas as regiões');
        
        // Preencher selects de grupos
        preencherSelect(elementos.grupoEscola, DADOS_SIMULADOS.grupos, 'Selecione um grupo');
        preencherSelect(elementos.filtroGrupo, DADOS_SIMULADOS.grupos, 'Todos os grupos');
        
        // Carregar escolas iniciais
        atualizarTabelaEscolas();
    }
    
    function configurarEventos() {
        // Eventos do modal
        if (elementos.btnNovaEscola) elementos.btnNovaEscola.addEventListener('click', abrirModalNovaEscola);
        if (elementos.fecharModal) elementos.fecharModal.addEventListener('click', fecharModal);
        if (elementos.cancelarEscola) elementos.cancelarEscola.addEventListener('click', fecharModal);
        if (elementos.formEscola) elementos.formEscola.addEventListener('submit', salvarEscola);
        
        // Eventos de filtro
        if (elementos.filtroRegiao) elementos.filtroRegiao.addEventListener('change', aplicarFiltros);
        if (elementos.filtroGrupo) elementos.filtroGrupo.addEventListener('change', aplicarFiltros);
        if (elementos.pesquisa) elementos.pesquisa.addEventListener('input', aplicarFiltros);
    }
    
    // Funções auxiliares
    function preencherSelect(selectElement, opcoes, textoDefault) {
        if (!selectElement) return;
        
        selectElement.innerHTML = '';
        
        // Opção padrão
        const optionDefault = document.createElement('option');
        optionDefault.value = '';
        optionDefault.textContent = textoDefault;
        selectElement.appendChild(optionDefault);
        
        // Adicionar todas as opções
        opcoes.forEach(opcao => {
            const option = document.createElement('option');
            option.value = opcao.id;
            option.textContent = opcao.nome;
            selectElement.appendChild(option);
        });
    }
    
    // Funções de manipulação de escolas
    function aplicarFiltros() {
        // Atualizar estado dos filtros
        estado.filtros.regiaoId = elementos.filtroRegiao ? elementos.filtroRegiao.value : '';
        estado.filtros.grupoId = elementos.filtroGrupo ? elementos.filtroGrupo.value : '';
        estado.filtros.search = elementos.pesquisa ? elementos.pesquisa.value.toLowerCase() : '';
        
        // Atualizar tabela com os novos filtros
        atualizarTabelaEscolas();
    }
    
    function atualizarTabelaEscolas() {
        if (!elementos.tbody) return;
        
        // Aplicar filtros
        let escolasFiltradas = [...estado.escolas];
        
        if (estado.filtros.regiaoId) {
            escolasFiltradas = escolasFiltradas.filter(escola => 
                escola.regiaoId === parseInt(estado.filtros.regiaoId)
            );
        }
        
        if (estado.filtros.grupoId) {
            escolasFiltradas = escolasFiltradas.filter(escola => 
                escola.grupoId === parseInt(estado.filtros.grupoId)
            );
        }
        
        if (estado.filtros.search) {
            escolasFiltradas = escolasFiltradas.filter(escola => 
                escola.nome.toLowerCase().includes(estado.filtros.search)
            );
        }
        
        // Limpar tabela
        elementos.tbody.innerHTML = '';
        
        // Verificar se existem resultados
        if (escolasFiltradas.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td colspan="7" class="px-6 py-4 text-center text-gray-500">
                    Nenhuma escola encontrada
                </td>
            `;
            elementos.tbody.appendChild(tr);
        } else {
            // Adicionar escolas à tabela
            escolasFiltradas.forEach(escola => {
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
                        ${escola.turmas || 0}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${escola.alunos || 0}
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
                elementos.tbody.appendChild(tr);
            });
            
            // Configurar os botões de editar e excluir
            document.querySelectorAll('.btn-editar').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = parseInt(this.getAttribute('data-id'));
                    editarEscola(id);
                });
            });
            
            document.querySelectorAll('.btn-excluir').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = parseInt(this.getAttribute('data-id'));
                    excluirEscola(id);
                });
            });
        }
        
        // Atualizar contador de resultados
        if (elementos.totalResultados) {
            elementos.totalResultados.innerHTML = `
                Mostrando <span class="font-medium">${escolasFiltradas.length}</span> resultados
            `;
        }
    }
    
    // Funções de modal e formulário
    function abrirModalNovaEscola() {
        // Resetar o estado de edição
        estado.escolaEmEdicao = null;
        
        // Limpar formulário
        if (elementos.formEscola) elementos.formEscola.reset();
        
        // Restaurar o botão de salvar
        const btnSubmit = elementos.formEscola.querySelector('button[type="submit"]');
        if (btnSubmit) btnSubmit.textContent = 'Salvar';
        
        // Mostrar modal
        if (elementos.modalEscola) elementos.modalEscola.classList.remove('hidden');
        
        // Focar no primeiro campo
        if (elementos.nomeEscola) elementos.nomeEscola.focus();
    }
    
    function fecharModal() {
        if (elementos.modalEscola) elementos.modalEscola.classList.add('hidden');
    }
    
    function salvarEscola(e) {
        e.preventDefault();
        
        // Validar formulário
        const nome = elementos.nomeEscola.value.trim();
        const regiaoId = parseInt(elementos.regiaoEscola.value);
        const grupoId = elementos.grupoEscola.value ? parseInt(elementos.grupoEscola.value) : null;
        
        if (!nome) {
            alert('Por favor, informe o nome da escola.');
            return;
        }
        
        if (!regiaoId) {
            alert('Por favor, selecione a região da escola.');
            return;
        }
        
        // Buscar objetos de região e grupo
        const regiao = DADOS_SIMULADOS.regioes.find(r => r.id === regiaoId);
        const grupo = grupoId ? DADOS_SIMULADOS.grupos.find(g => g.id === grupoId) : null;
        
        if (estado.escolaEmEdicao) {
            // Modo de edição - atualizar escola existente
            const index = estado.escolas.findIndex(e => e.id === estado.escolaEmEdicao);
            
            if (index !== -1) {
                estado.escolas[index] = {
                    ...estado.escolas[index],
                    nome,
                    regiaoId,
                    regiao,
                    grupoId,
                    grupo
                };
                
                alert('Escola atualizada com sucesso!');
            }
        } else {
            // Modo de criação - adicionar nova escola
            const novaEscola = {
                id: estado.escolas.length > 0 
                    ? Math.max(...estado.escolas.map(e => e.id)) + 1 
                    : 1,
                nome,
                regiaoId,
                regiao,
                grupoId,
                grupo,
                turmas: 0,
                alunos: 0
            };
            
            estado.escolas.push(novaEscola);
            alert('Escola cadastrada com sucesso!');
        }
        
        // Atualizar tabela e fechar modal
        atualizarTabelaEscolas();
        fecharModal();
    }
    
    function editarEscola(id) {
        // Encontrar a escola pelo ID
        const escola = estado.escolas.find(e => e.id === id);
        
        if (!escola) {
            alert('Escola não encontrada!');
            return;
        }
        
        // Preencher formulário com os dados da escola
        elementos.nomeEscola.value = escola.nome;
        elementos.regiaoEscola.value = escola.regiaoId;
        elementos.grupoEscola.value = escola.grupoId || '';
        
        // Salvar referência à escola em edição
        estado.escolaEmEdicao = id;
        
        // Alterar texto do botão
        const btnSubmit = elementos.formEscola.querySelector('button[type="submit"]');
        if (btnSubmit) btnSubmit.textContent = 'Atualizar';
        
        // Abrir o modal
        elementos.modalEscola.classList.remove('hidden');
    }
    
    function excluirEscola(id) {
        if (!confirm('Tem certeza que deseja excluir esta escola?')) {
            return;
        }
        
        // Encontrar índice da escola
        const index = estado.escolas.findIndex(e => e.id === id);
        
        if (index === -1) {
            alert('Escola não encontrada!');
            return;
        }
        
        // Remover escola
        estado.escolas.splice(index, 1);
        alert('Escola excluída com sucesso!');
        
        // Atualizar tabela
        atualizarTabelaEscolas();
    }
}); 