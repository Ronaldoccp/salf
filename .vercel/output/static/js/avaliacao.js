// Inicializar listas
const avaliacoesList = document.getElementById('avaliacoes-list');

// Carregar dados iniciais (simulação)
document.addEventListener('DOMContentLoaded', function() {
    // Carregar avaliações
    carregarAvaliacoes();
    
    // Adicionar event listener para o botão de nova avaliação
    const btnNovaAvaliacao = document.getElementById('btn-nova-avaliacao');
    if (btnNovaAvaliacao) {
        btnNovaAvaliacao.addEventListener('click', function() {
            // Verificar se a função global getBasePath está disponível
            if (window.getBasePath) {
                window.location.href = window.getBasePath() + 'pages/avaliacao/cadastrar.html';
            } else {
                // Fallback para caminho relativo
                window.location.href = 'cadastrar.html';
            }
        });
    }
});

// Elementos de Avaliação
const btnNovaAvaliacao = document.getElementById('btn-nova-avaliacao');
const btnExportarAvaliacoes = document.getElementById('btn-exportar-avaliacoes');
const modalAvaliacao = document.getElementById('modal-avaliacao');
const fecharModalAvaliacao = document.getElementById('fechar-modal-avaliacao');
const cancelarAvaliacao = document.getElementById('cancelar-avaliacao');
const formAvaliacao = document.getElementById('form-avaliacao');
const pesquisaAvaliacao = document.getElementById('pesquisa-avaliacao');

// Elementos de Eventos
const btnNovoEvento = document.getElementById('btn-novo-evento');
const modalEvento = document.getElementById('modal-evento');
const fecharModalEvento = document.getElementById('fechar-modal-evento');
const cancelarEvento = document.getElementById('cancelar-evento');
const formEvento = document.getElementById('form-evento');
const pesquisaEvento = document.getElementById('pesquisa-evento');

// Elementos para alternância entre abas
const tabAvaliacao = document.getElementById('tab-avaliacao');
const tabEventos = document.getElementById('tab-eventos');
const secaoAvaliacoes = document.getElementById('secao-avaliacoes');
const secaoEventos = document.getElementById('secao-eventos');

// Elementos para gerenciamento de palavras, pseudopalavras e frases
const novaPalavra = document.getElementById('nova-palavra');
const adicionarPalavra = document.getElementById('adicionar-palavra');
const listaPalavras = document.getElementById('lista-palavras');
const novaPseudopalavra = document.getElementById('nova-pseudopalavra');
const adicionarPseudopalavra = document.getElementById('adicionar-pseudopalavra');
const listaPseudopalavras = document.getElementById('lista-pseudopalavras');
const novaFrase = document.getElementById('nova-frase');
const adicionarFrase = document.getElementById('adicionar-frase');
const listaFrases = document.getElementById('lista-frases');
const textoAvaliacao = document.getElementById('texto-avaliacao');
const contagemPalavras = document.getElementById('contagem-palavras');

// Elementos para questões de múltipla escolha
const btnAdicionarQuestao = document.getElementById('adicionar-questao');
const templateQuestao = document.getElementById('template-questao');
const containerQuestoes = document.getElementById('container-questoes');
const semQuestoes = document.getElementById('sem-questoes');

// Dados simulados para avaliações
let avaliacoes = [
    { id: 1, nome: 'Avaliação 1º Semestre 2023', palavras: [], pseudopalavras: [], frases: [], texto: '', totalPalavras: 40, totalPseudopalavras: 30, questoes: [] },
    { id: 2, nome: 'Avaliação 2º Semestre 2023', palavras: [], pseudopalavras: [], frases: [], texto: '', totalPalavras: 40, totalPseudopalavras: 30, questoes: [] }
];

// Dados simulados para eventos
let eventos = [
    { id: 1, nome: 'Evento Avaliação 1º Bimestre', avaliacaoId: 1, avaliacaoNome: 'Avaliação 1º Semestre 2023', ativo: true },
    { id: 2, nome: 'Evento Avaliação 2º Bimestre', avaliacaoId: 2, avaliacaoNome: 'Avaliação 2º Semestre 2023', ativo: false }
];

// ID para edição
let avaliacaoIdEmEdicao = null;
let eventoIdEmEdicao = null;
let palavrasAdicionadas = [];
let pseudopalavrasAdicionadas = [];
let frasesAdicionadas = [];

// Variáveis para as questões
let questoesAdicionadas = [];
let contadorQuestoes = 0;

// Alternância entre abas
tabAvaliacao.addEventListener('click', function() {
    tabAvaliacao.classList.add('border-blue-500', 'text-blue-600');
    tabAvaliacao.classList.remove('border-transparent', 'text-gray-500');
    tabEventos.classList.add('border-transparent', 'text-gray-500');
    tabEventos.classList.remove('border-blue-500', 'text-blue-600');
    secaoAvaliacoes.classList.remove('hidden');
    secaoEventos.classList.add('hidden');
});

tabEventos.addEventListener('click', function() {
    tabEventos.classList.add('border-blue-500', 'text-blue-600');
    tabEventos.classList.remove('border-transparent', 'text-gray-500');
    tabAvaliacao.classList.add('border-transparent', 'text-gray-500');
    tabAvaliacao.classList.remove('border-blue-500', 'text-blue-600');
    secaoEventos.classList.remove('hidden');
    secaoAvaliacoes.classList.add('hidden');
});

// Abrir e fechar modal de avaliação
btnNovaAvaliacao.addEventListener('click', function() {
    avaliacaoIdEmEdicao = null;
    resetFormAvaliacao();
    document.querySelector('#modal-avaliacao h3').textContent = 'Nova Avaliação';
    modalAvaliacao.classList.remove('hidden');
});

fecharModalAvaliacao.addEventListener('click', function() {
    modalAvaliacao.classList.add('hidden');
});

cancelarAvaliacao.addEventListener('click', function() {
    modalAvaliacao.classList.add('hidden');
});

// Abrir e fechar modal de evento
btnNovoEvento.addEventListener('click', function() {
    eventoIdEmEdicao = null;
    resetFormEvento();
    document.querySelector('#modal-evento h3').textContent = 'Novo Evento de Avaliação';
    modalEvento.classList.remove('hidden');
});

fecharModalEvento.addEventListener('click', function() {
    modalEvento.classList.add('hidden');
});

cancelarEvento.addEventListener('click', function() {
    modalEvento.classList.add('hidden');
});

// Submissão do formulário de avaliação
formAvaliacao.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nomeAvaliacao = document.getElementById('nome-avaliacao').value;
    const texto = textoAvaliacao.value;
    
    if (nomeAvaliacao.trim() === '') {
        alert('Por favor, informe o nome da avaliação.');
        return;
    }
    
    if (palavrasAdicionadas.length === 0) {
        alert('Por favor, adicione pelo menos uma palavra à avaliação.');
        return;
    }
    
    if (pseudopalavrasAdicionadas.length === 0) {
        alert('Por favor, adicione pelo menos uma pseudopalavra à avaliação.');
        return;
    }
    
    if (texto.trim() === '') {
        alert('Por favor, adicione o texto para a avaliação.');
        return;
    }
    
    const contarPalavras = texto.trim().split(/\s+/).length;
    if (contarPalavras < 150 || contarPalavras > 180) {
        alert('O texto deve conter entre 150 e 180 palavras.');
        return;
    }
    
    // Coletar questões do formulário
    const questoes = [];
    document.querySelectorAll('.questao:not(.questao-template)').forEach(questaoEl => {
        const enunciado = questaoEl.querySelector('.enunciado-questao').value;
        const opcoes = [];
        let respostaCorreta = null;
        
        questaoEl.querySelectorAll('.opcao-container').forEach((opcaoEl, index) => {
            const texto = opcaoEl.querySelector('.texto-opcao').value;
            const selecionada = opcaoEl.querySelector('.resposta-correta').checked;
            
            if (texto.trim()) {
                opcoes.push(texto);
                if (selecionada) {
                    respostaCorreta = index;
                }
            }
        });
        
        if (enunciado.trim() && opcoes.length >= 2 && respostaCorreta !== null) {
            questoes.push({
                enunciado,
                opcoes,
                respostaCorreta
            });
        }
    });
    
    if (avaliacaoIdEmEdicao === null) {
        // Adicionar nova avaliação
        const novaAvaliacao = {
            id: avaliacoes.length > 0 ? Math.max(...avaliacoes.map(a => a.id)) + 1 : 1,
            nome: nomeAvaliacao,
            palavras: [...palavrasAdicionadas],
            pseudopalavras: [...pseudopalavrasAdicionadas],
            frases: [...frasesAdicionadas],
            texto: texto,
            totalPalavras: palavrasAdicionadas.length,
            totalPseudopalavras: pseudopalavrasAdicionadas.length,
            questoes: questoes
        };
        
        avaliacoes.push(novaAvaliacao);
        alert('Avaliação adicionada com sucesso!');
    } else {
        // Atualizar avaliação existente
        const index = avaliacoes.findIndex(a => a.id === avaliacaoIdEmEdicao);
        if (index !== -1) {
            avaliacoes[index].nome = nomeAvaliacao;
            avaliacoes[index].palavras = [...palavrasAdicionadas];
            avaliacoes[index].pseudopalavras = [...pseudopalavrasAdicionadas];
            avaliacoes[index].frases = [...frasesAdicionadas];
            avaliacoes[index].texto = texto;
            avaliacoes[index].totalPalavras = palavrasAdicionadas.length;
            avaliacoes[index].totalPseudopalavras = pseudopalavrasAdicionadas.length;
            avaliacoes[index].questoes = questoes;
            alert('Avaliação atualizada com sucesso!');
        }
    }
    
    atualizarTabelaAvaliacoes();
    modalAvaliacao.classList.add('hidden');
});

// Submissão do formulário de evento
formEvento.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nomeEvento = document.getElementById('nome-evento').value;
    const avaliacaoId = document.getElementById('avaliacao-evento').value;
    const ativo = document.getElementById('status-evento').checked;
    
    if (nomeEvento.trim() === '') {
        alert('Por favor, informe o nome do evento.');
        return;
    }
    
    if (avaliacaoId === '') {
        alert('Por favor, selecione uma avaliação.');
        return;
    }
    
    const avaliacaoSelecionada = avaliacoes.find(a => a.id === parseInt(avaliacaoId));
    if (!avaliacaoSelecionada) {
        alert('Avaliação inválida.');
        return;
    }
    
    if (eventoIdEmEdicao === null) {
        // Adicionar novo evento
        const novoEvento = {
            id: eventos.length > 0 ? Math.max(...eventos.map(e => e.id)) + 1 : 1,
            nome: nomeEvento,
            avaliacaoId: parseInt(avaliacaoId),
            avaliacaoNome: avaliacaoSelecionada.nome,
            ativo: ativo
        };
        
        eventos.push(novoEvento);
        alert('Evento adicionado com sucesso!');
    } else {
        // Atualizar evento existente
        const index = eventos.findIndex(e => e.id === eventoIdEmEdicao);
        if (index !== -1) {
            eventos[index].nome = nomeEvento;
            eventos[index].avaliacaoId = parseInt(avaliacaoId);
            eventos[index].avaliacaoNome = avaliacaoSelecionada.nome;
            eventos[index].ativo = ativo;
            alert('Evento atualizado com sucesso!');
        }
    }
    
    atualizarTabelaEventos();
    modalEvento.classList.add('hidden');
});

// Adição de palavras
adicionarPalavra.addEventListener('click', function() {
    adicionarPalavrasMultiplas();
});

// Permitir pressionar Enter para adicionar palavras
novaPalavra.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        adicionarPalavrasMultiplas();
    }
});

// Adição de pseudopalavras
adicionarPseudopalavra.addEventListener('click', function() {
    adicionarPseudopalavrasMultiplas();
});

// Permitir pressionar Enter para adicionar pseudopalavras
novaPseudopalavra.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        adicionarPseudopalavrasMultiplas();
    }
});

// Adição de frases
adicionarFrase.addEventListener('click', function() {
    adicionarFrasesMultiplas();
});

// Permitir pressionar Enter para adicionar frases
novaFrase.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        adicionarFrasesMultiplas();
    }
});

// Funções para adicionar múltiplos itens
function adicionarPalavrasMultiplas() {
    const texto = novaPalavra.value.trim();
    if (texto === '') {
        alert('Por favor, digite uma palavra para adicionar.');
        return;
    }
    
    // Separar por vírgulas ou espaços se houver
    const palavras = texto.split(/,|\n/).map(p => p.trim()).filter(p => p !== '');
    
    if (palavras.length === 0) {
        return;
    }
    
    let adicionadas = 0;
    let repetidas = 0;
    
    palavras.forEach(palavra => {
        if (!palavrasAdicionadas.includes(palavra)) {
            adicionarPalavraAoDOM(palavra);
            palavrasAdicionadas.push(palavra);
            adicionadas++;
        } else {
            repetidas++;
        }
    });
    
    // Mensagem de feedback
    if (adicionadas > 0) {
        if (repetidas > 0) {
            alert(`${adicionadas} palavra(s) adicionada(s). ${repetidas} palavra(s) foi(ram) ignorada(s) por já existir(em).`);
        }
        novaPalavra.value = '';
        novaPalavra.focus();
    } else if (repetidas > 0) {
        alert('Todas as palavras já foram adicionadas anteriormente.');
    }
}

function adicionarPseudopalavrasMultiplas() {
    const texto = novaPseudopalavra.value.trim();
    if (texto === '') {
        alert('Por favor, digite uma pseudopalavra para adicionar.');
        return;
    }
    
    // Separar por vírgulas ou espaços se houver
    const pseudopalavras = texto.split(/,|\n/).map(p => p.trim()).filter(p => p !== '');
    
    if (pseudopalavras.length === 0) {
        return;
    }
    
    let adicionadas = 0;
    let repetidas = 0;
    
    pseudopalavras.forEach(pseudopalavra => {
        if (!pseudopalavrasAdicionadas.includes(pseudopalavra)) {
            adicionarPseudopalavraAoDOM(pseudopalavra);
            pseudopalavrasAdicionadas.push(pseudopalavra);
            adicionadas++;
        } else {
            repetidas++;
        }
    });
    
    // Mensagem de feedback
    if (adicionadas > 0) {
        if (repetidas > 0) {
            alert(`${adicionadas} pseudopalavra(s) adicionada(s). ${repetidas} pseudopalavra(s) foi(ram) ignorada(s) por já existir(em).`);
        }
        novaPseudopalavra.value = '';
        novaPseudopalavra.focus();
    } else if (repetidas > 0) {
        alert('Todas as pseudopalavras já foram adicionadas anteriormente.');
    }
}

function adicionarFrasesMultiplas() {
    const texto = novaFrase.value.trim();
    if (texto === '') {
        alert('Por favor, digite uma frase para adicionar.');
        return;
    }
    
    // Separar por linhas primeiro, depois por pontos (.) se houver múltiplas frases
    const frases = texto.split(/\n|\.(?=\s|$)/).map(f => f.trim()).filter(f => f !== '');
    
    if (frases.length === 0) {
        return;
    }
    
    let adicionadas = 0;
    let repetidas = 0;
    
    frases.forEach(frase => {
        // Adicionar ponto final se não tiver
        if (!frase.endsWith('.')) {
            frase = frase + '.';
        }
        
        if (!frasesAdicionadas.includes(frase)) {
            adicionarFraseAoDOM(frase);
            frasesAdicionadas.push(frase);
            adicionadas++;
        } else {
            repetidas++;
        }
    });
    
    // Mensagem de feedback
    if (adicionadas > 0) {
        if (repetidas > 0) {
            alert(`${adicionadas} frase(s) adicionada(s). ${repetidas} frase(s) foi(ram) ignorada(s) por já existir(em).`);
        }
        novaFrase.value = '';
        novaFrase.focus();
    } else if (repetidas > 0) {
        alert('Todas as frases já foram adicionadas anteriormente.');
    }
}

// Contagem de palavras no texto
textoAvaliacao.addEventListener('input', function() {
    const texto = textoAvaliacao.value.trim();
    const palavras = texto === '' ? 0 : texto.split(/\s+/).length;
    contagemPalavras.textContent = palavras;
    
    // Mudar cor se estiver fora do intervalo recomendado
    if (palavras < 150 || palavras > 180) {
        contagemPalavras.classList.add('text-red-500');
        contagemPalavras.classList.remove('text-green-500');
    } else {
        contagemPalavras.classList.add('text-green-500');
        contagemPalavras.classList.remove('text-red-500');
    }
});

// Pesquisa de avaliações
pesquisaAvaliacao.addEventListener('input', function() {
    const termo = pesquisaAvaliacao.value.toLowerCase();
    const linhas = document.querySelectorAll('#secao-avaliacoes tbody tr');
    
    linhas.forEach(linha => {
        const nome = linha.querySelector('td:nth-child(2)').textContent.toLowerCase();
        if (nome.includes(termo)) {
            linha.style.display = '';
        } else {
            linha.style.display = 'none';
        }
    });
});

// Pesquisa de eventos
pesquisaEvento.addEventListener('input', function() {
    const termo = pesquisaEvento.value.toLowerCase();
    const linhas = document.querySelectorAll('#secao-eventos tbody tr');
    
    linhas.forEach(linha => {
        const nome = linha.querySelector('td:nth-child(2)').textContent.toLowerCase();
        const avaliacao = linha.querySelector('td:nth-child(3)').textContent.toLowerCase();
        if (nome.includes(termo) || avaliacao.includes(termo)) {
            linha.style.display = '';
        } else {
            linha.style.display = 'none';
        }
    });
});

// Funções auxiliares
function resetFormAvaliacao() {
    formAvaliacao.reset();
    listaPalavras.innerHTML = '';
    listaPseudopalavras.innerHTML = '';
    listaFrases.innerHTML = '';
    palavrasAdicionadas = [];
    pseudopalavrasAdicionadas = [];
    frasesAdicionadas = [];
    contagemPalavras.textContent = '0';
    contagemPalavras.classList.remove('text-red-500', 'text-green-500');
    
    // Limpar questões
    resetQuestoes();
}

function resetFormEvento() {
    formEvento.reset();
}

function adicionarPalavraAoDOM(palavra) {
    const div = document.createElement('div');
    div.className = 'bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center';
    div.innerHTML = `
        ${palavra}
        <button type="button" class="ml-2 text-blue-600 hover:text-blue-800" data-palavra="${palavra}">
            <i class="fas fa-times-circle"></i>
        </button>
    `;
    
    div.querySelector('button').addEventListener('click', function() {
        const palavraParaRemover = this.getAttribute('data-palavra');
        palavrasAdicionadas = palavrasAdicionadas.filter(p => p !== palavraParaRemover);
        div.remove();
    });
    
    listaPalavras.appendChild(div);
}

function adicionarPseudopalavraAoDOM(pseudopalavra) {
    const div = document.createElement('div');
    div.className = 'bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center';
    div.innerHTML = `
        ${pseudopalavra}
        <button type="button" class="ml-2 text-purple-600 hover:text-purple-800" data-pseudopalavra="${pseudopalavra}">
            <i class="fas fa-times-circle"></i>
        </button>
    `;
    
    div.querySelector('button').addEventListener('click', function() {
        const pseudopalavraParaRemover = this.getAttribute('data-pseudopalavra');
        pseudopalavrasAdicionadas = pseudopalavrasAdicionadas.filter(p => p !== pseudopalavraParaRemover);
        div.remove();
    });
    
    listaPseudopalavras.appendChild(div);
}

function adicionarFraseAoDOM(frase) {
    const div = document.createElement('div');
    div.className = 'bg-green-100 text-green-800 px-3 py-2 rounded-md text-sm flex items-center justify-between';
    div.innerHTML = `
        <span class="flex-1">${frase}</span>
        <button type="button" class="ml-2 text-green-600 hover:text-green-800" data-frase="${frase}">
            <i class="fas fa-times-circle"></i>
        </button>
    `;
    
    div.querySelector('button').addEventListener('click', function() {
        const fraseParaRemover = this.getAttribute('data-frase');
        frasesAdicionadas = frasesAdicionadas.filter(f => f !== fraseParaRemover);
        div.remove();
    });
    
    listaFrases.appendChild(div);
}

function resetQuestoes() {
    containerQuestoes.querySelectorAll('.questao:not(.questao-template)').forEach(el => el.remove());
    semQuestoes.classList.remove('hidden');
    questoesAdicionadas = [];
    contadorQuestoes = 0;
}

function preencherFormAvaliacao(avaliacao) {
    document.getElementById('nome-avaliacao').value = avaliacao.nome;
    textoAvaliacao.value = avaliacao.texto;
    
    // Atualizar contagem de palavras
    const texto = textoAvaliacao.value.trim();
    const palavras = texto === '' ? 0 : texto.split(/\s+/).length;
    contagemPalavras.textContent = palavras;
    
    if (palavras < 150 || palavras > 180) {
        contagemPalavras.classList.add('text-red-500');
        contagemPalavras.classList.remove('text-green-500');
    } else {
        contagemPalavras.classList.add('text-green-500');
        contagemPalavras.classList.remove('text-red-500');
    }
    
    // Adicionar palavras
    listaPalavras.innerHTML = '';
    palavrasAdicionadas = [...avaliacao.palavras];
    palavrasAdicionadas.forEach(palavra => {
        adicionarPalavraAoDOM(palavra);
    });
    
    // Adicionar pseudopalavras
    listaPseudopalavras.innerHTML = '';
    pseudopalavrasAdicionadas = [...avaliacao.pseudopalavras];
    pseudopalavrasAdicionadas.forEach(pseudopalavra => {
        adicionarPseudopalavraAoDOM(pseudopalavra);
    });
    
    // Adicionar frases
    listaFrases.innerHTML = '';
    frasesAdicionadas = avaliacao.frases ? [...avaliacao.frases] : [];
    frasesAdicionadas.forEach(frase => {
        adicionarFraseAoDOM(frase);
    });
    
    // Adicionar questões
    resetQuestoes();
    if (avaliacao.questoes && avaliacao.questoes.length > 0) {
        avaliacao.questoes.forEach(questao => {
            adicionarQuestao(questao);
        });
    }
}

function preencherFormEvento(evento) {
    document.getElementById('nome-evento').value = evento.nome;
    document.getElementById('avaliacao-evento').value = evento.avaliacaoId;
    document.getElementById('status-evento').checked = evento.ativo;
}

function atualizarTabelaAvaliacoes() {
    const tbody = document.querySelector('#secao-avaliacoes tbody');
    tbody.innerHTML = '';
    
    avaliacoes.forEach(avaliacao => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${avaliacao.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${avaliacao.nome}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${avaliacao.totalPalavras}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${avaliacao.totalPseudopalavras}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${avaliacao.questoes ? avaliacao.questoes.length : 0}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-blue-600 hover:text-blue-900 mr-2 editar-avaliacao" data-id="${avaliacao.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="text-red-600 hover:text-red-900 excluir-avaliacao" data-id="${avaliacao.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    // Configurar eventos dos botões
    document.querySelectorAll('.editar-avaliacao').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            const avaliacao = avaliacoes.find(a => a.id === id);
            if (avaliacao) {
                avaliacaoIdEmEdicao = id;
                preencherFormAvaliacao(avaliacao);
                document.querySelector('#modal-avaliacao h3').textContent = 'Editar Avaliação';
                modalAvaliacao.classList.remove('hidden');
            }
        });
    });
    
    document.querySelectorAll('.excluir-avaliacao').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            if (confirm('Tem certeza que deseja excluir esta avaliação?')) {
                avaliacoes = avaliacoes.filter(a => a.id !== id);
                atualizarTabelaAvaliacoes();
                alert('Avaliação excluída com sucesso!');
            }
        });
    });
}

function atualizarTabelaEventos() {
    const tbody = document.querySelector('#secao-eventos tbody');
    tbody.innerHTML = '';
    
    eventos.forEach(evento => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${evento.id}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${evento.nome}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${evento.avaliacaoNome}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${evento.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                    ${evento.ativo ? 'Ativo' : 'Inativo'}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-blue-600 hover:text-blue-900 mr-3 btn-editar-evento" data-id="${evento.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="text-red-600 hover:text-red-900 btn-excluir-evento" data-id="${evento.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    // Adicionar evento aos botões de editar e excluir
    document.querySelectorAll('.btn-editar-evento').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            const evento = eventos.find(e => e.id === id);
            
            if (evento) {
                eventoIdEmEdicao = id;
                document.querySelector('#modal-evento h3').textContent = 'Editar Evento de Avaliação';
                preencherFormEvento(evento);
                modalEvento.classList.remove('hidden');
            }
        });
    });
    
    document.querySelectorAll('.btn-excluir-evento').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            
            if (confirm('Tem certeza que deseja excluir este evento?')) {
                eventos = eventos.filter(e => e.id !== id);
                atualizarTabelaEventos();
                alert('Evento excluído com sucesso!');
            }
        });
    });
}

// Manipulação de questões de múltipla escolha
btnAdicionarQuestao.addEventListener('click', function() {
    adicionarQuestao();
});

function adicionarQuestao(questaoData = null) {
    semQuestoes.classList.add('hidden');
    
    // Clonar o template
    const novaQuestao = templateQuestao.cloneNode(true);
    novaQuestao.classList.remove('hidden', 'questao-template');
    novaQuestao.classList.add('questao');
    novaQuestao.id = `questao-${contadorQuestoes}`;
    
    // Configurar o grupo de radio buttons
    const radios = novaQuestao.querySelectorAll('.resposta-correta');
    radios.forEach(radio => {
        radio.name = `resposta-correta-${contadorQuestoes}`;
    });
    
    // Preencher com dados se fornecidos
    if (questaoData) {
        novaQuestao.querySelector('.enunciado-questao').value = questaoData.enunciado;
        
        // Remover opções extras se necessário
        const opcoesContainers = novaQuestao.querySelectorAll('.opcao-container');
        if (opcoesContainers.length > questaoData.opcoes.length) {
            for (let i = questaoData.opcoes.length; i < opcoesContainers.length; i++) {
                opcoesContainers[i].remove();
            }
        }
        
        // Preencher opções existentes
        questaoData.opcoes.forEach((opcao, index) => {
            if (index < opcoesContainers.length) {
                opcoesContainers[index].querySelector('.texto-opcao').value = opcao;
                if (index === questaoData.respostaCorreta) {
                    opcoesContainers[index].querySelector('.resposta-correta').checked = true;
                }
            } else {
                // Adicionar nova opção se necessário
                adicionarOpcao(novaQuestao, opcao, index === questaoData.respostaCorreta);
            }
        });
    }
    
    // Configurar botões de adicionar/remover opções
    novaQuestao.querySelector('.btn-adicionar-opcao').addEventListener('click', function() {
        adicionarOpcao(novaQuestao);
    });
    
    novaQuestao.querySelectorAll('.btn-remover-opcao').forEach(btn => {
        btn.addEventListener('click', function() {
            const container = this.closest('.opcao-container');
            if (novaQuestao.querySelectorAll('.opcao-container').length > 2) {
                container.remove();
            } else {
                alert('Uma questão deve ter pelo menos 2 opções.');
            }
        });
    });
    
    // Configurar botão de remover questão
    novaQuestao.querySelector('.btn-remover-questao').addEventListener('click', function() {
        novaQuestao.remove();
        
        // Mostrar mensagem "sem questões" se necessário
        if (containerQuestoes.querySelectorAll('.questao:not(.questao-template)').length === 0) {
            semQuestoes.classList.remove('hidden');
        }
    });
    
    // Adicionar a questão ao container
    containerQuestoes.appendChild(novaQuestao);
    contadorQuestoes++;
}

function adicionarOpcao(questaoEl, textoOpcao = '', selecionada = false) {
    const opcaoContainer = document.createElement('div');
    opcaoContainer.className = 'opcao-container flex items-center mt-2';
    
    const radioName = questaoEl.querySelector('.resposta-correta').name;
    
    opcaoContainer.innerHTML = `
        <input type="radio" name="${radioName}" class="resposta-correta mr-2 h-4 w-4" ${selecionada ? 'checked' : ''}>
        <input type="text" class="texto-opcao flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
            value="${textoOpcao}" placeholder="Nova alternativa">
        <button type="button" class="btn-remover-opcao ml-2 text-red-500 hover:text-red-700">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    opcaoContainer.querySelector('.btn-remover-opcao').addEventListener('click', function() {
        if (questaoEl.querySelectorAll('.opcao-container').length > 2) {
            opcaoContainer.remove();
        } else {
            alert('Uma questão deve ter pelo menos 2 opções.');
        }
    });
    
    const alternativasContainer = questaoEl.querySelector('.space-y-2');
    alternativasContainer.appendChild(opcaoContainer);
}

// Função para exportar uma avaliação
function exportarAvaliacao(id) {
    const avaliacao = avaliacoes.find(a => a.id === id);
    
    if (!avaliacao) {
        alert('Avaliação não encontrada!');
        return;
    }
    
    // Perguntar qual formato o usuário deseja para exportação
    const formatoOptions = ['DOCX para aluno', 'DOCX para aplicação'];
    let mensagem = 'Escolha o formato de exportação:\n';
    formatoOptions.forEach((formato, index) => {
        mensagem += `${index + 1}. ${formato}\n`;
    });
    
    const escolha = prompt(mensagem, '1');
    
    if (!escolha) return; // Usuário cancelou
    
    const opcaoEscolhida = parseInt(escolha);
    
    if (isNaN(opcaoEscolhida) || opcaoEscolhida < 1 || opcaoEscolhida > formatoOptions.length) {
        alert('Opção inválida!');
        return;
    }
    
    switch (opcaoEscolhida) {
        case 1: // DOCX para aluno
            exportarAvaliacaoDOCXAluno(avaliacao);
            break;
        case 2: // DOCX para aplicação
            exportarAvaliacaoDOCXAplicacao(avaliacao);
            break;
    }
}

// Função para exportar todas as avaliações
function exportarTodasAvaliacoes() {
    if (avaliacoes.length === 0) {
        alert('Não há avaliações para exportar!');
        return;
    }
    
    // Perguntar qual formato o usuário deseja para exportação
    const formatoOptions = ['DOCX para alunos', 'DOCX para aplicação'];
    let mensagem = 'Escolha o formato de exportação:\n';
    formatoOptions.forEach((formato, index) => {
        mensagem += `${index + 1}. ${formato}\n`;
    });
    
    const escolha = prompt(mensagem, '1');
    
    if (!escolha) return; // Usuário cancelou
    
    const opcaoEscolhida = parseInt(escolha);
    
    if (isNaN(opcaoEscolhida) || opcaoEscolhida < 1 || opcaoEscolhida > formatoOptions.length) {
        alert('Opção inválida!');
        return;
    }
    
    switch (opcaoEscolhida) {
        case 1: // DOCX para alunos
            exportarTodasAvaliacoesDOCXAluno();
            break;
        case 2: // DOCX para aplicação
            exportarTodasAvaliacoesDOCXAplicacao();
            break;
    }
}

// Função para exportar uma avaliação em formato DOCX para alunos
function exportarAvaliacaoDOCXAluno(avaliacao) {
    try {
        // Verificar se a biblioteca docx está disponível
        if (typeof docx === 'undefined') {
            alert('Biblioteca de geração DOCX não está disponível. Verifique sua conexão com a internet.');
            return;
        }
        
        // Desestruturar objetos da biblioteca docx
        const { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, PageNumber, Header, Footer, BorderStyle } = docx;
        
        // Criar novo documento
        const doc = new Document({
            creator: "SALF - Sistema de Avaliação, Leitura e Fluência",
            title: avaliacao.nome,
            description: "Avaliação de leitura e fluência",
            styles: {
                paragraphStyles: [
                    {
                        id: "Normal",
                        name: "Normal",
                        basedOn: "Normal",
                        next: "Normal",
                        quickFormat: true,
                        run: {
                            size: 24, // 12pt
                            font: "Calibri",
                        },
                        paragraph: {
                            spacing: {
                                line: 276, // 1.15x linha
                                after: 200, // 10pt depois
                            },
                        },
                    },
                    {
                        id: "Heading1",
                        name: "Heading 1",
                        basedOn: "Normal",
                        next: "Normal",
                        quickFormat: true,
                        run: {
                            size: 32, // 16pt
                            bold: true,
                            font: "Calibri",
                        },
                        paragraph: {
                            spacing: {
                                before: 240, // 12pt antes
                                after: 240, // 12pt depois
                            },
                        },
                    },
                    {
                        id: "Heading2",
                        name: "Heading 2",
                        basedOn: "Normal",
                        next: "Normal",
                        quickFormat: true,
                        run: {
                            size: 28, // 14pt
                            bold: true,
                            font: "Calibri",
                        },
                        paragraph: {
                            spacing: {
                                before: 240, // 12pt antes
                                after: 240, // 12pt depois
                            },
                        },
                    },
                ],
            }
        });
        
        // Adicionar cabeçalho com título centralizado
        const children = [
            new Paragraph({
                text: "SALF - Sistema de Avaliação, Leitura e Fluência",
                heading: HeadingLevel.HEADING_1,
                alignment: AlignmentType.CENTER
            }),
            new Paragraph({
                text: avaliacao.nome,
                heading: HeadingLevel.HEADING_2,
                alignment: AlignmentType.CENTER,
                border: {
                    bottom: {
                        color: "auto",
                        space: 1,
                        style: BorderStyle.SINGLE,
                        size: 6
                    },
                },
                spacing: {
                    after: 400 // 20pt
                }
            }),
            new Paragraph({
                text: "Dados do Aluno",
                heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({
                children: [
                    new TextRun("Nome: "),
                    new TextRun({
                        text: "_".repeat(50),
                        bold: false,
                    }),
                ],
            }),
            new Paragraph({
                children: [
                    new TextRun("Turma: "),
                    new TextRun({
                        text: "_".repeat(15),
                        bold: false,
                    }),
                    new TextRun("  Data: "),
                    new TextRun({
                        text: "_".repeat(15),
                        bold: false,
                    }),
                ],
                spacing: {
                    after: 400 // 20pt
                }
            }),
        ];
        
        // Adicionar seção de palavras
        if (avaliacao.palavras && avaliacao.palavras.length > 0) {
            children.push(
                new Paragraph({
                    text: "Palavras",
                    heading: HeadingLevel.HEADING_2,
                    pageBreakBefore: true
                })
            );
            
            // Organizar palavras em duas colunas
            const colunasMax = 2;
            const linhasMax = Math.ceil(avaliacao.palavras.length / colunasMax);
            
            for (let linha = 0; linha < linhasMax; linha++) {
                const palavrasLinha = [];
                
                for (let coluna = 0; coluna < colunasMax; coluna++) {
                    const index = linha + coluna * linhasMax;
                    if (index < avaliacao.palavras.length) {
                        // Adicionar palavra com espaço após
                        palavrasLinha.push(new TextRun({
                            text: `${(index + 1).toString().padStart(2, '0')}. ${avaliacao.palavras[index]}`,
                            bold: true
                        }));
                        
                        // Adicionar espaço entre colunas
                        if (coluna < colunasMax - 1) {
                            palavrasLinha.push(new TextRun({
                                text: "\t",
                            }));
                        }
                    }
                }
                
                children.push(
                    new Paragraph({
                        children: palavrasLinha,
                        tabStops: [
                            {
                                type: AlignmentType.LEFT,
                                position: 4000, // Centro da página aproximadamente
                            },
                        ]
                    })
                );
            }
        }
        
        // Adicionar seção de pseudopalavras
        if (avaliacao.pseudopalavras && avaliacao.pseudopalavras.length > 0) {
            children.push(
                new Paragraph({
                    text: "Pseudopalavras",
                    heading: HeadingLevel.HEADING_2,
                    pageBreakBefore: true
                })
            );
            
            // Organizar pseudopalavras em duas colunas
            const colunasMax = 2;
            const linhasMax = Math.ceil(avaliacao.pseudopalavras.length / colunasMax);
            
            for (let linha = 0; linha < linhasMax; linha++) {
                const palavrasLinha = [];
                
                for (let coluna = 0; coluna < colunasMax; coluna++) {
                    const index = linha + coluna * linhasMax;
                    if (index < avaliacao.pseudopalavras.length) {
                        // Adicionar palavra com espaço após
                        palavrasLinha.push(new TextRun({
                            text: `${(index + 1).toString().padStart(2, '0')}. ${avaliacao.pseudopalavras[index]}`,
                            bold: true,
                            italics: true
                        }));
                        
                        // Adicionar espaço entre colunas
                        if (coluna < colunasMax - 1) {
                            palavrasLinha.push(new TextRun({
                                text: "\t",
                            }));
                        }
                    }
                }
                
                children.push(
                    new Paragraph({
                        children: palavrasLinha,
                        tabStops: [
                            {
                                type: AlignmentType.LEFT,
                                position: 4000, // Centro da página aproximadamente
                            },
                        ]
                    })
                );
            }
        }
        
        // Adicionar seção de frases
        if (avaliacao.frases && avaliacao.frases.length > 0) {
            children.push(
                new Paragraph({
                    text: "Frases",
                    heading: HeadingLevel.HEADING_2,
                    pageBreakBefore: true
                })
            );
            
            avaliacao.frases.forEach((frase, index) => {
                children.push(
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `${(index + 1).toString().padStart(2, '0')}. ${frase}`,
                                bold: false
                            })
                        ],
                        spacing: {
                            after: 240 // 12pt
                        }
                    })
                );
            });
        }
        
        // Adicionar seção de texto
        if (avaliacao.texto) {
            children.push(
                new Paragraph({
                    text: "Texto",
                    heading: HeadingLevel.HEADING_2,
                    pageBreakBefore: true
                })
            );
            
            // Dividir texto em parágrafos
            const paragrafos = avaliacao.texto.split(/\n+/);
            paragrafos.forEach(paragrafo => {
                if (paragrafo.trim()) {
                    children.push(
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: paragrafo,
                                    bold: false,
                                    size: 24 // 12pt
                                })
                            ],
                            spacing: {
                                line: 360, // 1.5 linhas
                                after: 240 // 12pt
                            }
                        })
                    );
                }
            });
        }
        
        // Adicionar questões
        if (avaliacao.questoes && avaliacao.questoes.length > 0) {
            children.push(
                new Paragraph({
                    text: "Questões de Interpretação",
                    heading: HeadingLevel.HEADING_2,
                    pageBreakBefore: true
                })
            );
            
            avaliacao.questoes.forEach((questao, index) => {
                children.push(
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `${(index + 1)}. ${questao.enunciado}`,
                                bold: true
                            })
                        ],
                        spacing: {
                            before: 240, // 12pt
                            after: 200 // 10pt
                        }
                    })
                );
                
                // Adicionar alternativas
                questao.opcoes.forEach((opcao, opcaoIndex) => {
                    children.push(
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: `${String.fromCharCode(97 + opcaoIndex)}) ${opcao}`,
                                    bold: false
                                })
                            ],
                            spacing: {
                                after: 120 // 6pt
                            },
                            indent: {
                                left: 720 // 0.5 polegadas
                            }
                        })
                    );
                });
            });
        }
        
        // Adicionar todos os elementos ao documento
        doc.addSection({
            children: children
        });
        
        // Gerar documento e fazer download
        docx.Packer.toBlob(doc).then(blob => {
            saveAs(blob, `avaliacao-aluno-${avaliacao.id}-${avaliacao.nome.replace(/\s+/g, '_').toLowerCase()}.docx`);
            alert('Avaliação para aluno exportada com sucesso em formato DOCX!');
        });
    } catch (error) {
        console.error("Erro ao gerar documento DOCX:", error);
        alert(`Erro ao gerar documento DOCX: ${error.message}`);
    }
}

// Função para exportar uma avaliação em formato DOCX para aplicação
function exportarAvaliacaoDOCXAplicacao(avaliacao) {
    try {
        // Verificar se a biblioteca docx está disponível
        if (typeof docx === 'undefined') {
            alert('Biblioteca de geração DOCX não está disponível. Verifique sua conexão com a internet.');
            return;
        }
        
        // Desestruturar objetos da biblioteca docx
        const { Document, Paragraph, TextRun, Table, TableRow, TableCell, BorderStyle, HeadingLevel, AlignmentType } = docx;
        
        // Criar novo documento
        const doc = new Document({
            creator: "SALF - Sistema de Avaliação, Leitura e Fluência",
            title: `Aplicação: ${avaliacao.nome}`,
            description: "Ficha de aplicação de avaliação de leitura e fluência",
            styles: {
                paragraphStyles: [
                    {
                        id: "Normal",
                        name: "Normal",
                        basedOn: "Normal",
                        next: "Normal",
                        quickFormat: true,
                        run: {
                            size: 24, // 12pt
                            font: "Calibri",
                        },
                        paragraph: {
                            spacing: {
                                line: 276, // 1.15x linha
                                after: 200, // 10pt depois
                            },
                        },
                    },
                    {
                        id: "Heading1",
                        name: "Heading 1",
                        basedOn: "Normal",
                        next: "Normal",
                        quickFormat: true,
                        run: {
                            size: 32, // 16pt
                            bold: true,
                            font: "Calibri",
                        },
                        paragraph: {
                            spacing: {
                                before: 240, // 12pt antes
                                after: 240, // 12pt depois
                            },
                        },
                    },
                    {
                        id: "Heading2",
                        name: "Heading 2",
                        basedOn: "Normal",
                        next: "Normal",
                        quickFormat: true,
                        run: {
                            size: 28, // 14pt
                            bold: true,
                            font: "Calibri",
                        },
                        paragraph: {
                            spacing: {
                                before: 240, // 12pt antes
                                after: 240, // 12pt depois
                            },
                        },
                    },
                ],
            }
        });
        
        // Adicionar cabeçalho com título centralizado
        const children = [
            new Paragraph({
                text: "SALF - Sistema de Avaliação, Leitura e Fluência",
                heading: HeadingLevel.HEADING_1,
                alignment: AlignmentType.CENTER
            }),
            new Paragraph({
                text: `FICHA DE APLICAÇÃO: ${avaliacao.nome}`,
                heading: HeadingLevel.HEADING_2,
                alignment: AlignmentType.CENTER,
                border: {
                    bottom: {
                        color: "auto",
                        space: 1,
                        style: BorderStyle.SINGLE,
                        size: 6
                    },
                },
                spacing: {
                    after: 400 // 20pt
                }
            }),
            
            // Dados do Aluno e do Aplicador
            new Paragraph({
                text: "Dados da Aplicação",
                heading: HeadingLevel.HEADING_2,
            }),
            
            // Tabela com dados do aluno e aplicador
            new Table({
                width: {
                    size: 100,
                    type: 'pct',
                },
                borders: {
                    top: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
                    bottom: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
                    left: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
                    right: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
                    insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
                    insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
                },
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({
                                width: { size: 30, type: "pct" },
                                children: [
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: "Nome do Aluno:",
                                                bold: true,
                                            }),
                                        ],
                                    }),
                                ],
                            }),
                            new TableCell({
                                width: { size: 70, type: "pct" },
                                children: [
                                    new Paragraph({
                                        text: "",
                                    }),
                                ],
                            }),
                        ],
                    }),
                    new TableRow({
                        children: [
                            new TableCell({
                                width: { size: 30, type: "pct" },
                                children: [
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: "Turma:",
                                                bold: true,
                                            }),
                                        ],
                                    }),
                                ],
                            }),
                            new TableCell({
                                width: { size: 70, type: "pct" },
                                children: [
                                    new Paragraph({
                                        text: "",
                                    }),
                                ],
                            }),
                        ],
                    }),
                    new TableRow({
                        children: [
                            new TableCell({
                                width: { size: 30, type: "pct" },
                                children: [
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: "Nome do Aplicador:",
                                                bold: true,
                                            }),
                                        ],
                                    }),
                                ],
                            }),
                            new TableCell({
                                width: { size: 70, type: "pct" },
                                children: [
                                    new Paragraph({
                                        text: "",
                                    }),
                                ],
                            }),
                        ],
                    }),
                    new TableRow({
                        children: [
                            new TableCell({
                                width: { size: 30, type: "pct" },
                                children: [
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: "Data da Aplicação:",
                                                bold: true,
                                            }),
                                        ],
                                    }),
                                ],
                            }),
                            new TableCell({
                                width: { size: 70, type: "pct" },
                                children: [
                                    new Paragraph({
                                        text: "",
                                    }),
                                ],
                            }),
                        ],
                    }),
                ],
            }),
            
            new Paragraph({
                text: "Resultados da Avaliação",
                heading: HeadingLevel.HEADING_2,
                pageBreakBefore: true
            }),
            
            // Tabela de resultados
            new Table({
                width: {
                    size: 100,
                    type: 'pct',
                },
                borders: {
                    top: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
                    bottom: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
                    left: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
                    right: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
                    insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
                    insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
                },
                rows: [
                    // Cabeçalho tabela
                    new TableRow({
                        tableHeader: true,
                        children: [
                            new TableCell({
                                width: { size: 40, type: "pct" },
                                shading: {
                                    fill: "CCCCCC",
                                },
                                children: [
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: "Item",
                                                bold: true,
                                            }),
                                        ],
                                        alignment: AlignmentType.CENTER,
                                    }),
                                ],
                            }),
                            new TableCell({
                                width: { size: 20, type: "pct" },
                                shading: {
                                    fill: "CCCCCC",
                                },
                                children: [
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: "Palavras Lidas",
                                                bold: true,
                                            }),
                                        ],
                                        alignment: AlignmentType.CENTER,
                                    }),
                                ],
                            }),
                            new TableCell({
                                width: { size: 20, type: "pct" },
                                shading: {
                                    fill: "CCCCCC",
                                },
                                children: [
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: "Palavras Corretas",
                                                bold: true,
                                            }),
                                        ],
                                        alignment: AlignmentType.CENTER,
                                    }),
                                ],
                            }),
                            new TableCell({
                                width: { size: 20, type: "pct" },
                                shading: {
                                    fill: "CCCCCC",
                                },
                                children: [
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: "Tempo (segundos)",
                                                bold: true,
                                            }),
                                        ],
                                        alignment: AlignmentType.CENTER,
                                    }),
                                ],
                            }),
                        ],
                    }),
                    // Linha de palavras
                    new TableRow({
                        children: [
                            new TableCell({
                                children: [
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: "Palavras",
                                                bold: true,
                                            }),
                                        ],
                                    }),
                                ],
                            }),
                            new TableCell({
                                children: [
                                    new Paragraph({
                                        text: "",
                                    }),
                                ],
                            }),
                            new TableCell({
                                children: [
                                    new Paragraph({
                                        text: "",
                                    }),
                                ],
                            }),
                            new TableCell({
                                children: [
                                    new Paragraph({
                                        text: "",
                                    }),
                                ],
                            }),
                        ],
                    }),
                    // Linha de pseudopalavras
                    new TableRow({
                        children: [
                            new TableCell({
                                children: [
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: "Pseudopalavras",
                                                bold: true,
                                            }),
                                        ],
                                    }),
                                ],
                            }),
                            new TableCell({
                                children: [
                                    new Paragraph({
                                        text: "",
                                    }),
                                ],
                            }),
                            new TableCell({
                                children: [
                                    new Paragraph({
                                        text: "",
                                    }),
                                ],
                            }),
                            new TableCell({
                                children: [
                                    new Paragraph({
                                        text: "",
                                    }),
                                ],
                            }),
                        ],
                    }),
                    // Linha de texto
                    new TableRow({
                        children: [
                            new TableCell({
                                children: [
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: "Texto",
                                                bold: true,
                                            }),
                                        ],
                                    }),
                                ],
                            }),
                            new TableCell({
                                children: [
                                    new Paragraph({
                                        text: "",
                                    }),
                                ],
                            }),
                            new TableCell({
                                children: [
                                    new Paragraph({
                                        text: "",
                                    }),
                                ],
                            }),
                            new TableCell({
                                children: [
                                    new Paragraph({
                                        text: "",
                                    }),
                                ],
                            }),
                        ],
                    }),
                ],
            }),
            
            // Tabela para classificação
            new Paragraph({
                text: "Classificação de Fluência",
                heading: HeadingLevel.HEADING_2,
                spacing: {
                    before: 480, // 24pt antes
                }
            }),
            
            // Adicionar campo para ano escolar
            new Table({
                width: {
                    size: 100,
                    type: 'pct',
                },
                borders: {
                    top: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
                    bottom: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
                    left: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
                    right: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
                },
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({
                                width: { size: 30, type: "pct" },
                                children: [
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: "Ano Escolar:",
                                                bold: true,
                                            }),
                                        ],
                                    }),
                                ],
                            }),
                            new TableCell({
                                width: { size: 70, type: "pct" },
                                children: [
                                    new Paragraph({
                                        text: "",
                                    }),
                                ],
                            }),
                        ],
                    }),
                ],
            }),
            
            new Paragraph({
                text: "Classificação Automática",
                bold: true,
                spacing: {
                    before: 240, // 12pt antes
                    after: 120, // 6pt depois
                }
            }),
            
            new Paragraph({
                text: "O sistema classifica automaticamente o nível do aluno com base nas palavras por minuto e pseudopalavras lidas. Preencha os valores na tabela de resultados acima e o ano escolar.",
                spacing: {
                    after: 240, // 12pt depois
                }
            }),
            
            new Table({
                width: {
                    size: 100,
                    type: 'pct',
                },
                borders: {
                    top: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
                    bottom: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
                    left: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
                    right: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
                    insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
                    insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
                },
                rows: [
                    // Cabeçalho da tabela
                    new TableRow({
                        tableHeader: true,
                        children: [
                            new TableCell({
                                width: { size: 20, type: "pct" },
                                shading: {
                                    fill: "CCCCCC",
                                },
                                children: [
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: "Nível",
                                                bold: true,
                                            }),
                                        ],
                                        alignment: AlignmentType.CENTER,
                                    }),
                                ],
                            }),
                            new TableCell({
                                width: { size: 30, type: "pct" },
                                shading: {
                                    fill: "CCCCCC",
                                },
                                children: [
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: "Classificação",
                                                bold: true,
                                            }),
                                        ],
                                        alignment: AlignmentType.CENTER,
                                    }),
                                ],
                            }),
                            new TableCell({
                                width: { size: 50, type: "pct" },
                                shading: {
                                    fill: "CCCCCC",
                                },
                                children: [
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: "Observação",
                                                bold: true,
                                            }),
                                        ],
                                        alignment: AlignmentType.CENTER,
                                    }),
                                ],
                            }),
                        ],
                    }),
                    // Linha para resultados
                    new TableRow({
                        children: [
                            new TableCell({
                                children: [
                                    new Paragraph({
                                        text: "",
                                        alignment: AlignmentType.CENTER,
                                    }),
                                ],
                            }),
                            new TableCell({
                                children: [
                                    new Paragraph({
                                        text: "",
                                        alignment: AlignmentType.CENTER,
                                    }),
                                ],
                            }),
                            new TableCell({
                                children: [
                                    new Paragraph({
                                        text: "",
                                    }),
                                ],
                            }),
                        ],
                    }),
                ],
            }),
            
            new Table({
                width: {
                    size: 100,
                    type: 'pct',
                },
                borders: {
                    top: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
                    bottom: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
                    left: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
                    right: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
                    insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
                    insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
                },
                rows: [
                    // Nível 1
                    new TableRow({
                        children: [
                            new TableCell({
                                width: { size: 15, type: "pct" },
                                children: [
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: "NÍVEL 1",
                                                bold: true,
                                            }),
                                        ],
                                        alignment: AlignmentType.CENTER,
                                    }),
                                ],
                            }),
                            new TableCell({
                                width: { size: 25, type: "pct" },
                                children: [
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: "NÃO LEITOR",
                                                bold: true,
                                            }),
                                        ],
                                        alignment: AlignmentType.CENTER,
                                    }),
                                ],
                            }),
                            new TableCell({
                                width: { size: 60, type: "pct" },
                                children: [
                                    new Paragraph({
                                        text: "Lê até 20 palavras por minuto com muitos erros e até 4 pseudopalavras pequenas",
                                        alignment: AlignmentType.LEFT,
                                    }),
                                ],
                            }),
                        ],
                    }),
                    // Nível 2
                    new TableRow({
                        children: [
                            new TableCell({
                                children: [
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: "NÍVEL 2",
                                                bold: true,
                                            }),
                                        ],
                                        alignment: AlignmentType.CENTER,
                                    }),
                                ],
                            }),
                            new TableCell({
                                children: [
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: "LEITOR DE SÍLABAS",
                                                bold: true,
                                            }),
                                        ],
                                        alignment: AlignmentType.CENTER,
                                    }),
                                ],
                            }),
                            new TableCell({
                                children: [
                                    new Paragraph({
                                        text: "O estudante lê de 21 a 39 palavras com precisão que em sua maioria são canônicas e até de 5 a 10 pseudopalavras",
                                        alignment: AlignmentType.LEFT,
                                    }),
                                ],
                            }),
                        ],
                    }),
                    // Nível 3
                    new TableRow({
                        children: [
                            new TableCell({
                                children: [
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: "NÍVEL 3",
                                                bold: true,
                                            }),
                                        ],
                                        alignment: AlignmentType.CENTER,
                                    }),
                                ],
                            }),
                            new TableCell({
                                children: [
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: "LEITOR DE PALAVRAS",
                                                bold: true,
                                            }),
                                        ],
                                        alignment: AlignmentType.CENTER,
                                    }),
                                ],
                            }),
                            new TableCell({
                                children: [
                                    new Paragraph({
                                        text: "Lê de 40 a 69 palavras canônicas e algumas não canônicas por minuto e de 11 a 20 pseudopalavras",
                                        alignment: AlignmentType.LEFT,
                                    }),
                                ],
                            }),
                        ],
                    }),
                    // Nível 4
                    new TableRow({
                        children: [
                            new TableCell({
                                children: [
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: "NÍVEL 4",
                                                bold: true,
                                            }),
                                        ],
                                        alignment: AlignmentType.CENTER,
                                    }),
                                ],
                            }),
                            new TableCell({
                                children: [
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: "LEITOR DE FRASES",
                                                bold: true,
                                            }),
                                        ],
                                        alignment: AlignmentType.CENTER,
                                    }),
                                ],
                            }),
                            new TableCell({
                                children: [
                                    new Paragraph({
                                        text: "Lê 70 a 89 palavras por minuto, entre canônicas e não canônicas e de 21 a 30 pseudopalavras",
                                        alignment: AlignmentType.LEFT,
                                    }),
                                ],
                            }),
                        ],
                    }),
                    // Nível 5
                    new TableRow({
                        children: [
                            new TableCell({
                                children: [
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: "NÍVEL 5",
                                                bold: true,
                                            }),
                                        ],
                                        alignment: AlignmentType.CENTER,
                                    }),
                                ],
                            }),
                            new TableCell({
                                children: [
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: "LEITOR DE TEXTO SEM FLUÊNCIA",
                                                bold: true,
                                            }),
                                        ],
                                        alignment: AlignmentType.CENTER,
                                    }),
                                ],
                            }),
                            new TableCell({
                                children: [
                                    new Paragraph({
                                        text: "Lê 90 a 109 palavras por minuto e de 31 a 40 pseudopalavras",
                                        alignment: AlignmentType.LEFT,
                                    }),
                                ],
                            }),
                        ],
                    }),
                    // Nível 6
                    new TableRow({
                        children: [
                            new TableCell({
                                children: [
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: "NÍVEL 6",
                                                bold: true,
                                            }),
                                        ],
                                        alignment: AlignmentType.CENTER,
                                    }),
                                ],
                            }),
                            new TableCell({
                                children: [
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: "LEITOR DE TEXTO COM FLUÊNCIA",
                                                bold: true,
                                            }),
                                        ],
                                        alignment: AlignmentType.CENTER,
                                    }),
                                ],
                            }),
                            new TableCell({
                                children: [
                                    new Paragraph({
                                        text: "Lê ≥ 110 ou mais palavras e acima de 41 pseudopalavras, com ritmo, entonação e domínio das estruturas silábicas complexas",
                                        alignment: AlignmentType.LEFT,
                                    }),
                                ],
                            }),
                        ],
                    }),
                ],
            }),
            
            // Campo para nível final
            new Paragraph({
                children: [
                    new TextRun({
                        text: "NÍVEL FINAL DO ALUNO: ",
                        bold: true,
                        size: 28,
                    }),
                    new TextRun({
                        text: "_________________",
                        bold: false,
                        size: 28,
                    }),
                ],
                spacing: {
                    before: 360, // 18pt
                    after: 360, // 18pt
                },
            }),
            
            // Campo para observações
            new Paragraph({
                text: "Observações:",
                bold: true,
            }),
            
            new Paragraph({
                text: "_".repeat(90),
            }),
            new Paragraph({
                text: "_".repeat(90),
            }),
            new Paragraph({
                text: "_".repeat(90),
            }),
            new Paragraph({
                text: "_".repeat(90),
            }),
            
            // Assinatura do aplicador
            new Paragraph({
                children: [
                    new TextRun({
                        text: "Assinatura do Aplicador: ",
                        bold: true,
                    }),
                    new TextRun({
                        text: "_".repeat(50),
                        bold: false,
                    }),
                ],
                spacing: {
                    before: 560, // 28pt
                },
            }),
        ];
        
        // Adicionar seção com listas de itens para referência do aplicador
        const childrenSecaoItens = [
            new Paragraph({
                text: "Lista de Itens Para Aplicação",
                heading: HeadingLevel.HEADING_1,
                pageBreakBefore: true
            }),
        ];
        
        // Adicionar seção de palavras
        if (avaliacao.palavras && avaliacao.palavras.length > 0) {
            childrenSecaoItens.push(
                new Paragraph({
                    text: "Palavras",
                    heading: HeadingLevel.HEADING_2,
                })
            );
            
            // Organizar palavras em lista numerada
            avaliacao.palavras.forEach((palavra, index) => {
                childrenSecaoItens.push(
                    new Paragraph({
                        text: `${(index + 1).toString().padStart(2, '0')}. ${palavra}`,
                        spacing: {
                            after: 80 // 4pt
                        }
                    })
                );
            });
        }
        
        // Adicionar seção de pseudopalavras
        if (avaliacao.pseudopalavras && avaliacao.pseudopalavras.length > 0) {
            childrenSecaoItens.push(
                new Paragraph({
                    text: "Pseudopalavras",
                    heading: HeadingLevel.HEADING_2,
                    pageBreakBefore: true
                })
            );
            
            // Organizar pseudopalavras em lista numerada
            avaliacao.pseudopalavras.forEach((pseudopalavra, index) => {
                childrenSecaoItens.push(
                    new Paragraph({
                        text: `${(index + 1).toString().padStart(2, '0')}. ${pseudopalavra}`,
                        spacing: {
                            after: 80 // 4pt
                        }
                    })
                );
            });
        }
        
        // Adicionar seção de texto
        if (avaliacao.texto) {
            childrenSecaoItens.push(
                new Paragraph({
                    text: "Texto",
                    heading: HeadingLevel.HEADING_2,
                    pageBreakBefore: true
                })
            );
            
            // Dividir texto em parágrafos
            const paragrafos = avaliacao.texto.split(/\n+/);
            paragrafos.forEach(paragrafo => {
                if (paragrafo.trim()) {
                    childrenSecaoItens.push(
                        new Paragraph({
                            text: paragrafo,
                            spacing: {
                                line: 360, // 1.5 linhas
                                after: 240 // 12pt
                            }
                        })
                    );
                }
            });
            
            // Adicionar contagem de palavras
            const palavrasTexto = avaliacao.texto.trim().split(/\s+/).length;
            childrenSecaoItens.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `Total de palavras no texto: ${palavrasTexto}`,
                            bold: true
                        })
                    ],
                    spacing: {
                        before: 240, // 12pt
                    }
                })
            );
        }
        
        // Adicionar questões
        if (avaliacao.questoes && avaliacao.questoes.length > 0) {
            childrenSecaoItens.push(
                new Paragraph({
                    text: "Questões de Interpretação",
                    heading: HeadingLevel.HEADING_2,
                    pageBreakBefore: true
                })
            );
            
            avaliacao.questoes.forEach((questao, index) => {
                childrenSecaoItens.push(
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `${(index + 1)}. ${questao.enunciado}`,
                                bold: true
                            })
                        ],
                        spacing: {
                            before: 240, // 12pt
                            after: 200 // 10pt
                        }
                    })
                );
                
                // Adicionar alternativas com resposta correta destacada
                questao.opcoes.forEach((opcao, opcaoIndex) => {
                    const correto = opcaoIndex === questao.respostaCorreta;
                    
                    childrenSecaoItens.push(
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: `${String.fromCharCode(97 + opcaoIndex)}) ${opcao}`,
                                    bold: correto,
                                    highlight: correto ? "yellow" : undefined
                                }),
                                correto ? new TextRun({ text: " ✓", bold: true, highlight: "yellow" }) : undefined
                            ].filter(Boolean),
                            spacing: {
                                after: 120 // 6pt
                            },
                            indent: {
                                left: 720 // 0.5 polegadas
                            }
                        })
                    );
                });
            });
        }
        
        // Adicionar primeira seção com ficha de avaliação
        doc.addSection({
            children: children
        });
        
        // Adicionar segunda seção com itens para aplicação
        doc.addSection({
            children: childrenSecaoItens
        });
        
        // Gerar documento e fazer download
        docx.Packer.toBlob(doc).then(blob => {
            saveAs(blob, `avaliacao-aplicacao-${avaliacao.id}-${avaliacao.nome.replace(/\s+/g, '_').toLowerCase()}.docx`);
            alert('Versão para aplicação exportada com sucesso em formato DOCX!');
        });
    } catch (error) {
        console.error("Erro ao gerar documento DOCX:", error);
        alert(`Erro ao gerar documento DOCX: ${error.message}`);
    }
}

// Adicionar evento ao botão de exportar todas as avaliações
if (btnExportarAvaliacoes) {
    btnExportarAvaliacoes.addEventListener('click', exportarTodasAvaliacoes);
}

// Inicialização
atualizarTabelaAvaliacoes();
atualizarTabelaEventos();

// Adicionar evento ao botão de exportar todas as avaliações
if (btnExportarAvaliacoes) {
    btnExportarAvaliacoes.addEventListener('click', exportarTodasAvaliacoes);
}

// Função para exportar todas as avaliações em formato DOCX para alunos
function exportarTodasAvaliacoesDOCXAluno() {
    if (avaliacoes.length === 0) {
        alert('Não há avaliações para exportar!');
        return;
    }
    
    let processadas = 0;
    const total = avaliacoes.length;
    
    // Informar o usuário que a operação pode demorar
    alert(`Serão exportadas ${total} avaliações em formato DOCX para alunos. Isso pode levar alguns segundos.`);
    
    // Exportar cada avaliação
    avaliacoes.forEach(avaliacao => {
        setTimeout(() => {
            exportarAvaliacaoDOCXAluno(avaliacao);
            processadas++;
            
            if (processadas === total) {
                alert(`Exportação de ${total} avaliações para alunos concluída!`);
            }
        }, processadas * 500); // Escalonar as exportações para evitar sobrecarga
    });
}

// Função para exportar todas as avaliações em formato DOCX para aplicação
function exportarTodasAvaliacoesDOCXAplicacao() {
    if (avaliacoes.length === 0) {
        alert('Não há avaliações para exportar!');
        return;
    }
    
    let processadas = 0;
    const total = avaliacoes.length;
    
    // Informar o usuário que a operação pode demorar
    alert(`Serão exportadas ${total} avaliações em formato DOCX para aplicação. Isso pode levar alguns segundos.`);
    
    // Exportar cada avaliação
    avaliacoes.forEach(avaliacao => {
        setTimeout(() => {
            exportarAvaliacaoDOCXAplicacao(avaliacao);
            processadas++;
            
            if (processadas === total) {
                alert(`Exportação de ${total} avaliações para aplicação concluída!`);
            }
        }, processadas * 500); // Escalonar as exportações para evitar sobrecarga
    });
}

// Função para classificar automaticamente o nível do aluno
function classificarNivelAluno(anoEscolar, palavrasPorMinuto, pseudopalavrasLidas) {
    // Validar os parâmetros
    if (isNaN(palavrasPorMinuto) || isNaN(pseudopalavrasLidas) || palavrasPorMinuto < 0 || pseudopalavrasLidas < 0) {
        return {
            nivel: 0,
            descricao: "Não Avaliado",
            observacao: "Dados inválidos para classificação"
        };
    }

    // Definir as regras de acordo com o ano escolar
    let regras;
    
    if (anoEscolar >= 1 && anoEscolar <= 2) {
        // REGRAS PARA 1º AO 2º ANO (TABELA 1)
        regras = [
            { 
                nivel: 0, 
                descricao: "Não Avaliado", 
                palavrasMin: -1, 
                palavrasMax: -1, 
                pseudoMin: -1, 
                pseudoMax: -1,
                observacao: "Não lê nem tenta. Intervenção imediata."
            },
            { 
                nivel: 1, 
                descricao: "Não Leitor", 
                palavrasMin: 0, 
                palavrasMax: 10, 
                pseudoMin: 0, 
                pseudoMax: Number.MAX_SAFE_INTEGER,
                observacao: "Reconhece letras ou sílabas isoladas. Intervenção imediata."
            },
            { 
                nivel: 2, 
                descricao: "Leitor de Sílabas", 
                palavrasMin: 11, 
                palavrasMax: 25, 
                pseudoMin: 0, 
                pseudoMax: Number.MAX_SAFE_INTEGER,
                observacao: "Silabando ou errando muito. Em desenvolvimento."
            },
            { 
                nivel: 3, 
                descricao: "Leitor de Palavras", 
                palavrasMin: 26, 
                palavrasMax: 35, 
                pseudoMin: 7, 
                pseudoMax: 12,
                observacao: "Atenção à fluência."
            },
            { 
                nivel: 4, 
                descricao: "Leitor de Frases", 
                palavrasMin: 36, 
                palavrasMax: 44, 
                pseudoMin: 13, 
                pseudoMax: 18,
                observacao: "Ritmo comprometido."
            },
            { 
                nivel: 5, 
                descricao: "Leitor de Texto sem Fluência", 
                palavrasMin: 45, 
                palavrasMax: 59, 
                pseudoMin: 19, 
                pseudoMax: 24,
                observacao: "Leitura funcional."
            },
            { 
                nivel: 6, 
                descricao: "Leitor de Texto com Fluência", 
                palavrasMin: 60, 
                palavrasMax: Number.MAX_SAFE_INTEGER, 
                pseudoMin: 25, 
                pseudoMax: Number.MAX_SAFE_INTEGER,
                observacao: "Leitura fluente."
            }
        ];
    } else if (anoEscolar >= 3 && anoEscolar <= 5) {
        // REGRAS PARA 3º AO 5º ANO (TABELA 2)
        regras = [
            { 
                nivel: 0, 
                descricao: "Não Avaliado", 
                palavrasMin: -1, 
                palavrasMax: -1, 
                pseudoMin: -1, 
                pseudoMax: -1,
                observacao: "Não lê. Requer consciência fonológica."
            },
            { 
                nivel: 1, 
                descricao: "Não Leitor", 
                palavrasMin: 0, 
                palavrasMax: 20, 
                pseudoMin: 0, 
                pseudoMax: 4,
                observacao: "Avaliação encerra nesse ponto."
            },
            { 
                nivel: 2, 
                descricao: "Leitor de Sílabas", 
                palavrasMin: 21, 
                palavrasMax: 39, 
                pseudoMin: 0, 
                pseudoMax: 10,
                observacao: "Foco em decodificação."
            },
            { 
                nivel: 3, 
                descricao: "Leitor de Palavras", 
                palavrasMin: 40, 
                palavrasMax: 69, 
                pseudoMin: 11, 
                pseudoMax: 20,
                observacao: "Fluência emergente."
            },
            { 
                nivel: 4, 
                descricao: "Leitor de Frases", 
                palavrasMin: 70, 
                palavrasMax: 89, 
                pseudoMin: 21, 
                pseudoMax: 30,
                observacao: "Precisa ajustar entonação."
            },
            { 
                nivel: 5, 
                descricao: "Leitor de Texto sem Fluência", 
                palavrasMin: 90, 
                palavrasMax: 109, 
                pseudoMin: 31, 
                pseudoMax: 40,
                observacao: "Boa base."
            },
            { 
                nivel: 6, 
                descricao: "Leitor de Texto com Fluência", 
                palavrasMin: 110, 
                palavrasMax: Number.MAX_SAFE_INTEGER, 
                pseudoMin: 41, 
                pseudoMax: Number.MAX_SAFE_INTEGER,
                observacao: "Leitura fluente."
            }
        ];
    } else if (anoEscolar >= 6 && anoEscolar <= 9) {
        // REGRAS PARA 6º AO 9º ANO (TABELA 3)
        regras = [
            { 
                nivel: 0, 
                descricao: "Não Avaliado", 
                palavrasMin: -1, 
                palavrasMax: -1, 
                pseudoMin: -1, 
                pseudoMax: -1,
                observacao: "Não lê. Requer intervenção fonológica."
            },
            { 
                nivel: 1, 
                descricao: "Não Leitor", 
                palavrasMin: 0, 
                palavrasMax: 50, 
                pseudoMin: 0, 
                pseudoMax: 10,
                observacao: "Intervenção imediata."
            },
            { 
                nivel: 2, 
                descricao: "Leitor de Sílabas", 
                palavrasMin: 51, 
                palavrasMax: 80, 
                pseudoMin: 11, 
                pseudoMax: 20,
                observacao: "Foco em decodificação."
            },
            { 
                nivel: 3, 
                descricao: "Leitor de Palavras", 
                palavrasMin: 81, 
                palavrasMax: 110, 
                pseudoMin: 11, 
                pseudoMax: 20,
                observacao: "Leitura autônoma."
            },
            { 
                nivel: 4, 
                descricao: "Leitor de Frases", 
                palavrasMin: 111, 
                palavrasMax: 130, 
                pseudoMin: 21, 
                pseudoMax: 30,
                observacao: "Ritmo comprometido."
            },
            { 
                nivel: 5, 
                descricao: "Leitor de Texto sem Fluência", 
                palavrasMin: 131, 
                palavrasMax: 160, 
                pseudoMin: 31, 
                pseudoMax: 40,
                observacao: "Boa base."
            },
            { 
                nivel: 6, 
                descricao: "Leitor de Texto com Fluência", 
                palavrasMin: 161, 
                palavrasMax: Number.MAX_SAFE_INTEGER, 
                pseudoMin: 41, 
                pseudoMax: Number.MAX_SAFE_INTEGER,
                observacao: "Fluente."
            }
        ];
    } else {
        // Ano escolar inválido, usar a tabela para 3º-5º como padrão
        regras = [
            { nivel: 0, descricao: "Não Avaliado", palavrasMin: -1, palavrasMax: -1, pseudoMin: -1, pseudoMax: -1 },
            { nivel: 1, descricao: "Não Leitor", palavrasMin: 0, palavrasMax: 20, pseudoMin: 0, pseudoMax: 4 },
            { nivel: 2, descricao: "Leitor de Sílabas", palavrasMin: 21, palavrasMax: 39, pseudoMin: 0, pseudoMax: 10 },
            { nivel: 3, descricao: "Leitor de Palavras", palavrasMin: 40, palavrasMax: 69, pseudoMin: 11, pseudoMax: 20 },
            { nivel: 4, descricao: "Leitor de Frases", palavrasMin: 70, palavrasMax: 89, pseudoMin: 21, pseudoMax: 30 },
            { nivel: 5, descricao: "Leitor de Texto sem Fluência", palavrasMin: 90, palavrasMax: 109, pseudoMin: 31, pseudoMax: 40 },
            { nivel: 6, descricao: "Leitor de Texto com Fluência", palavrasMin: 110, palavrasMax: Number.MAX_SAFE_INTEGER, pseudoMin: 41, pseudoMax: Number.MAX_SAFE_INTEGER }
        ];
    }

    // Atribuir nível com base nas regras
    // Começamos com a classificação mais alta possível
    for (let i = regras.length - 1; i >= 0; i--) {
        const regra = regras[i];
        
        // Caso especial para "Não Avaliado"
        if (regra.nivel === 0 && (palavrasPorMinuto === 0 || palavrasPorMinuto === null)) {
            return {
                nivel: regra.nivel,
                descricao: regra.descricao,
                observacao: regra.observacao || ""
            };
        }
        
        // Verificar se os valores estão dentro dos limites da regra
        if (
            palavrasPorMinuto >= regra.palavrasMin && 
            palavrasPorMinuto <= regra.palavrasMax && 
            (pseudopalavrasLidas >= regra.pseudoMin || regra.pseudoMin === -1) && 
            (pseudopalavrasLidas <= regra.pseudoMax || regra.pseudoMax === -1)
        ) {
            return {
                nivel: regra.nivel,
                descricao: regra.descricao,
                observacao: regra.observacao || ""
            };
        }
    }

    // Se não encontrou uma classificação, retornar "Não Avaliado"
    return {
        nivel: 0,
        descricao: "Não Avaliado",
        observacao: "Não se encaixa em nenhum critério de classificação."
    };
}

// Gerar HTML para um item de avaliação na lista
function gerarHTMLItemAvaliacao(avaliacao) {
    return `
        <tr>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div>
                        <div class="text-sm font-medium text-gray-900">${avaliacao.id}</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${avaliacao.nome}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                ${formatarDataParaExibicao(avaliacao.data)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${avaliacao.status === 'Ativo' ? 'green' : 'red'}-100 text-${avaliacao.status === 'Ativo' ? 'green' : 'red'}-800">
                    ${avaliacao.status}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-center">
                ${avaliacao.alunos_avaliados}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-blue-600 hover:text-blue-900 mr-3 btn-editar-avaliacao" data-id="${avaliacao.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="text-red-600 hover:text-red-900 btn-excluir-avaliacao" data-id="${avaliacao.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `;
}

// Adicionar event listeners
function adicionarEventListeners() {
    // Adicionar evento para editar avaliação
    document.querySelectorAll('.btn-editar-avaliacao').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            editarAvaliacao(id);
        });
    });
    
    // Adicionar evento para excluir avaliação
    document.querySelectorAll('.btn-excluir-avaliacao').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            excluirAvaliacao(id);
        });
    });
}

// Inicializar a página
document.addEventListener('DOMContentLoaded', function() {
    carregarAvaliacoes();
    carregarEventos();
    
    // Configurar os event listeners
    configurarEventListeners();
});