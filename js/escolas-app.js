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
    
    // Verificar elementos críticos
    console.log('Verificando elementos críticos:');
    console.log('- btnNovaEscola:', elementos.btnNovaEscola ? 'OK' : 'NÃO ENCONTRADO');
    console.log('- modalEscola:', elementos.modalEscola ? 'OK' : 'NÃO ENCONTRADO');
    console.log('- formEscola:', elementos.formEscola ? 'OK' : 'NÃO ENCONTRADO');
    console.log('- nomeEscola:', elementos.nomeEscola ? 'OK' : 'NÃO ENCONTRADO');
    console.log('- regiaoEscola:', elementos.regiaoEscola ? 'OK' : 'NÃO ENCONTRADO');
    console.log('- grupoEscola:', elementos.grupoEscola ? 'OK' : 'NÃO ENCONTRADO');
    
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
        console.log('Inicializando dados...');
        
        try {
            // Preencher selects de regiões
            preencherSelect(elementos.regiaoEscola, DADOS_SIMULADOS.regioes, 'Selecione uma região');
            preencherSelect(elementos.filtroRegiao, DADOS_SIMULADOS.regioes, 'Todas as regiões');
            
            // Preencher selects de grupos
            preencherSelect(elementos.grupoEscola, DADOS_SIMULADOS.grupos, 'Selecione um grupo');
            preencherSelect(elementos.filtroGrupo, DADOS_SIMULADOS.grupos, 'Todos os grupos');
            
            // Carregar escolas iniciais
            atualizarTabelaEscolas();
            
            console.log('Dados inicializados com sucesso!');
        } catch (error) {
            console.error('Erro ao inicializar dados:', error);
        }
    }
    
    function configurarEventos() {
        console.log('Configurando eventos...');
        
        try {
            // Evento de abrir o modal (botão Nova Escola)
            if (elementos.btnNovaEscola) {
                console.log('Configurando evento para botão Nova Escola');
                elementos.btnNovaEscola.addEventListener('click', function() {
                    console.log('Botão Nova Escola clicado');
                    abrirModal();
                });
            }
            
            // Eventos do modal para fechar
            if (elementos.fecharModal) {
                elementos.fecharModal.addEventListener('click', function() {
                    console.log('Botão Fechar Modal clicado');
                    fecharModal();
                });
            }
            
            if (elementos.cancelarEscola) {
                elementos.cancelarEscola.addEventListener('click', function() {
                    console.log('Botão Cancelar clicado');
                    fecharModal();
                });
            }
            
            // Evento de submit do formulário
            if (elementos.formEscola) {
                console.log('Configurando evento para formulário');
                elementos.formEscola.addEventListener('submit', function(e) {
                    console.log('Formulário enviado');
                    salvarEscola(e);
                });
            }
            
            // Eventos de filtro
            if (elementos.filtroRegiao) {
                elementos.filtroRegiao.addEventListener('change', aplicarFiltros);
            }
            
            if (elementos.filtroGrupo) {
                elementos.filtroGrupo.addEventListener('change', aplicarFiltros);
            }
            
            if (elementos.pesquisa) {
                elementos.pesquisa.addEventListener('input', aplicarFiltros);
            }
            
            console.log('Eventos configurados com sucesso!');
        } catch (error) {
            console.error('Erro ao configurar eventos:', error);
        }
    }
    
    // Funções auxiliares
    function preencherSelect(selectElement, opcoes, textoDefault) {
        if (!selectElement) {
            console.warn(`Select não encontrado para preenchimento: ${textoDefault}`);
            return;
        }
        
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
        
        console.log(`Select preenchido: ${textoDefault} com ${opcoes.length} opções`);
    }
    
    // Funções de manipulação de escolas
    function aplicarFiltros() {
        console.log('Aplicando filtros...');
        
        // Atualizar estado dos filtros
        estado.filtros.regiaoId = elementos.filtroRegiao ? elementos.filtroRegiao.value : '';
        estado.filtros.grupoId = elementos.filtroGrupo ? elementos.filtroGrupo.value : '';
        estado.filtros.search = elementos.pesquisa ? elementos.pesquisa.value.toLowerCase() : '';
        
        console.log('Filtros atualizados:', estado.filtros);
        
        // Atualizar tabela com os novos filtros
        atualizarTabelaEscolas();
    }
    
    function atualizarTabelaEscolas() {
        console.log('Atualizando tabela de escolas...');
        
        if (!elementos.tbody) {
            console.error('Elemento tbody não encontrado!');
            return;
        }
        
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
        
        console.log(`Encontradas ${escolasFiltradas.length} escolas após aplicar filtros`);
        
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
                    console.log(`Botão editar clicado para escola ID: ${id}`);
                    editarEscola(id);
                });
            });
            
            document.querySelectorAll('.btn-excluir').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = parseInt(this.getAttribute('data-id'));
                    console.log(`Botão excluir clicado para escola ID: ${id}`);
                    excluirEscola(id);
                });
            });
        }
        
        // Atualizar contador de resultados
        if (elementos.totalResultados) {
            elementos.totalResultados.innerHTML = `
                Mostrando <span class="font-medium">${escolasFiltradas.length}</span> resultados
            `;
        } else {
            console.warn('Elemento totalResultados não encontrado!');
        }
        
        console.log('Tabela atualizada com sucesso!');
    }
    
    // Funções de modal e formulário
    function abrirModal() {
        console.log('Abrindo modal...');
        
        // Resetar o estado de edição
        estado.escolaEmEdicao = null;
        
        // Limpar formulário
        if (elementos.formEscola) {
            elementos.formEscola.reset();
        } else {
            console.error('Formulário não encontrado!');
        }
        
        // Restaurar o botão de salvar
        const btnSubmit = elementos.formEscola?.querySelector('button[type="submit"]');
        if (btnSubmit) {
            btnSubmit.textContent = 'Salvar';
        } else {
            console.warn('Botão de submit não encontrado!');
        }
        
        // Mostrar modal
        if (elementos.modalEscola) {
            elementos.modalEscola.classList.remove('hidden');
            console.log('Modal exibido');
        } else {
            console.error('Modal não encontrado!');
        }
        
        // Focar no primeiro campo
        if (elementos.nomeEscola) {
            elementos.nomeEscola.focus();
        } else {
            console.warn('Campo nome não encontrado!');
        }
    }
    
    function fecharModal() {
        console.log('Fechando modal...');
        
        if (elementos.modalEscola) {
            elementos.modalEscola.classList.add('hidden');
            console.log('Modal ocultado');
        } else {
            console.error('Modal não encontrado!');
        }
        
        // Resetar formulário
        if (elementos.formEscola) {
            elementos.formEscola.reset();
        }
    }
    
    function salvarEscola(e) {
        console.log('Salvando escola...');
        e.preventDefault();
        
        // Validar formulário
        const nome = elementos.nomeEscola ? elementos.nomeEscola.value.trim() : '';
        const regiaoId = elementos.regiaoEscola ? parseInt(elementos.regiaoEscola.value) : 0;
        const grupoId = elementos.grupoEscola && elementos.grupoEscola.value ? parseInt(elementos.grupoEscola.value) : null;
        
        console.log('Dados do formulário:', { nome, regiaoId, grupoId });
        
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
        
        if (!regiao) {
            console.error(`Região com ID ${regiaoId} não encontrada!`);
            alert('Região inválida!');
            return;
        }
        
        if (grupoId && !grupo) {
            console.error(`Grupo com ID ${grupoId} não encontrado!`);
            alert('Grupo inválido!');
            return;
        }
        
        if (estado.escolaEmEdicao) {
            // Modo de edição - atualizar escola existente
            const index = estado.escolas.findIndex(e => e.id === estado.escolaEmEdicao);
            
            if (index !== -1) {
                console.log(`Atualizando escola ID ${estado.escolaEmEdicao}`);
                
                estado.escolas[index] = {
                    ...estado.escolas[index],
                    nome,
                    regiaoId,
                    regiao,
                    grupoId,
                    grupo
                };
                
                console.log('Escola atualizada:', estado.escolas[index]);
                alert('Escola atualizada com sucesso!');
            } else {
                console.error(`Escola com ID ${estado.escolaEmEdicao} não encontrada para edição!`);
                alert('Erro ao atualizar escola!');
            }
        } else {
            // Modo de criação - adicionar nova escola
            const novoId = estado.escolas.length > 0 
                ? Math.max(...estado.escolas.map(e => e.id)) + 1 
                : 1;
                
            console.log(`Criando nova escola com ID ${novoId}`);
            
            const novaEscola = {
                id: novoId,
                nome,
                regiaoId,
                regiao,
                grupoId,
                grupo,
                turmas: 0,
                alunos: 0
            };
            
            estado.escolas.push(novaEscola);
            console.log('Nova escola criada:', novaEscola);
            alert('Escola cadastrada com sucesso!');
        }
        
        // Atualizar tabela e fechar modal
        atualizarTabelaEscolas();
        fecharModal();
    }
    
    function editarEscola(id) {
        console.log(`Editando escola ID ${id}...`);
        
        // Encontrar a escola pelo ID
        const escola = estado.escolas.find(e => e.id === id);
        
        if (!escola) {
            console.error(`Escola com ID ${id} não encontrada!`);
            alert('Escola não encontrada!');
            return;
        }
        
        console.log('Dados da escola para edição:', escola);
        
        // Preencher formulário com os dados da escola
        if (elementos.nomeEscola) elementos.nomeEscola.value = escola.nome;
        if (elementos.regiaoEscola) elementos.regiaoEscola.value = escola.regiaoId;
        if (elementos.grupoEscola) elementos.grupoEscola.value = escola.grupoId || '';
        
        // Salvar referência à escola em edição
        estado.escolaEmEdicao = id;
        
        // Alterar texto do botão
        const btnSubmit = elementos.formEscola?.querySelector('button[type="submit"]');
        if (btnSubmit) {
            btnSubmit.textContent = 'Atualizar';
        } else {
            console.warn('Botão de submit não encontrado!');
        }
        
        // Abrir o modal
        if (elementos.modalEscola) {
            elementos.modalEscola.classList.remove('hidden');
            console.log('Modal de edição exibido');
        } else {
            console.error('Modal não encontrado!');
        }
    }
    
    function excluirEscola(id) {
        console.log(`Excluindo escola ID ${id}...`);
        
        if (!confirm('Tem certeza que deseja excluir esta escola?')) {
            console.log('Exclusão cancelada pelo usuário');
            return;
        }
        
        // Encontrar índice da escola
        const index = estado.escolas.findIndex(e => e.id === id);
        
        if (index === -1) {
            console.error(`Escola com ID ${id} não encontrada para exclusão!`);
            alert('Escola não encontrada!');
            return;
        }
        
        // Remover escola
        const escolaExcluida = estado.escolas[index];
        estado.escolas.splice(index, 1);
        
        console.log('Escola excluída:', escolaExcluida);
        alert('Escola excluída com sucesso!');
        
        // Atualizar tabela
        atualizarTabelaEscolas();
    }
    
    // Criar um alias para compatibilidade
    const abrirModalNovaEscola = abrirModal;
}); 