document.addEventListener('DOMContentLoaded', function() {
    // Referências aos elementos
    const btnNovoAluno = document.getElementById('btn-novo-aluno');
    const btnImportarAlunos = document.getElementById('btn-importar-alunos');
    const modalAluno = document.getElementById('modal-aluno');
    const modalImportar = document.getElementById('modal-importar');
    const fecharModal = document.getElementById('fechar-modal');
    const fecharModalImportar = document.getElementById('fechar-modal-importar');
    const cancelarAluno = document.getElementById('cancelar-aluno');
    const cancelarImportar = document.getElementById('cancelar-importar');
    const formAluno = document.getElementById('form-aluno');
    const formImportar = document.getElementById('form-importar');
    const escolaSelect = document.getElementById('filtro-escola');
    const turmaSelect = document.getElementById('filtro-turma');
    const escolaFormSelect = document.getElementById('escola-aluno-form');
    const turmaFormSelect = document.getElementById('turma-aluno-form');
    const fileUpload = document.getElementById('file-upload');
    const arquivoSelecionado = document.getElementById('arquivo-selecionado');
    const nomeArquivo = document.getElementById('nome-arquivo');
    
    // Simulação de dados (em um ambiente real seria uma API)
    let alunos = [
        { 
            id: 1, 
            nome: "Ana Silva", 
            matricula: "12345", 
            turma: { id: 1, nome: "Turma A", serie: "1º Ano" }, 
            escola: { id: 1, nome: "Escola Municipal João da Silva" }
        },
        { 
            id: 2, 
            nome: "Bruno Santos", 
            matricula: "12346", 
            turma: { id: 1, nome: "Turma A", serie: "1º Ano" }, 
            escola: { id: 1, nome: "Escola Municipal João da Silva" }
        },
        { 
            id: 3, 
            nome: "Carla Oliveira", 
            matricula: "12347", 
            turma: { id: 2, nome: "Turma B", serie: "2º Ano" }, 
            escola: { id: 1, nome: "Escola Municipal João da Silva" }
        },
        { 
            id: 4, 
            nome: "Daniel Pereira", 
            matricula: "12348", 
            turma: { id: 3, nome: "Turma C", serie: "1º Ano" }, 
            escola: { id: 2, nome: "Escola Estadual Maria José" }
        },
        { 
            id: 5, 
            nome: "Eduarda Souza", 
            matricula: "12349", 
            turma: { id: 4, nome: "Turma D", serie: "3º Ano" }, 
            escola: { id: 2, nome: "Escola Estadual Maria José" }
        }
    ];
    
    let escolas = [
        { id: 1, nome: "Escola Municipal João da Silva" },
        { id: 2, nome: "Escola Estadual Maria José" }
    ];
    
    let turmas = [
        { id: 1, nome: "Turma A", serie: "1º Ano", escola_id: 1 },
        { id: 2, nome: "Turma B", serie: "2º Ano", escola_id: 1 },
        { id: 3, nome: "Turma C", serie: "1º Ano", escola_id: 2 },
        { id: 4, nome: "Turma D", serie: "3º Ano", escola_id: 2 }
    ];
    
    // Event Listeners
    btnNovoAluno.addEventListener('click', abrirModalAluno);
    btnImportarAlunos.addEventListener('click', abrirModalImportar);
    fecharModal.addEventListener('click', fecharModalAluno);
    fecharModalImportar.addEventListener('click', fecharModalImportacao);
    cancelarAluno.addEventListener('click', fecharModalAluno);
    cancelarImportar.addEventListener('click', fecharModalImportacao);
    formAluno.addEventListener('submit', salvarAluno);
    formImportar.addEventListener('submit', importarAlunos);
    
    escolaSelect.addEventListener('change', carregarTurmasFiltro);
    escolaFormSelect.addEventListener('change', carregarTurmasForm);
    
    fileUpload.addEventListener('change', exibirNomeArquivo);
    
    // Inicializar tabela
    atualizarTabela();
    
    // Configurar eventos para os botões de editar e excluir
    configurarBotoes();
    
    // Funções
    function abrirModalAluno() {
        modalAluno.classList.remove('hidden');
        escolaFormSelect.focus();
        
        // Resetar o formulário
        formAluno.reset();
        formAluno.removeAttribute('data-editing-id');
        
        // Resetar o título do modal
        const modalTitle = modalAluno.querySelector('h3');
        modalTitle.textContent = 'Novo Aluno';
        
        // Resetar o botão de submit
        const btnSubmit = formAluno.querySelector('button[type="submit"]');
        btnSubmit.textContent = 'Salvar';
    }
    
    function abrirModalImportar() {
        modalImportar.classList.remove('hidden');
        arquivoSelecionado.classList.add('hidden');
        nomeArquivo.textContent = '';
    }
    
    function fecharModalAluno() {
        modalAluno.classList.add('hidden');
        formAluno.reset();
    }
    
    function fecharModalImportacao() {
        modalImportar.classList.add('hidden');
        formImportar.reset();
    }
    
    function carregarTurmasFiltro() {
        const escolaId = parseInt(escolaSelect.value);
        turmaSelect.innerHTML = '<option value="">Todas as turmas</option>';
        
        if (escolaId) {
            const turmasFiltradas = turmas.filter(turma => turma.escola_id === escolaId);
            turmasFiltradas.forEach(turma => {
                const option = document.createElement('option');
                option.value = turma.id;
                option.textContent = `${turma.nome} (${turma.serie})`;
                turmaSelect.appendChild(option);
            });
        }
    }
    
    function carregarTurmasForm() {
        const escolaId = parseInt(escolaFormSelect.value);
        turmaFormSelect.innerHTML = '<option value="">Selecione uma turma</option>';
        
        if (escolaId) {
            const turmasFiltradas = turmas.filter(turma => turma.escola_id === escolaId);
            turmasFiltradas.forEach(turma => {
                const option = document.createElement('option');
                option.value = turma.id;
                option.textContent = `${turma.nome} (${turma.serie})`;
                turmaFormSelect.appendChild(option);
            });
        }
    }
    
    function exibirNomeArquivo() {
        if (fileUpload.files.length > 0) {
            arquivoSelecionado.classList.remove('hidden');
            nomeArquivo.textContent = fileUpload.files[0].name;
        } else {
            arquivoSelecionado.classList.add('hidden');
            nomeArquivo.textContent = '';
        }
    }
    
    function salvarAluno(e) {
        e.preventDefault();
        
        const escolaId = escolaFormSelect.value;
        const turmaId = turmaFormSelect.value;
        const nomeAluno = document.getElementById('nome-aluno').value;
        const matriculaAluno = document.getElementById('matricula-aluno').value;
        
        if (!escolaId || !turmaId || !nomeAluno || !matriculaAluno) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        
        const escolaSelecionada = escolas.find(e => e.id == escolaId);
        const turmaSelecionada = turmas.find(t => t.id == turmaId);
        
        if (!escolaSelecionada || !turmaSelecionada) {
            alert('Erro ao selecionar escola ou turma.');
            return;
        }
        
        // Verificar se estamos editando ou criando um novo aluno
        const idEditing = formAluno.getAttribute('data-editing-id');
        
        if (idEditing) {
            // Editando um aluno existente
            const alunoIndex = alunos.findIndex(a => a.id == idEditing);
            
            if (alunoIndex >= 0) {
                alunos[alunoIndex].nome = nomeAluno;
                alunos[alunoIndex].matricula = matriculaAluno;
                alunos[alunoIndex].turma = {
                    id: parseInt(turmaId),
                    nome: turmaSelecionada.nome,
                    serie: turmaSelecionada.serie
                };
                alunos[alunoIndex].escola = {
                    id: parseInt(escolaId),
                    nome: escolaSelecionada.nome
                };
                
                alert('Aluno atualizado com sucesso!');
            }
        } else {
            // Criando um novo aluno
            const novoAluno = {
                id: alunos.length + 1,
                nome: nomeAluno,
                matricula: matriculaAluno,
                turma: {
                    id: parseInt(turmaId),
                    nome: turmaSelecionada.nome,
                    serie: turmaSelecionada.serie
                },
                escola: {
                    id: parseInt(escolaId),
                    nome: escolaSelecionada.nome
                }
            };
            
            alunos.push(novoAluno);
            alert('Aluno cadastrado com sucesso!');
        }
        
        // Atualizar a tabela e fechar o modal
        atualizarTabela();
        fecharModalAluno();
    }
    
    function importarAlunos(e) {
        e.preventDefault();
        
        if (!fileUpload.files.length) {
            alert('Por favor, selecione um arquivo para importar.');
            return;
        }
        
        // Em um ambiente real, aqui seria feito o upload do arquivo para o servidor
        // e o processamento dos dados
        
        // Simular a importação bem-sucedida
        setTimeout(() => {
            alert('Importação realizada com sucesso! 50 alunos foram importados.');
            fecharModalImportacao();
            
            // Simular a adição de alguns alunos na tabela
            const novosAlunos = [
                { 
                    id: alunos.length + 1, 
                    nome: "Felipe Martins", 
                    matricula: "12350", 
                    turma: { id: 2, nome: "Turma B", serie: "2º Ano" }, 
                    escola: { id: 1, nome: "Escola Municipal João da Silva" }
                },
                { 
                    id: alunos.length + 2, 
                    nome: "Gabriela Costa", 
                    matricula: "12351", 
                    turma: { id: 3, nome: "Turma C", serie: "1º Ano" }, 
                    escola: { id: 2, nome: "Escola Estadual Maria José" }
                }
            ];
            
            alunos = alunos.concat(novosAlunos);
            atualizarTabela();
        }, 1000);
    }
    
    function atualizarTabela() {
        const tbody = document.querySelector('table tbody');
        tbody.innerHTML = '';
        
        // Filtrar alunos baseado nos filtros selecionados
        let alunosFiltrados = [...alunos];
        
        const escolaFiltro = parseInt(escolaSelect.value);
        const turmaFiltro = parseInt(turmaSelect.value);
        const pesquisa = document.getElementById('pesquisa')?.value?.toLowerCase() || '';
        
        if (escolaFiltro) {
            alunosFiltrados = alunosFiltrados.filter(aluno => aluno.escola.id === escolaFiltro);
        }
        
        if (turmaFiltro) {
            alunosFiltrados = alunosFiltrados.filter(aluno => aluno.turma.id === turmaFiltro);
        }
        
        if (pesquisa) {
            alunosFiltrados = alunosFiltrados.filter(aluno => 
                aluno.nome.toLowerCase().includes(pesquisa) || 
                aluno.matricula.toLowerCase().includes(pesquisa)
            );
        }
        
        alunosFiltrados.forEach(aluno => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${aluno.id}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${aluno.nome}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${aluno.matricula}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${aluno.turma.serie}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${aluno.turma.nome}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${aluno.escola.nome}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button class="text-blue-600 hover:text-blue-900 mr-3 btn-editar" data-id="${aluno.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="text-red-600 hover:text-red-900 btn-excluir" data-id="${aluno.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        // Atualizar contador de resultados
        const resultadosMsg = document.querySelector('.bg-white.px-4.py-3 .text-sm.text-gray-700');
        if (resultadosMsg) {
            resultadosMsg.innerHTML = `
                Mostrando <span class="font-medium">1</span> a <span class="font-medium">${alunosFiltrados.length}</span> de <span class="font-medium">${alunos.length}</span> resultados
            `;
        }
        
        // Reconfigura os botões após atualizar a tabela
        configurarBotoes();
    }
    
    function configurarBotoes() {
        // Botões de editar
        document.querySelectorAll('.btn-editar').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                editarAluno(id);
            });
        });
        
        // Botões de excluir
        document.querySelectorAll('.btn-excluir').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                excluirAluno(id);
            });
        });
    }
    
    function editarAluno(id) {
        const aluno = alunos.find(a => a.id === id);
        
        if (aluno) {
            // Preencher o formulário com os dados do aluno
            escolaFormSelect.value = aluno.escola.id;
            
            // Carregar as turmas da escola selecionada
            carregarTurmasForm();
            
            // Selecionar a turma do aluno
            setTimeout(() => {
                turmaFormSelect.value = aluno.turma.id;
                document.getElementById('nome-aluno').value = aluno.nome;
                document.getElementById('matricula-aluno').value = aluno.matricula;
            }, 100);
            
            // Modificar o formulário para modo de edição
            formAluno.setAttribute('data-editing-id', id);
            
            // Modificar o título do modal
            const modalTitle = modalAluno.querySelector('h3');
            modalTitle.textContent = 'Editar Aluno';
            
            // Modificar o botão de submit
            const btnSubmit = formAluno.querySelector('button[type="submit"]');
            btnSubmit.textContent = 'Atualizar';
            
            // Abrir o modal
            modalAluno.classList.remove('hidden');
        }
    }
    
    function excluirAluno(id) {
        if (confirm('Tem certeza que deseja excluir este aluno?')) {
            // Em um sistema real, isto seria um DELETE para uma API
            alunos = alunos.filter(a => a.id !== id);
            atualizarTabela();
            
            // Mensagem de sucesso
            alert('Aluno excluído com sucesso!');
        }
    }
}); 