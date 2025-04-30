document.addEventListener('DOMContentLoaded', function() {
    // Referências aos elementos
    const btnNovoUsuario = document.getElementById('btn-novo-usuario');
    const modalUsuario = document.getElementById('modal-usuario');
    const fecharModal = document.getElementById('fechar-modal');
    const cancelarUsuario = document.getElementById('cancelar-usuario');
    const formUsuario = document.getElementById('form-usuario');
    const filtroTipo = document.getElementById('filtro-tipo');
    const pesquisa = document.getElementById('pesquisa');
    
    // Verificar se estamos na página de listagem
    const isListPage = window.location.href.includes('listar.html');
    
    // Redirecionar para a página de cadastro quando clicar em novo usuário
    if (btnNovoUsuario) {
        btnNovoUsuario.addEventListener('click', function() {
            // Verificar se a função global getBasePath está disponível
            if (window.getBasePath) {
                window.location.href = window.getBasePath() + 'pages/usuario/cadastrar.html';
            } else {
                // Fallback para caminho relativo
                window.location.href = 'cadastrar.html';
            }
        });
    }
    
    // Inicializar usuários do localStorage ou usar dados de exemplo
    let usuarios = [];
    const usuariosStorage = localStorage.getItem('usuarios');
    
    if (usuariosStorage) {
        // Usar dados do localStorage
        usuarios = JSON.parse(usuariosStorage);
        
        // Adicionar campo tipoFormatado se não existir
        usuarios = usuarios.map(usuario => {
            if (!usuario.tipoFormatado) {
                const tipoFormatadoMap = {
                    'admin': 'Administrador',
                    'coordenador': 'Coordenador',
                    'aplicador': 'Aplicador',
                    'gestor': 'Gestor'
                };
                usuario.tipoFormatado = tipoFormatadoMap[usuario.tipo] || usuario.tipo;
            }
            return usuario;
        });
    } else {
        // Dados de exemplo
        usuarios = [
            { 
                id: 1, 
                nome: "Admin Sistema", 
                email: "admin@salf.edu.br", 
                tipo: "admin", 
                tipoFormatado: "Administrador",
                ativo: true 
            },
            { 
                id: 2, 
                nome: "Maria Coordenadora", 
                email: "coordenador@salf.edu.br", 
                tipo: "coordenador", 
                tipoFormatado: "Coordenador",
                ativo: true 
            },
            { 
                id: 3, 
                nome: "João Aplicador", 
                email: "aplicador@salf.edu.br", 
                tipo: "aplicador", 
                tipoFormatado: "Aplicador",
                ativo: true 
            },
            { 
                id: 4, 
                nome: "Pedro Gestor", 
                email: "gestor@salf.edu.br", 
                tipo: "gestor", 
                tipoFormatado: "Gestor",
                ativo: false 
            }
        ];
        
        // Salvar no localStorage
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }
    
    // Event Listeners para modal (apenas na página de listagem)
    if (isListPage) {
        if (fecharModal) fecharModal.addEventListener('click', fecharModalUsuario);
        if (cancelarUsuario) cancelarUsuario.addEventListener('click', fecharModalUsuario);
        if (formUsuario) formUsuario.addEventListener('submit', salvarUsuario);
        
        if (filtroTipo) filtroTipo.addEventListener('change', filtrarUsuarios);
        if (pesquisa) pesquisa.addEventListener('input', filtrarUsuarios);
        
        // Configurar eventos para os botões de editar e excluir
        configurarBotoes();
        
        // Atualizar a tabela quando a página carregar
        atualizarTabela();
    }
    
    // Funções
    function abrirModal() {
        modalUsuario.classList.remove('hidden');
        document.getElementById('nome-usuario').focus();
        
        // Resetar o formulário
        formUsuario.reset();
        document.getElementById('status-usuario').checked = true;
        formUsuario.removeAttribute('data-editing-id');
        
        // Resetar o título do modal
        const modalTitle = modalUsuario.querySelector('h3');
        modalTitle.textContent = 'Novo Usuário';
        
        // Resetar o botão de submit
        const btnSubmit = formUsuario.querySelector('button[type="submit"]');
        btnSubmit.textContent = 'Salvar';
    }
    
    function fecharModalUsuario() {
        modalUsuario.classList.add('hidden');
        formUsuario.reset();
    }
    
    function salvarUsuario(e) {
        e.preventDefault();
        
        const nomeUsuario = document.getElementById('nome-usuario').value;
        const emailUsuario = document.getElementById('email-usuario').value;
        const senhaUsuario = document.getElementById('senha-usuario').value;
        const tipoUsuario = document.getElementById('tipo-usuario').value;
        const statusUsuario = document.getElementById('status-usuario').checked;
        
        if (!nomeUsuario || !emailUsuario || !tipoUsuario) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        
        // Mapear o tipo para o formato de exibição
        const tipoFormatadoMap = {
            'admin': 'Administrador',
            'coordenador': 'Coordenador',
            'aplicador': 'Aplicador',
            'gestor': 'Gestor'
        };
        
        // Verificar se estamos editando ou criando um novo usuário
        const idEditing = formUsuario.getAttribute('data-editing-id');
        
        if (idEditing) {
            // Editando um usuário existente
            const usuarioIndex = usuarios.findIndex(u => u.id == idEditing);
            
            if (usuarioIndex >= 0) {
                usuarios[usuarioIndex].nome = nomeUsuario;
                usuarios[usuarioIndex].email = emailUsuario;
                // Atualizar senha apenas se um novo valor for inserido
                if (senhaUsuario) {
                    usuarios[usuarioIndex].senha = senhaUsuario;
                }
                usuarios[usuarioIndex].tipo = tipoUsuario;
                usuarios[usuarioIndex].tipoFormatado = tipoFormatadoMap[tipoUsuario];
                usuarios[usuarioIndex].ativo = statusUsuario;
                
                alert('Usuário atualizado com sucesso!');
            }
        } else {
            // Criando um novo usuário
            const novoUsuario = {
                id: usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1,
                nome: nomeUsuario,
                email: emailUsuario,
                senha: senhaUsuario,
                tipo: tipoUsuario,
                tipoFormatado: tipoFormatadoMap[tipoUsuario],
                ativo: statusUsuario
            };
            
            usuarios.push(novoUsuario);
            alert('Usuário cadastrado com sucesso!');
        }
        
        // Salvar no localStorage
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        
        // Atualizar a tabela e fechar o modal
        atualizarTabela();
        fecharModalUsuario();
    }
    
    function filtrarUsuarios() {
        const tipoFiltrado = filtroTipo.value;
        const textoPesquisa = pesquisa.value.toLowerCase();
        
        // Filtragem
        let usuariosFiltrados = [...usuarios];
        
        if (tipoFiltrado) {
            usuariosFiltrados = usuariosFiltrados.filter(u => u.tipo === tipoFiltrado);
        }
        
        if (textoPesquisa) {
            usuariosFiltrados = usuariosFiltrados.filter(u => 
                u.nome.toLowerCase().includes(textoPesquisa) || 
                u.email.toLowerCase().includes(textoPesquisa)
            );
        }
        
        // Atualizar a tabela com os resultados filtrados
        atualizarTabela(usuariosFiltrados);
    }
    
    function atualizarTabela(usuariosFiltrados = null) {
        const tbody = document.querySelector('table tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        const dadosParaMostrar = usuariosFiltrados || usuarios;
        
        if (dadosParaMostrar.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                    Nenhum usuário encontrado
                </td>
            `;
            tbody.appendChild(tr);
            
            // Atualizar contador de resultados
            const resultadosMsg = document.querySelector('.bg-white.px-4.py-3 .text-sm.text-gray-700');
            if (resultadosMsg) {
                resultadosMsg.innerHTML = `
                    Mostrando <span class="font-medium">0</span> de <span class="font-medium">${usuarios.length}</span> resultados
                `;
            }
            
            return;
        }
        
        dadosParaMostrar.forEach(usuario => {
            // Definir as classes de cor para os diferentes tipos de usuário
            let tipoClass = '';
            switch(usuario.tipo) {
                case 'admin':
                    tipoClass = 'bg-purple-100 text-purple-800';
                    break;
                case 'coordenador':
                    tipoClass = 'bg-blue-100 text-blue-800';
                    break;
                case 'aplicador':
                    tipoClass = 'bg-green-100 text-green-800';
                    break;
                case 'gestor':
                    tipoClass = 'bg-yellow-100 text-yellow-800';
                    break;
                default:
                    tipoClass = 'bg-gray-100 text-gray-800';
            }
            
            const statusClass = usuario.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
            const statusText = usuario.ativo ? 'Ativo' : 'Inativo';
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${usuario.id}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${usuario.nome}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${usuario.email}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${tipoClass}">
                        ${usuario.tipoFormatado}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
                        ${statusText}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button class="text-blue-600 hover:text-blue-900 mr-3 btn-editar" data-id="${usuario.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="text-red-600 hover:text-red-900 btn-excluir" data-id="${usuario.id}">
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
                Mostrando <span class="font-medium">1</span> a <span class="font-medium">${dadosParaMostrar.length}</span> de <span class="font-medium">${usuarios.length}</span> resultados
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
                editarUsuario(id);
            });
        });
        
        // Botões de excluir
        document.querySelectorAll('.btn-excluir').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                excluirUsuario(id);
            });
        });
    }
    
    function editarUsuario(id) {
        const usuario = usuarios.find(u => u.id === id);
        
        if (usuario) {
            // Preencher o formulário com os dados do usuário
            document.getElementById('nome-usuario').value = usuario.nome;
            document.getElementById('email-usuario').value = usuario.email;
            document.getElementById('senha-usuario').value = ''; // Por segurança, não preenchemos a senha
            document.getElementById('tipo-usuario').value = usuario.tipo;
            document.getElementById('status-usuario').checked = usuario.ativo;
            
            // Modificar o formulário para modo de edição
            formUsuario.setAttribute('data-editing-id', id);
            
            // Modificar o título do modal
            const modalTitle = modalUsuario.querySelector('h3');
            modalTitle.textContent = 'Editar Usuário';
            
            // Modificar o botão de submit
            const btnSubmit = formUsuario.querySelector('button[type="submit"]');
            btnSubmit.textContent = 'Atualizar';
            
            // Abrir o modal
            modalUsuario.classList.remove('hidden');
        }
    }
    
    function excluirUsuario(id) {
        if (confirm('Tem certeza que deseja excluir este usuário?')) {
            // Filtrar o usuário
            usuarios = usuarios.filter(u => u.id !== id);
            
            // Salvar no localStorage
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
            
            // Atualizar a tabela
            atualizarTabela();
            
            // Mensagem de sucesso
            alert('Usuário excluído com sucesso!');
        }
    }
}); 