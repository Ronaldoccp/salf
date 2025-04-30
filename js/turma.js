document.addEventListener('DOMContentLoaded', function() {
    // Referências aos elementos
    const btnNovaTurma = document.getElementById('btn-nova-turma');
    const modalTurma = document.getElementById('modal-turma');
    const fecharModal = document.getElementById('fechar-modal');
    const cancelarTurma = document.getElementById('cancelar-turma');
    const formTurma = document.getElementById('form-turma');
    const filtroEscola = document.getElementById('filtro-escola');
    
    // Simulação de dados (em um ambiente real seria uma API)
    let turmas = [
        { 
            id: 1, 
            nome: "Turma A", 
            serie: "1º Ano", 
            turno: "Matutino", 
            escola: { id: 1, nome: "Escola Municipal João da Silva" }, 
            alunos: 30 
        },
        { 
            id: 2, 
            nome: "Turma B", 
            serie: "2º Ano", 
            turno: "Vespertino", 
            escola: { id: 2, nome: "Escola Estadual Maria José" }, 
            alunos: 28 
        }
    ];
    
    let escolas = [
        { id: 1, nome: "Escola Municipal João da Silva" },
        { id: 2, nome: "Escola Estadual Maria José" }
    ];
    
    // Event Listeners
    btnNovaTurma.addEventListener('click', abrirModal);
    fecharModal.addEventListener('click', fecharModalTurma);
    cancelarTurma.addEventListener('click', fecharModalTurma);
    formTurma.addEventListener('submit', salvarTurma);
    
    if (filtroEscola) {
        filtroEscola.addEventListener('change', filtrarTurmas);
    }
    
    // Configurar eventos para os botões de editar e excluir
    configurarBotoes();
    
    // Funções
    function abrirModal() {
        modalTurma.classList.remove('hidden');
        document.getElementById('escola-turma').focus();
    }
    
    function fecharModalTurma() {
        modalTurma.classList.add('hidden');
        formTurma.reset();
    }
    
    function salvarTurma(e) {
        e.preventDefault();
        
        const escolaId = document.getElementById('escola-turma').value;
        const nomeTurma = document.getElementById('nome-turma').value;
        const serieTurma = document.getElementById('serie-turma').value;
        const turnoTurma = document.getElementById('turno-turma').value;
        
        if (!escolaId || !nomeTurma || !serieTurma || !turnoTurma) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        
        const escolaSelecionada = escolas.find(e => e.id == escolaId);
        
        if (!escolaSelecionada) {
            alert('Escola não encontrada.');
            return;
        }
        
        // Em um sistema real, isto seria um POST para uma API
        const novaTurma = {
            id: turmas.length + 1,
            nome: nomeTurma,
            serie: serieTurma,
            turno: turnoTurma,
            escola: {
                id: parseInt(escolaId),
                nome: escolaSelecionada.nome
            },
            alunos: 0
        };
        
        turmas.push(novaTurma);
        atualizarTabela();
        fecharModalTurma();
        
        // Mensagem de sucesso
        alert('Turma cadastrada com sucesso!');
    }
    
    function atualizarTabela(turmasFiltradas = null) {
        const dadosParaMostrar = turmasFiltradas || turmas;
        const tbody = document.querySelector('table tbody');
        tbody.innerHTML = '';
        
        dadosParaMostrar.forEach(turma => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${turma.id}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${turma.nome}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${turma.serie}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${turma.turno}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${turma.escola.nome}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${turma.alunos}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button class="text-blue-600 hover:text-blue-900 mr-3 btn-editar" data-id="${turma.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="text-red-600 hover:text-red-900 btn-excluir" data-id="${turma.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        // Reconfigura os botões após atualizar a tabela
        configurarBotoes();
    }
    
    function filtrarTurmas() {
        const escolaId = filtroEscola.value;
        
        if (!escolaId) {
            atualizarTabela();
            return;
        }
        
        const turmasFiltradas = turmas.filter(turma => turma.escola.id == escolaId);
        atualizarTabela(turmasFiltradas);
    }
    
    function configurarBotoes() {
        // Botões de editar
        document.querySelectorAll('.btn-editar').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                editarTurma(id);
            });
        });
        
        // Botões de excluir
        document.querySelectorAll('.btn-excluir').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                excluirTurma(id);
            });
        });
    }
    
    function editarTurma(id) {
        const turma = turmas.find(t => t.id === id);
        
        if (turma) {
            document.getElementById('escola-turma').value = turma.escola.id;
            document.getElementById('nome-turma').value = turma.nome;
            document.getElementById('serie-turma').value = turma.serie;
            document.getElementById('turno-turma').value = turma.turno;
            
            // Modificar o formulário para modo de edição
            const btnSubmit = formTurma.querySelector('button[type="submit"]');
            btnSubmit.textContent = 'Atualizar';
            
            // Adicionar ID da turma sendo editada ao formulário
            formTurma.setAttribute('data-editing-id', id);
            
            // Abrir o modal
            modalTurma.classList.remove('hidden');
            
            // Alterar o event listener do formulário para atualizar ao invés de criar
            formTurma.removeEventListener('submit', salvarTurma);
            formTurma.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const escolaId = document.getElementById('escola-turma').value;
                const nomeTurma = document.getElementById('nome-turma').value;
                const serieTurma = document.getElementById('serie-turma').value;
                const turnoTurma = document.getElementById('turno-turma').value;
                const idEditing = parseInt(formTurma.getAttribute('data-editing-id'));
                
                if (!escolaId || !nomeTurma || !serieTurma || !turnoTurma) {
                    alert('Por favor, preencha todos os campos.');
                    return;
                }
                
                const escolaSelecionada = escolas.find(e => e.id == escolaId);
                
                if (!escolaSelecionada) {
                    alert('Escola não encontrada.');
                    return;
                }
                
                // Atualizar a turma no array
                const turmaIndex = turmas.findIndex(t => t.id === idEditing);
                if (turmaIndex >= 0) {
                    turmas[turmaIndex].nome = nomeTurma;
                    turmas[turmaIndex].serie = serieTurma;
                    turmas[turmaIndex].turno = turnoTurma;
                    turmas[turmaIndex].escola = {
                        id: parseInt(escolaId),
                        nome: escolaSelecionada.nome
                    };
                    
                    atualizarTabela();
                    fecharModalTurma();
                    
                    // Mensagem de sucesso
                    alert('Turma atualizada com sucesso!');
                    
                    // Resetar o formulário para modo de criação
                    formTurma.removeAttribute('data-editing-id');
                    const btnSubmit = formTurma.querySelector('button[type="submit"]');
                    btnSubmit.textContent = 'Salvar';
                    
                    // Restaurar o event listener original
                    formTurma.removeEventListener('submit', arguments.callee);
                    formTurma.addEventListener('submit', salvarTurma);
                }
            });
        }
    }
    
    function excluirTurma(id) {
        if (confirm('Tem certeza que deseja excluir esta turma?')) {
            // Em um sistema real, isto seria um DELETE para uma API
            turmas = turmas.filter(t => t.id !== id);
            atualizarTabela();
            
            // Mensagem de sucesso
            alert('Turma excluída com sucesso!');
        }
    }
}); 