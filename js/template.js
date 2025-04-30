document.addEventListener('DOMContentLoaded', function() {
    // Verificação de login removida, pois não temos mais página de login
    
    // Carregar o sidebar e header
    loadTemplate();

    // Gerenciar logout
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'logout-btn') {
            logout();
        }
    });
    
    // Adicionar a função auxiliar de navegação como global
    window.getRelativePath = getRelativePath;
});

// Função para calcular caminhos relativos para navegação
function getRelativePath(targetPath) {
    // Garantir que o caminho comece com / mas remover caso já exista
    if (targetPath.startsWith('/')) {
        return targetPath;
    } else {
        return '/' + targetPath;
    }
}

// Função para determinar o caminho base com base na URL atual
function getBasePath() {
    // Na Vercel, usamos o caminho absoluto a partir da raiz
    return '';
}

function loadTemplate() {
    // Defina valores padrão para usuário, já que não há mais login
    const userRole = 'admin'; // Definindo como admin por padrão para ter acesso a todas as funcionalidades
    const userEmail = 'usuario@exemplo.com';
    localStorage.setItem('userRole', userRole);
    localStorage.setItem('userEmail', userEmail);
    localStorage.setItem('isLoggedIn', 'true');
    
    const basePath = getBasePath();
    
    // Estrutura do cabeçalho
    const header = `
        <div class="bg-white border-b px-4 py-3 flex justify-between items-center">
            <div class="flex items-center">
                <button id="sidebar-toggle" class="text-gray-600 focus:outline-none lg:hidden mr-2">
                    <i class="fas fa-bars"></i>
                </button>
                <h1 class="text-xl font-bold text-blue-800">SALF</h1>
            </div>
            <div class="flex items-center">
                <div class="mr-4 text-sm text-gray-600">
                    <span class="font-semibold">${userEmail}</span>
                    <span class="ml-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">${userRole}</span>
                </div>
                <button id="logout-btn" class="text-red-600 hover:text-red-800 focus:outline-none">
                    <i class="fas fa-sign-out-alt"></i> Sair
                </button>
            </div>
        </div>
    `;
    
    // Detectar a página atual para destacar o item de menu correspondente
    const currentPage = window.location.href;
    
    // Estrutura do sidebar com permissões baseadas no papel do usuário
    let menuItems = '';
    
    // Menu comum a todos os usuários (usar basePath que agora inclui origem)
    menuItems += `
        <a href="/index.html" class="flex items-center px-4 py-3 hover:bg-blue-700 transition ${currentPage.includes('index.html') || currentPage.endsWith('/') ? 'bg-blue-700' : ''}">
            <i class="fas fa-chart-bar w-6"></i>
            <span>Dashboard</span>
        </a>
    `;
    
    // Menus específicos por papel
    if (userRole === 'admin' || userRole === 'coordenador') {
        menuItems += `
            <a href="/pages/escola/listar.html" class="flex items-center px-4 py-3 hover:bg-blue-700 transition ${currentPage.includes('/escola/') ? 'bg-blue-700' : ''}">
                <i class="fas fa-school w-6"></i>
                <span>Escolas</span>
            </a>
            <a href="/pages/turma/listar.html" class="flex items-center px-4 py-3 hover:bg-blue-700 transition ${currentPage.includes('/turma/') ? 'bg-blue-700' : ''}">
                <i class="fas fa-users w-6"></i>
                <span>Turmas</span>
            </a>
            <a href="/pages/aluno/listar.html" class="flex items-center px-4 py-3 hover:bg-blue-700 transition ${currentPage.includes('/aluno/') ? 'bg-blue-700' : ''}">
                <i class="fas fa-user-graduate w-6"></i>
                <span>Alunos</span>
            </a>
            <a href="/pages/avaliacao/listar.html" class="flex items-center px-4 py-3 hover:bg-blue-700 transition ${currentPage.includes('/avaliacao/listar.html') ? 'bg-blue-700' : ''}">
                <i class="fas fa-clipboard-check w-6"></i>
                <span>Avaliações</span>
            </a>
        `;
    }
    
    if (userRole === 'admin') {
        menuItems += `
            <a href="/pages/usuario/listar.html" class="flex items-center px-4 py-3 hover:bg-blue-700 transition ${currentPage.includes('/usuario/') ? 'bg-blue-700' : ''}">
                <i class="fas fa-user-cog w-6"></i>
                <span>Usuários</span>
            </a>
        `;
    }
    
    if (userRole === 'aplicador' || userRole === 'admin' || userRole === 'coordenador') {
        menuItems += `
            <a href="/pages/avaliacao/realizar.html" class="flex items-center px-4 py-3 hover:bg-blue-700 transition ${currentPage.includes('/avaliacao/realizar.html') ? 'bg-blue-700' : ''}">
                <i class="fas fa-tasks w-6"></i>
                <span>Realizar Avaliação</span>
            </a>
        `;
    }
    
    const sidebar = `
        <div id="sidebar" class="bg-blue-800 text-white w-64 space-y-1 py-4 fixed inset-y-0 left-0 transform lg:relative lg:translate-x-0 -translate-x-full transition duration-200 ease-in-out z-10">
            <div class="flex items-center justify-between px-4 mb-4">
                <div class="flex items-center">
                    <h2 class="text-xl font-bold">SALF</h2>
                </div>
                <button id="sidebar-close" class="text-white focus:outline-none lg:hidden">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <nav>
                ${menuItems}
            </nav>
        </div>
    `;
    
    // Adicionar o template ao DOM
    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
        headerContainer.innerHTML = header;
    }
    
    const sidebarContainer = document.getElementById('sidebar-container');
    if (sidebarContainer) {
        sidebarContainer.innerHTML = sidebar;
    }
    
    // Configurar toggle do sidebar para dispositivos móveis
    setupSidebarToggle();
}

function setupSidebarToggle() {
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarClose = document.getElementById('sidebar-close');
    const sidebar = document.getElementById('sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('-translate-x-full');
        });
    }
    
    if (sidebarClose && sidebar) {
        sidebarClose.addEventListener('click', function() {
            sidebar.classList.add('-translate-x-full');
        });
    }
}

function logout() {
    // Recarregar a página inicial usando o caminho absoluto
    window.location.href = '/index.html';
} 