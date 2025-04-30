document.addEventListener('DOMContentLoaded', function() {
    // Referências aos elementos do formulário
    const formCadastroUsuario = document.getElementById('form-cadastro-usuario');
    const nomeUsuario = document.getElementById('nome-usuario');
    const emailUsuario = document.getElementById('email-usuario');
    const senhaUsuario = document.getElementById('senha-usuario');
    const confirmarSenha = document.getElementById('confirmar-senha');
    const tipoUsuario = document.getElementById('tipo-usuario');
    const statusUsuario = document.getElementById('status-usuario');

    // Event Listeners
    formCadastroUsuario.addEventListener('submit', cadastrarUsuario);

    // Função para validar o formulário
    function validarFormulario() {
        // Verificar se todos os campos obrigatórios estão preenchidos
        if (!nomeUsuario.value.trim()) {
            alert('Por favor, insira o nome do usuário.');
            nomeUsuario.focus();
            return false;
        }

        if (!emailUsuario.value.trim()) {
            alert('Por favor, insira o e-mail do usuário.');
            emailUsuario.focus();
            return false;
        }

        // Validar formato de e-mail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailUsuario.value)) {
            alert('Por favor, insira um e-mail válido.');
            emailUsuario.focus();
            return false;
        }

        if (!senhaUsuario.value) {
            alert('Por favor, insira a senha.');
            senhaUsuario.focus();
            return false;
        }

        if (senhaUsuario.value.length < 6) {
            alert('A senha deve ter pelo menos 6 caracteres.');
            senhaUsuario.focus();
            return false;
        }

        if (senhaUsuario.value !== confirmarSenha.value) {
            alert('As senhas não coincidem.');
            confirmarSenha.focus();
            return false;
        }

        if (!tipoUsuario.value) {
            alert('Por favor, selecione o tipo de usuário.');
            tipoUsuario.focus();
            return false;
        }

        return true;
    }

    // Função para cadastrar o usuário
    function cadastrarUsuario(e) {
        e.preventDefault();

        // Validar formulário antes de prosseguir
        if (!validarFormulario()) {
            return;
        }

        // Em um ambiente real, aqui faríamos uma requisição POST para uma API
        // Vamos simular o cadastro e redirecionamento
        
        // Obter os dados do formulário
        const novoUsuario = {
            id: Date.now(), // Simulando um ID único
            nome: nomeUsuario.value.trim(),
            email: emailUsuario.value.trim(),
            senha: senhaUsuario.value, // Em um ambiente real, a senha seria criptografada
            tipo: tipoUsuario.value,
            ativo: statusUsuario.checked
        };

        // Obter usuários armazenados localmente (se existirem)
        let usuarios = localStorage.getItem('usuarios');
        if (usuarios) {
            usuarios = JSON.parse(usuarios);
        } else {
            usuarios = [];
        }

        // Verificar se já existe um usuário com o mesmo e-mail
        const emailExiste = usuarios.some(usuario => usuario.email === novoUsuario.email);
        if (emailExiste) {
            alert('Já existe um usuário cadastrado com este e-mail.');
            emailUsuario.focus();
            return;
        }

        // Adicionar o novo usuário
        usuarios.push(novoUsuario);
        
        // Salvar no localStorage
        localStorage.setItem('usuarios', JSON.stringify(usuarios));

        // Exibir mensagem de sucesso
        alert('Usuário salvo com sucesso!');

        // Verificar se a função global getBasePath está disponível
        if (window.getBasePath) {
            window.location.href = window.getBasePath() + 'pages/usuario/listar.html';
        } else {
            // Fallback para caminho relativo
            window.location.href = 'listar.html';
        }
    }

    // Função para mostrar feedback de força da senha
    senhaUsuario.addEventListener('input', function() {
        const senha = senhaUsuario.value;
        const confirmar = confirmarSenha.value;
        
        // Se tiver uma senha confirmada, verificar se combinam
        if (confirmar && senha !== confirmar) {
            confirmarSenha.classList.add('border-red-500');
            confirmarSenha.classList.remove('border-green-500');
        } else if (confirmar) {
            confirmarSenha.classList.add('border-green-500');
            confirmarSenha.classList.remove('border-red-500');
        }
    });

    // Verificar se as senhas combinam quando digitar na confirmação
    confirmarSenha.addEventListener('input', function() {
        const senha = senhaUsuario.value;
        const confirmar = confirmarSenha.value;
        
        if (senha && confirmar) {
            if (senha === confirmar) {
                confirmarSenha.classList.add('border-green-500');
                confirmarSenha.classList.remove('border-red-500');
            } else {
                confirmarSenha.classList.add('border-red-500');
                confirmarSenha.classList.remove('border-green-500');
            }
        }
    });
}); 