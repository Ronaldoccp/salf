/**
 * Sistema de Avaliação de Leitura e Fluência (SALF)
 * Módulo de realização de avaliação de leitura
 * 
 * Este código gerencia todo o processo de avaliação de leitura,
 * desde a seleção do aluno até o registro dos resultados.
 */

(function() {
    'use strict';

    // ===================================================
    // INICIALIZAÇÃO E CONFIGURAÇÃO
    // ===================================================
    
    // Aguardar carregamento do DOM
    document.addEventListener('DOMContentLoaded', inicializar);

    // Objeto principal com as referências DOM
    const DOM = {};
    
    // Estado da aplicação
    const estado = {
        // Dados da avaliação atual
        aluno: null,
        avaliacao: null,
        faixaSerie: null,
        
        // Contadores
        palavrasLidas: 0,
        pseudopalavrasLidas: 0,
        frasesLidas: 0,
        linhasLidas: 0,
        respostasCorretas: 0,
        
        // Controle de timers
        timers: {
            palavras: null,
            pseudopalavras: null,
            frases: null,
            texto: null
        }
    };
    
    // Dados para simulação (em produção, viria de uma API)
    const DADOS = {
        escolas: [
            { id: 1, nome: "Escola Municipal João da Silva" },
            { id: 2, nome: "Escola Estadual Maria José" }
        ],
        
        turmas: [
            { id: 1, nome: "Turma A", serie: "1º Ano", escola_id: 1 },
            { id: 2, nome: "Turma B", serie: "2º Ano", escola_id: 1 },
            { id: 3, nome: "Turma C", serie: "1º Ano", escola_id: 2 },
            { id: 4, nome: "Turma D", serie: "3º Ano", escola_id: 2 }
        ],
        
        alunos: [
            { id: 1, nome: "Ana Silva", matricula: "12345", turma_id: 1 },
            { id: 2, nome: "Bruno Santos", matricula: "12346", turma_id: 1 },
            { id: 3, nome: "Carla Oliveira", matricula: "12347", turma_id: 2 },
            { id: 4, nome: "Daniel Pereira", matricula: "12348", turma_id: 3 },
            { id: 5, nome: "Eduarda Souza", matricula: "12349", turma_id: 4 }
        ],
        
        avaliacoes: [
            {
                id: 1,
                nome: "Avaliação 1º Semestre 2023",
                palavras: [
                    "casa", "bola", "gato", "mesa", "livro", "pato", "fogo", "roda", "vela", "mala",
                    "lobo", "rato", "sapo", "faca", "pipa", "dedo", "moto", "suco", "bota", "lua",
                    "pele", "cama", "papel", "terra", "água", "boca", "ponte", "porta", "rede", "sol",
                    "folha", "vento", "nuvem", "chuva", "praia", "vidro", "barco", "peixe", "rosa", "dente"
                ],
                pseudopalavras: [
                    "dalu", "fema", "pilo", "sati", "beco", "vota", "mipe", "catu", "lemi", "rano",
                    "bagi", "pute", "seco", "vilo", "fota", "zema", "neri", "joba", "tibe", "cuna",
                    "larpo", "bestu", "pilda", "vamil", "torpa", "sertu", "ganso", "finpo", "melfa", "darno"
                ],
                texto: "A menina de cabelos dourados caminhava pela floresta. Era uma linda manhã de primavera, e as flores coloridas enfeitavam o caminho. Ela carregava uma cesta com frutas frescas para sua avó. O sol brilhava entre as folhas das árvores, criando sombras dançantes no chão. Enquanto andava, a menina cantarolava uma doce melodia que sua mãe lhe ensinou. Os pássaros, encantados com a canção, acompanhavam com seus trinados. De repente, ela encontrou um pequeno coelho branco parado no meio da trilha. Seus olhos eram vermelhos como rubis e suas orelhas compridas tremiam levemente. A menina sorriu e ofereceu uma cenoura da sua cesta. O coelho hesitou por um momento, mas logo aceitou o presente, pegando a cenoura com suas patas dianteiras. Agradecido, ele saltitou ao lado da menina por um tempo, como se quisesse fazer companhia. Mais adiante, encontraram um riacho de águas cristalinas. A menina parou para beber um pouco de água fresca e descansar sob a sombra de um grande carvalho.",
                frases: [
                    "O menino corre no parque.",
                    "A menina gosta de sorvete.",
                    "O gato subiu na árvore.",
                    "Minha mãe fez um bolo gostoso.",
                    "O cachorro late para o carteiro.",
                    "As crianças brincam na escola.",
                    "O sol brilha no céu azul.",
                    "Eu gosto de ler livros de aventura.",
                    "Meu pai dirige um carro vermelho.",
                    "A professora ensina matemática."
                ],
                questoes: [
                    {
                        pergunta: "Qual é o personagem principal do texto?",
                        opcoes: ["Uma menina", "Um menino", "Um animal", "Um adulto"],
                        respostaCorreta: 0
                    },
                    {
                        pergunta: "Onde se passa a história?",
                        opcoes: ["Na floresta", "Na praia", "Na cidade", "Na escola"],
                        respostaCorreta: 0
                    },
                    {
                        pergunta: "O que o personagem principal estava fazendo?",
                        opcoes: ["Dormindo", "Estudando", "Caminhando", "Nadando"],
                        respostaCorreta: 2
                    },
                    {
                        pergunta: "Qual animal aparece na história?",
                        opcoes: ["Gato", "Cachorro", "Coelho", "Pássaro"],
                        respostaCorreta: 2
                    },
                    {
                        pergunta: "O que o personagem principal carregava?",
                        opcoes: ["Uma mochila", "Um livro", "Uma cesta", "Um brinquedo"],
                        respostaCorreta: 2
                    }
                ]
            },
            {
                id: 2,
                nome: "Avaliação 2º Semestre 2023",
                palavras: [
                    "pão", "dia", "chá", "rio", "céu", "lua", "mar", "pé", "sal", "rei",
                    "anel", "doce", "faca", "gelo", "ilha", "jogo", "kiwi", "leão", "maçã", "navio",
                    "ovo", "pato", "queijo", "rato", "sapo", "tatu", "uva", "vaca", "xadrez", "zebra",
                    "azul", "bolo", "casa", "dado", "escola", "festa", "gato", "hora", "igreja", "janela"
                ],
                pseudopalavras: [
                    "pimo", "lema", "zatu", "fepo", "daje", "bilu", "rona", "sabe", "voti", "mulo",
                    "tabe", "pori", "lute", "gami", "sedo", "nafu", "bive", "zumi", "falo", "rupe",
                    "terpa", "nilsa", "ranco", "melfi", "sotor", "galda", "pefti", "vunde", "zerbo", "caqui"
                ],
                texto: "O pequeno Pedro adorava brincar no parque perto de sua casa. Todos os dias, depois da escola, ele corria para lá, ansioso para encontrar seus amigos. No centro do parque havia um grande carrossel colorido, com cavalos, elefantes e até mesmo dragões. Era a atração favorita das crianças. Ao lado do carrossel, ficava um lago onde nadavam patos e cisnes brancos. Pedro sempre levava pedaços de pão para alimentá-los, observando como mergulhavam em busca das migalhas. Havia também um campo de futebol onde os meninos organizavam partidas animadas. Pedro era um bom goleiro e defendia muitas bolas difíceis. Seus amigos sempre o escolhiam primeiro quando formavam os times. No canto mais tranquilo do parque, existia uma pequena biblioteca ao ar livre. Estantes protegidas da chuva guardavam livros de histórias que as crianças podiam ler sentadas nos bancos de madeira. Pedro às vezes gostava de passar ali algumas horas, mergulhado em aventuras fantásticas.",
                frases: [
                    "O menino corre no parque.",
                    "A menina gosta de sorvete.",
                    "O gato subiu na árvore.",
                    "Minha mãe fez um bolo gostoso.",
                    "O cachorro late para o carteiro.",
                    "As crianças brincam na escola.",
                    "O sol brilha no céu azul.",
                    "Eu gosto de ler livros de aventura.",
                    "Meu pai dirige um carro vermelho.",
                    "A professora ensina matemática."
                ],
                questoes: [
                    {
                        pergunta: "Qual é o personagem principal do texto?",
                        opcoes: ["Uma menina", "Um menino", "Um animal", "Um adulto"],
                        respostaCorreta: 1
                    },
                    {
                        pergunta: "Onde se passa a história?",
                        opcoes: ["Na floresta", "No parque", "Na cidade", "Na escola"],
                        respostaCorreta: 1
                    },
                    {
                        pergunta: "O que o personagem principal estava fazendo?",
                        opcoes: ["Dormindo", "Estudando", "Brincando", "Nadando"],
                        respostaCorreta: 2
                    },
                    {
                        pergunta: "Qual animal aparece na história?",
                        opcoes: ["Gato", "Cachorro", "Pato", "Pássaro"],
                        respostaCorreta: 2
                    },
                    {
                        pergunta: "O que o personagem principal carregava?",
                        opcoes: ["Uma mochila", "Brinquedos", "Pedaços de pão", "Um livro"],
                        respostaCorreta: 2
                    }
                ]
            }
        ]
    };
    
    // ===================================================
    // FUNÇÕES DE INICIALIZAÇÃO
    // ===================================================
    
    /**
     * Inicializa a aplicação
     */
    async function inicializar() {
        console.log('Inicializando aplicação de avaliação de leitura...');
        
        // Obter referências aos elementos do DOM
        obterReferenciasDOM();
        
        // Verificar se elementos críticos foram encontrados
        if (!verificarElementosEssenciais()) {
            return;
        }
        
        // Configurar os eventos
        configurarEventos();
        
        // Carregar os dados iniciais
        await carregarDadosIniciais();
        
        console.log('Aplicação de avaliação de leitura inicializada com sucesso!');
    }
    
    /**
     * Obtém referências para os elementos da DOM
     * @returns {Object} Objeto contendo referências para os elementos
     */
    function obterReferenciasDOM() {
        // Containers de etapas
        DOM.containers = {
            selecaoAluno: document.getElementById('selecao-aluno'),
            etapaPalavras: document.getElementById('etapa-palavras'),
            etapaPseudopalavras: document.getElementById('etapa-pseudopalavras'),
            etapaFrases: document.getElementById('etapa-frases'),
            etapaTexto: document.getElementById('etapa-texto'),
            etapaInterpretacao: document.getElementById('etapa-interpretacao'),
            etapaResultado: document.getElementById('etapa-resultado')
        };
        
        // Seletores de dados
        DOM.selects = {
            evento: document.getElementById('evento-avaliacao'),
            escola: document.getElementById('escola-aluno'),
            turma: document.getElementById('turma-aluno'),
            aluno: document.getElementById('aluno')
        };
        
        // Botões de navegação
        DOM.navegacao = {
            iniciarAvaliacao: document.getElementById('iniciar-avaliacao'),
            depuracaoTurmas: document.getElementById('btn-debug-carregar-turmas'),
            proximoEtapaPalavras: document.getElementById('proximo-etapa-palavras'),
            proximoEtapaPseudopalavras: document.getElementById('proximo-etapa-pseudopalavras'),
            proximoEtapaFrases: document.getElementById('proximo-etapa-frases'),
            proximoEtapaTexto: document.getElementById('proximo-etapa-texto'),
            finalizarAvaliacao: document.getElementById('finalizar-avaliacao'),
            salvarAvaliacao: document.getElementById('salvar-avaliacao')
        };
        
        // Timers e controles de tempo
        DOM.timers = {
            palavras: document.getElementById('timer-palavras'),
            pseudopalavras: document.getElementById('timer-pseudopalavras'),
            frases: document.getElementById('timer-frases'),
            texto: document.getElementById('timer-texto'),
            iniciarPalavras: document.getElementById('iniciar-timer-palavras'),
            iniciarPseudopalavras: document.getElementById('iniciar-timer-pseudopalavras'),
            iniciarFrases: document.getElementById('iniciar-timer-frases'),
            iniciarTexto: document.getElementById('iniciar-timer-texto')
        };
        
        // Contadores
        DOM.contadores = {
            palavrasLidas: document.getElementById('total-palavras-lidas'),
            totalPalavras: document.getElementById('total-palavras'),
            pseudopalavrasLidas: document.getElementById('total-pseudopalavras-lidas'),
            totalPseudopalavras: document.getElementById('total-pseudopalavras'),
            frasesLidas: document.getElementById('total-frases-lidas'),
            totalFrases: document.getElementById('total-frases'),
            linhasLidas: document.getElementById('total-linhas-lidas'),
            totalLinhas: document.getElementById('total-linhas'),
            respostasCorretas: document.getElementById('total-respostas-corretas'),
            totalQuestoes: document.getElementById('total-questoes')
        };
        
        // Containers de conteúdo
        DOM.conteudo = {
            palavras: DOM.containers.etapaPalavras.querySelector('.grid'),
            pseudopalavras: DOM.containers.etapaPseudopalavras.querySelector('.grid'),
            frases: document.getElementById('frases-container'),
            texto: document.getElementById('texto-container'),
            questoes: document.getElementById('questoes-container')
        };
        
        // Elementos dos resultados
        DOM.resultados = {
            mostrarResultados: document.getElementById('mostrar-resultados'),
            nivelLeitor: document.getElementById('nivel-leitor-sugerido'),
            descricaoNivel: document.getElementById('descricao-nivel'),
            progresso: document.getElementById('nivel-progresso'),
            observacoes: document.getElementById('nivel-observacao'),
            regras: document.getElementById('info-regras-serie')
        };
        
        // Criar ou obter um container para as regras de avaliação
        let regrasContainer = document.getElementById('regras-avaliacao-container');
        if (!regrasContainer) {
            // Criar o container se não existir
            regrasContainer = document.createElement('div');
            regrasContainer.id = 'regras-avaliacao-container';
            regrasContainer.className = 'bg-white rounded-lg shadow-md p-4 mt-4 hidden';
            
            // Adicionar na página, logo após o container de seleção de aluno
            if (DOM.containers.selecaoAluno) {
                DOM.containers.selecaoAluno.parentNode.insertBefore(regrasContainer, DOM.containers.selecaoAluno.nextSibling);
            }
        }
        
        // Adicionar referências para os elementos de regras
        DOM.regras = {
            container: regrasContainer
        };
    }
    
    /**
     * Verifica se os elementos essenciais foram encontrados no DOM
     * @returns {boolean} Verdadeiro se todos os elementos essenciais foram encontrados
     */
    function verificarElementosEssenciais() {
        // Verificar se os elementos essenciais foram encontrados
        if (!DOM.selects.escola) {
            console.error("ERRO CRÍTICO: Elemento 'escola-aluno' não encontrado na página!");
            alert("Erro: O formulário não pode ser inicializado corretamente. Por favor, recarregue a página.");
            return false;
        }
        
        if (!DOM.selects.turma) {
            console.error("ERRO CRÍTICO: Elemento 'turma-aluno' não encontrado na página!");
            alert("Erro: O formulário não pode ser inicializado corretamente. Por favor, recarregue a página.");
            return false;
        }
        
        return true;
    }
    
    /**
     * Configura os eventos da aplicação
     */
    function configurarEventos() {
        // Eventos para os selects
        DOM.selects.escola.addEventListener('change', async () => await carregarTurmas());
        DOM.selects.turma.addEventListener('change', async () => await carregarAlunos());
        
        // Eventos de navegação
        DOM.navegacao.iniciarAvaliacao.addEventListener('click', iniciarAvaliacao);
        DOM.navegacao.proximoEtapaPalavras.addEventListener('click', () => mudarEtapa('palavras', 'pseudopalavras'));
        DOM.navegacao.proximoEtapaPseudopalavras.addEventListener('click', () => mudarEtapa('pseudopalavras', 'frases'));
        DOM.navegacao.proximoEtapaFrases.addEventListener('click', () => mudarEtapa('frases', 'texto'));
        DOM.navegacao.proximoEtapaTexto.addEventListener('click', () => mudarEtapa('texto', 'interpretacao'));
        DOM.navegacao.finalizarAvaliacao.addEventListener('click', finalizarAvaliacao);
        DOM.navegacao.salvarAvaliacao.addEventListener('click', salvarAvaliacao);
        
        // Eventos de timer
        DOM.timers.iniciarPalavras.addEventListener('click', () => iniciarTimer('palavras'));
        DOM.timers.iniciarPseudopalavras.addEventListener('click', () => iniciarTimer('pseudopalavras'));
        DOM.timers.iniciarFrases.addEventListener('click', () => iniciarTimer('frases'));
        DOM.timers.iniciarTexto.addEventListener('click', () => iniciarTimer('texto'));
        
        // Botão de depuração para carregamento de turmas
        if (DOM.navegacao.depuracaoTurmas) {
            DOM.navegacao.depuracaoTurmas.addEventListener('click', carregarTurmasManualmente);
        }
    }
    
    /**
     * Carrega os dados iniciais
     */
    async function carregarDadosIniciais() {
        await carregarEscolas();
    }

    // ===================================================
    // FUNÇÕES DE CARREGAMENTO DE DADOS
    // ===================================================
    
    /**
     * Carrega as escolas no select
     */
    async function carregarEscolas() {
        try {
            // Limpar o select
            DOM.selects.escola.innerHTML = '<option value="">Selecione uma escola</option>';
            
            // Carregar as escolas da API
            const escolas = await API.escolas.listar();
            
            // Armazenar as escolas no DADOS para uso posterior
            DADOS.escolas = escolas;
            
            // Adicionar as escolas como opções
            escolas.forEach(escola => {
                const option = document.createElement('option');
                option.value = escola.id;
                option.textContent = escola.nome;
                DOM.selects.escola.appendChild(option);
            });
            
            console.log(`Escolas carregadas: ${escolas.length}`);
        } catch (error) {
            console.error('Erro ao carregar escolas:', error);
            mostrarErro('Não foi possível carregar as escolas. Por favor, recarregue a página.');
        }
    }
    
    /**
     * Carrega as turmas de uma escola no select
     */
    async function carregarTurmas() {
        try {
            // Obter ID da escola selecionada
            const escolaId = parseInt(DOM.selects.escola.value);
            
            // Limpar os selects dependentes
            DOM.selects.turma.innerHTML = '<option value="">Selecione uma turma</option>';
            DOM.selects.aluno.innerHTML = '<option value="">Selecione um aluno</option>';
            
            // Se não houver escola selecionada, não continuar
            if (isNaN(escolaId) || escolaId <= 0) {
                console.log('Nenhuma escola selecionada');
                return;
            }
            
            console.log(`Carregando turmas para a escola ID: ${escolaId}`);
            
            // Buscar a escola com suas turmas
            const escolaDetalhes = await API.escolas.buscarPorId(escolaId);
            
            // Verificar se temos turmas na resposta
            if (!escolaDetalhes || !escolaDetalhes.turmas || escolaDetalhes.turmas.length === 0) {
                console.log('Nenhuma turma encontrada para a escola selecionada');
                const option = document.createElement('option');
                option.value = "";
                option.textContent = "Nenhuma turma encontrada";
                DOM.selects.turma.appendChild(option);
                return;
            }
            
            // Armazenar as turmas da escola selecionada
            const turmasFiltradas = escolaDetalhes.turmas;
            
            // Atualizar DADOS.turmas para uso posterior
            DADOS.turmas = DADOS.turmas || [];
            turmasFiltradas.forEach(turma => {
                // Verificar se já existe no array
                const existente = DADOS.turmas.findIndex(t => t.id === turma.id);
                if (existente >= 0) {
                    DADOS.turmas[existente] = turma;
                } else {
                    DADOS.turmas.push(turma);
                }
            });
            
            // Adicionar cada turma como opção
            turmasFiltradas.forEach(turma => {
                const option = document.createElement('option');
                option.value = turma.id;
                option.textContent = `${turma.nome} (${turma.serie})`;
                DOM.selects.turma.appendChild(option);
            });
            
            console.log(`Turmas carregadas: ${turmasFiltradas.length}`);
        } catch (error) {
            console.error('Erro ao carregar turmas:', error);
            mostrarErro('Ocorreu um erro ao carregar as turmas.');
        }
    }
    
    /**
     * Carrega os alunos de uma turma no select
     */
    async function carregarAlunos() {
        try {
            // Obter ID da turma selecionada
            const turmaId = parseInt(DOM.selects.turma.value);
            
            // Limpar o select de alunos
            DOM.selects.aluno.innerHTML = '<option value="">Selecione um aluno</option>';
            
            // Se não houver turma selecionada, não continuar
            if (isNaN(turmaId) || turmaId <= 0) {
                console.log('Nenhuma turma selecionada');
                return;
            }
            
            console.log(`Carregando alunos para a turma ID: ${turmaId}`);
            
            // Determinar a faixa de série com base na turma selecionada
            const turmaSelecionada = DADOS.turmas.find(turma => turma.id === turmaId);
            if (turmaSelecionada) {
                determinarFaixaSerie(turmaSelecionada.serie);
            }
            
            // Buscar alunos da turma pela API
            const alunos = await API.turmas.buscarAlunosDaTurma(turmaId);
            
            // Verificar se temos alunos na resposta
            if (!alunos || alunos.length === 0) {
                const option = document.createElement('option');
                option.value = "";
                option.textContent = "Nenhum aluno encontrado";
                DOM.selects.aluno.appendChild(option);
                console.log('Nenhum aluno encontrado para a turma selecionada');
                return;
            }
            
            // Armazenar os alunos no DADOS para uso posterior
            DADOS.alunos = DADOS.alunos || [];
            alunos.forEach(aluno => {
                // Adicionar ou atualizar o aluno no array
                const existente = DADOS.alunos.findIndex(a => a.id === aluno.id);
                if (existente >= 0) {
                    DADOS.alunos[existente] = aluno;
                } else {
                    DADOS.alunos.push(aluno);
                }
            });
            
            // Adicionar cada aluno como opção
            alunos.forEach(aluno => {
                const option = document.createElement('option');
                option.value = aluno.id;
                option.textContent = `${aluno.nome} (${aluno.matricula})`;
                DOM.selects.aluno.appendChild(option);
            });
            
            console.log(`Alunos carregados: ${alunos.length}`);
        } catch (error) {
            console.error('Erro ao carregar alunos:', error);
            mostrarErro('Ocorreu um erro ao carregar os alunos.');
        }
    }
    
    /**
     * Método alternativo para carregar turmas (chamado pelo botão de debug)
     */
    function carregarTurmasManualmente() {
        try {
            // Obter ID da escola selecionada
            const escolaId = parseInt(DOM.selects.escola.value);
            
            // Validar seleção
            if (isNaN(escolaId) || escolaId <= 0) {
                mostrarErro('Por favor, selecione uma escola primeiro.');
                return;
            }
            
            console.log(`Carregando turmas manualmente para a escola ID: ${escolaId}`);
            
            // Limpar selects
            DOM.selects.turma.innerHTML = '<option value="">Selecione uma turma</option>';
            DOM.selects.aluno.innerHTML = '<option value="">Selecione um aluno</option>';
            
            // Filtrar turmas
            const turmasFiltradas = DADOS.turmas.filter(turma => turma.escola_id === escolaId);
            
            // Adicionar cada turma como opção
            turmasFiltradas.forEach(turma => {
                const option = document.createElement('option');
                option.value = turma.id;
                option.textContent = `${turma.nome} (${turma.serie})`;
                DOM.selects.turma.appendChild(option);
            });
            
            // Mostrar mensagem de feedback
            mostrarMensagem(`Foram carregadas ${turmasFiltradas.length} turmas para esta escola.`);
        } catch (error) {
            console.error('Erro ao carregar turmas manualmente:', error);
            mostrarErro('Erro ao carregar turmas: ' + error.message);
        }
    }
    
    // ===================================================
    // FUNÇÕES DE PREPARAÇÃO E INÍCIO DA AVALIAÇÃO
    // ===================================================
    
    /**
     * Inicia uma nova avaliação com o aluno e evento selecionados
     */
    function iniciarAvaliacao() {
        try {
            // Obter IDs do evento e aluno selecionados
            const eventoId = parseInt(DOM.selects.evento.value);
            const alunoId = parseInt(DOM.selects.aluno.value);
            
            // Validar seleções
            if (isNaN(eventoId) || eventoId <= 0 || isNaN(alunoId) || alunoId <= 0) {
                mostrarErro('Por favor, selecione um evento de avaliação e um aluno.');
                return;
            }
            
            console.log(`Iniciando avaliação - Evento ID: ${eventoId}, Aluno ID: ${alunoId}`);
            
            // Obter dados da avaliação e do aluno
            estado.avaliacao = DADOS.avaliacoes.find(a => a.id === eventoId);
            estado.aluno = DADOS.alunos.find(a => a.id === alunoId);
            
            // Validar dados obtidos
            if (!estado.avaliacao || !estado.aluno) {
                mostrarErro('Erro ao carregar os dados da avaliação.');
                return;
            }
            
            // Verificar a faixa de série do aluno
            const turmaAluno = DADOS.turmas.find(t => t.id === estado.aluno.turma_id);
            if (turmaAluno) {
                determinarFaixaSerie(turmaAluno.serie);
            }
            
            // Preparar a primeira etapa da avaliação
            prepararEtapaPalavras();
            
            // Mostrar a etapa de palavras
            exibirEtapa('palavras');
            
            console.log('Avaliação iniciada com sucesso');
        } catch (error) {
            console.error('Erro ao iniciar avaliação:', error);
            mostrarErro('Não foi possível iniciar a avaliação. Por favor, tente novamente.');
        }
    }
    
    /**
     * Determina a faixa de série do aluno
     * @param {string} serie - Série escolar do aluno
     */
    function determinarFaixaSerie(serie) {
        try {
            // Extrair o número da série
            const match = serie.match(/\d+/);
            let numeroSerie = 1; // valor padrão
            
            if (match && match[0]) {
                numeroSerie = parseInt(match[0]);
                console.log(`Número da série extraído: ${numeroSerie}`);
            } else {
                console.warn(`Não foi possível extrair o número da série: ${serie}`);
            }
            
            // Determinar a faixa de série
            if (numeroSerie <= 2) {
                estado.faixaSerie = "1-2";
            } else if (numeroSerie <= 5) {
                estado.faixaSerie = "3-5";
            } else {
                estado.faixaSerie = "6-9";
            }
            
            console.log(`Faixa de série determinada: ${estado.faixaSerie} (Série: ${serie})`);
            
            // Aplicar regras específicas baseadas na faixa de série
            aplicarRegrasAvaliacao(estado.faixaSerie);
        } catch (error) {
            console.error('Erro ao determinar faixa de série:', error);
            estado.faixaSerie = "1-2"; // valor padrão em caso de erro
        }
    }
    
    /**
     * Aplica regras de avaliação específicas de acordo com a faixa de série
     * @param {string} faixaSerie - Faixa de série (1-2, 3-5 ou 6-9)
     */
    function aplicarRegrasAvaliacao(faixaSerie) {
        try {
            console.log(`Aplicando regras específicas para a faixa de série: ${faixaSerie}`);
            
            // Definir metas e limites com base na faixa de série
            if (faixaSerie === "1-2") {
                // Regras para 1º e 2º anos
                estado.regras = {
                    tempoLeitura: 60, // segundos
                    palavrasPorMinutoMinimo: {
                        naoLeitor: 0,
                        maxNaoLeitor: 10,
                        leitorSilabas: 11,
                        maxLeitorSilabas: 25,
                        leitorPalavras: 26,
                        maxLeitorPalavras: 35,
                        leitorFrases: 36,
                        maxLeitorFrases: 44,
                        leitorTextoSemFluencia: 45,
                        maxLeitorTextoSemFluencia: 59,
                        leitorTextoComFluencia: 60
                    },
                    pseudopalavrasMinimo: {
                        naoLeitor: 0,
                        leitorSilabas: 0,
                        leitorPalavras: 7,
                        maxLeitorPalavras: 12,
                        leitorFrases: 13,
                        maxLeitorFrases: 18,
                        leitorTextoSemFluencia: 19,
                        maxLeitorTextoSemFluencia: 24,
                        leitorTextoComFluencia: 25
                    },
                    finalizarSeNaoLeitor: true,
                    finalizarSeLeitorSilabas: true,
                    mensagens: {
                        naoLeitor: "Intervenção imediata necessária: o aluno está classificado como Não Leitor.",
                        leitorSilabas: "Foco em decodificação: o aluno está classificado como Leitor de Sílabas."
                    }
                };
            } else if (faixaSerie === "3-5") {
                // Regras para 3º ao 5º anos
                estado.regras = {
                    tempoLeitura: 60, // segundos
                    palavrasPorMinutoMinimo: {
                        naoLeitor: 0,
                        maxNaoLeitor: 20,
                        leitorSilabas: 21,
                        maxLeitorSilabas: 39,
                        leitorPalavras: 40,
                        maxLeitorPalavras: 69,
                        leitorFrases: 70,
                        maxLeitorFrases: 89,
                        leitorTextoSemFluencia: 90,
                        maxLeitorTextoSemFluencia: 109,
                        leitorTextoComFluencia: 110
                    },
                    pseudopalavrasMinimo: {
                        naoLeitor: 0,
                        maxNaoLeitor: 4,
                        leitorSilabas: 0,
                        maxLeitorSilabas: 10,
                        leitorPalavras: 11,
                        maxLeitorPalavras: 20,
                        leitorFrases: 21,
                        maxLeitorFrases: 30,
                        leitorTextoSemFluencia: 31,
                        maxLeitorTextoSemFluencia: 40,
                        leitorTextoComFluencia: 41
                    },
                    finalizarSeNaoLeitor: true,
                    finalizarSeLeitorSilabas: false,
                    mensagens: {
                        naoLeitor: "Intervenção urgente necessária: o aluno está classificado como Não Leitor.",
                        leitorSilabas: "Foco em decodificação: o aluno está classificado como Leitor de Sílabas."
                    }
                };
            } else { // 6-9
                // Regras para 6º ao 9º anos
                estado.regras = {
                    tempoLeitura: 60, // segundos
                    palavrasPorMinutoMinimo: {
                        naoLeitor: 0,
                        maxNaoLeitor: 50,
                        leitorSilabas: 51,
                        maxLeitorSilabas: 80,
                        leitorPalavras: 81,
                        maxLeitorPalavras: 110,
                        leitorFrases: 111,
                        maxLeitorFrases: 130,
                        leitorTextoSemFluencia: 131,
                        maxLeitorTextoSemFluencia: 160,
                        leitorTextoComFluencia: 161
                    },
                    pseudopalavrasMinimo: {
                        naoLeitor: 0,
                        maxNaoLeitor: 10,
                        leitorSilabas: 11,
                        maxLeitorSilabas: 20,
                        leitorPalavras: 11,
                        maxLeitorPalavras: 20,
                        leitorFrases: 21,
                        maxLeitorFrases: 30,
                        leitorTextoSemFluencia: 31,
                        maxLeitorTextoSemFluencia: 40,
                        leitorTextoComFluencia: 41
                    },
                    finalizarSeNaoLeitor: true,
                    finalizarSeLeitorSilabas: false,
                    mensagens: {
                        naoLeitor: "Intervenção especializada necessária: o aluno está classificado como Não Leitor.",
                        leitorSilabas: "Foco em decodificação e fluência: o aluno está classificado como Leitor de Sílabas."
                    }
                };
            }
            
            console.log("Regras de avaliação aplicadas:", estado.regras);
            
            // Atualizar interface para refletir as regras
            atualizarInterfaceComRegras();
        } catch (error) {
            console.error('Erro ao aplicar regras de avaliação:', error);
            mostrarErro('Ocorreu um erro ao aplicar as regras de avaliação específicas para a série.');
        }
    }
    
    /**
     * Atualiza a interface com as regras específicas da faixa de série
     */
    function atualizarInterfaceComRegras() {
        try {
            // Verificar se os elementos da DOM estão disponíveis
            if (!DOM.regras || !DOM.regras.container) {
                console.warn('Elementos de regras não encontrados na interface');
                return;
            }
            
            // Limpar o container de regras
            DOM.regras.container.innerHTML = '';
            
            // Criar tabela de regras
            const tabelaRegras = document.createElement('div');
            tabelaRegras.className = 'mt-4 border rounded-lg overflow-hidden';
            
            // Determinar faixa de série para exibição
            const faixaSerieExibicao = estado.faixaSerie === "1-2" ? "1º e 2º anos" : 
                                      estado.faixaSerie === "3-5" ? "3º ao 5º anos" : 
                                      "6º ao 9º anos";
            
            // Construir o cabeçalho da tabela
            tabelaRegras.innerHTML = `
                <div class="bg-blue-600 text-white p-3 text-center font-semibold">
                    Regras de Avaliação para ${faixaSerieExibicao}
                </div>
                <div class="grid grid-cols-4 bg-gray-100 border-b">
                    <div class="p-2 font-medium text-gray-700 border-r">Nível</div>
                    <div class="p-2 font-medium text-gray-700 border-r">Palavras por Minuto</div>
                    <div class="p-2 font-medium text-gray-700 border-r">Pseudopalavras</div>
                    <div class="p-2 font-medium text-gray-700">Avaliação</div>
                </div>
            `;
            
            // Adicionar linhas para cada nível
            const niveisInfo = [
                { nome: "Não Leitor", nivel: 1, classe: "bg-red-100" },
                { nome: "Leitor de Sílabas", nivel: 2, classe: "bg-orange-100" },
                { nome: "Leitor de Palavras", nivel: 3, classe: "bg-yellow-100" },
                { nome: "Leitor de Frases", nivel: 4, classe: "bg-green-100" },
                { nome: "Leitor de Texto sem Fluência", nivel: 5, classe: "bg-blue-100" },
                { nome: "Leitor de Texto com Fluência", nivel: 6, classe: "bg-indigo-100" }
            ];
            
            niveisInfo.forEach(info => {
                let ppmMin, ppmMax, pseudoMin, pseudoMax, avaliacao;
                
                switch (info.nivel) {
                    case 1: // Não Leitor
                        ppmMin = estado.regras.palavrasPorMinutoMinimo.naoLeitor;
                        ppmMax = estado.regras.palavrasPorMinutoMinimo.maxNaoLeitor;
                        pseudoMin = estado.regras.pseudopalavrasMinimo.naoLeitor;
                        pseudoMax = estado.regras.pseudopalavrasMinimo.maxNaoLeitor || "Qualquer";
                        avaliacao = estado.regras.finalizarSeNaoLeitor ? "Finalizar avaliação" : "Continuar";
                        break;
                    case 2: // Leitor de Sílabas
                        ppmMin = estado.regras.palavrasPorMinutoMinimo.leitorSilabas;
                        ppmMax = estado.regras.palavrasPorMinutoMinimo.maxLeitorSilabas;
                        pseudoMin = estado.regras.pseudopalavrasMinimo.leitorSilabas;
                        pseudoMax = estado.regras.pseudopalavrasMinimo.maxLeitorSilabas || "Qualquer";
                        avaliacao = estado.regras.finalizarSeLeitorSilabas ? "Finalizar avaliação" : "Continuar";
                        break;
                    case 3: // Leitor de Palavras
                        ppmMin = estado.regras.palavrasPorMinutoMinimo.leitorPalavras;
                        ppmMax = estado.regras.palavrasPorMinutoMinimo.maxLeitorPalavras;
                        pseudoMin = estado.regras.pseudopalavrasMinimo.leitorPalavras;
                        pseudoMax = estado.regras.pseudopalavrasMinimo.maxLeitorPalavras;
                        avaliacao = "Todas as etapas";
                        break;
                    case 4: // Leitor de Frases
                        ppmMin = estado.regras.palavrasPorMinutoMinimo.leitorFrases;
                        ppmMax = estado.regras.palavrasPorMinutoMinimo.maxLeitorFrases;
                        pseudoMin = estado.regras.pseudopalavrasMinimo.leitorFrases;
                        pseudoMax = estado.regras.pseudopalavrasMinimo.maxLeitorFrases;
                        avaliacao = "Todas as etapas";
                        break;
                    case 5: // Leitor de Texto sem Fluência
                        ppmMin = estado.regras.palavrasPorMinutoMinimo.leitorTextoSemFluencia;
                        ppmMax = estado.regras.palavrasPorMinutoMinimo.maxLeitorTextoSemFluencia;
                        pseudoMin = estado.regras.pseudopalavrasMinimo.leitorTextoSemFluencia;
                        pseudoMax = estado.regras.pseudopalavrasMinimo.maxLeitorTextoSemFluencia;
                        avaliacao = "Todas as etapas";
                        break;
                    case 6: // Leitor de Texto com Fluência
                        ppmMin = estado.regras.palavrasPorMinutoMinimo.leitorTextoComFluencia;
                        ppmMax = "Acima";
                        pseudoMin = estado.regras.pseudopalavrasMinimo.leitorTextoComFluencia;
                        pseudoMax = "Acima";
                        avaliacao = "Todas as etapas";
                        break;
                }
                
                const linha = document.createElement('div');
                linha.className = `grid grid-cols-4 border-b ${info.classe}`;
                linha.innerHTML = `
                    <div class="p-2 font-medium border-r">${info.nome}</div>
                    <div class="p-2 border-r">${ppmMin} - ${ppmMax}</div>
                    <div class="p-2 border-r">${pseudoMin} - ${pseudoMax}</div>
                    <div class="p-2">${avaliacao}</div>
                `;
                
                tabelaRegras.appendChild(linha);
            });
            
            // Adicionar ao container
            DOM.regras.container.appendChild(tabelaRegras);
            
            // Adicionar informações sobre aplicação
            const infoAplicacao = document.createElement('div');
            infoAplicacao.className = 'mt-4 p-4 bg-yellow-50 border border-yellow-300 rounded-lg';
            infoAplicacao.innerHTML = `
                <h3 class="font-semibold text-gray-800 mb-2">Informações sobre a aplicação:</h3>
                <ul class="list-disc pl-5 text-sm text-gray-700">
                    <li>A avaliação será aplicada de acordo com as regras específicas para ${faixaSerieExibicao}.</li>
                    <li>O tempo para cada etapa é de ${estado.regras.tempoLeitura} segundos.</li>
                    <li>Caso o aluno seja classificado como "Não Leitor", ${estado.regras.finalizarSeNaoLeitor ? 'a avaliação será finalizada automaticamente.' : 'prossiga com as demais etapas, mas registre a observação.'}</li>
                    <li>Caso o aluno seja classificado como "Leitor de Sílabas", ${estado.regras.finalizarSeLeitorSilabas ? 'a avaliação será finalizada automaticamente.' : 'continue com a avaliação completa.'}</li>
                </ul>
            `;
            
            DOM.regras.container.appendChild(infoAplicacao);
            
            // Mostrar o container de regras
            DOM.regras.container.classList.remove('hidden');
            
            console.log('Interface atualizada com regras específicas');
        } catch (error) {
            console.error('Erro ao atualizar interface com regras:', error);
        }
    }
    
    /**
     * Exibe uma etapa específica e esconde as demais
     * @param {string} etapa - Nome da etapa a ser exibida
     */
    function exibirEtapa(etapa) {
        // Esconder todas as etapas
        Object.values(DOM.containers).forEach(container => {
            container.classList.add('hidden');
        });
        
        // Exibir a etapa solicitada
        switch (etapa) {
            case 'selecaoAluno':
                DOM.containers.selecaoAluno.classList.remove('hidden');
                break;
            case 'palavras':
                DOM.containers.etapaPalavras.classList.remove('hidden');
                break;
            case 'pseudopalavras':
                DOM.containers.etapaPseudopalavras.classList.remove('hidden');
                break;
            case 'frases':
                DOM.containers.etapaFrases.classList.remove('hidden');
                break;
            case 'texto':
                DOM.containers.etapaTexto.classList.remove('hidden');
                break;
            case 'interpretacao':
                DOM.containers.etapaInterpretacao.classList.remove('hidden');
                break;
            case 'resultado':
                DOM.containers.etapaResultado.classList.remove('hidden');
                break;
        }
        
        console.log(`Etapa exibida: ${etapa}`);
    }

    // ===================================================
    // FUNÇÕES DE PREPARAÇÃO DAS ETAPAS DE AVALIAÇÃO
    // ===================================================
    
    /**
     * Prepara a etapa de palavras
     */
    function prepararEtapaPalavras() {
        try {
            // Limpar o container
            DOM.conteudo.palavras.innerHTML = '';
            
            // Adicionar as palavras ao container
            estado.avaliacao.palavras.forEach((palavra, index) => {
                const div = document.createElement('div');
                div.className = 'border rounded p-2 flex items-center palavra-item bg-yellow-100 cursor-not-allowed transition-colors';
                div.setAttribute('data-index', index);
                div.innerHTML = `<span class="text-sm text-gray-800 select-none w-full text-center">${palavra}</span>`;
                
                // Adicionar evento de clique
                div.addEventListener('click', function(e) {
                    // Verificar se o timer está ativo
                    if (!estado.timers.palavras) {
                        e.preventDefault();
                        mostrarErro('Por favor, inicie o cronômetro antes de começar a marcar as palavras.');
                        return;
                    }
                    
                    // Marcar como lida
                    if (!this.classList.contains('bg-green-200') && !this.classList.contains('bg-red-200')) {
                        this.classList.remove('bg-yellow-100', 'hover:bg-yellow-200', 'cursor-not-allowed');
                        this.classList.add('bg-green-200');
                        atualizarContadorPalavras();
                    }
                });
                
                DOM.conteudo.palavras.appendChild(div);
            });
            
            // Atualizar contador
            DOM.contadores.totalPalavras.textContent = estado.avaliacao.palavras.length;
            DOM.contadores.palavrasLidas.textContent = '0';
            estado.palavrasLidas = 0;
            
            console.log(`Etapa de palavras preparada com ${estado.avaliacao.palavras.length} palavras`);
        } catch (error) {
            console.error('Erro ao preparar etapa de palavras:', error);
            mostrarErro('Ocorreu um erro ao preparar a etapa de palavras.');
        }
    }
    
    /**
     * Prepara a etapa de pseudopalavras
     */
    function prepararEtapaPseudopalavras() {
        try {
            // Limpar o container
            DOM.conteudo.pseudopalavras.innerHTML = '';
            
            // Adicionar as pseudopalavras ao container
            estado.avaliacao.pseudopalavras.forEach((palavra, index) => {
                const div = document.createElement('div');
                div.className = 'border rounded p-2 flex items-center pseudopalavra-item bg-yellow-100 cursor-not-allowed transition-colors';
                div.setAttribute('data-index', index);
                div.innerHTML = `<span class="text-sm text-gray-800 select-none w-full text-center">${palavra}</span>`;
                
                // Adicionar evento de clique
                div.addEventListener('click', function(e) {
                    // Verificar se o timer está ativo
                    if (!estado.timers.pseudopalavras) {
                        e.preventDefault();
                        mostrarErro('Por favor, inicie o cronômetro antes de começar a marcar as pseudopalavras.');
                        return;
                    }
                    
                    // Marcar como lida
                    if (!this.classList.contains('bg-green-200') && !this.classList.contains('bg-red-200')) {
                        this.classList.remove('bg-yellow-100', 'hover:bg-yellow-200', 'cursor-not-allowed');
                        this.classList.add('bg-green-200');
                        atualizarContadorPseudopalavras();
                    }
                });
                
                DOM.conteudo.pseudopalavras.appendChild(div);
            });
            
            // Atualizar contador
            DOM.contadores.totalPseudopalavras.textContent = estado.avaliacao.pseudopalavras.length;
            DOM.contadores.pseudopalavrasLidas.textContent = '0';
            estado.pseudopalavrasLidas = 0;
            
            console.log(`Etapa de pseudopalavras preparada com ${estado.avaliacao.pseudopalavras.length} pseudopalavras`);
        } catch (error) {
            console.error('Erro ao preparar etapa de pseudopalavras:', error);
            mostrarErro('Ocorreu um erro ao preparar a etapa de pseudopalavras.');
        }
    }
    
    /**
     * Prepara a etapa de frases
     */
    function prepararEtapaFrases() {
        try {
            // Limpar o container
            DOM.conteudo.frases.innerHTML = '';
            
            // Adicionar as frases ao container
            estado.avaliacao.frases.forEach((frase, index) => {
                const div = document.createElement('div');
                div.className = 'border rounded p-3 flex items-center frase-item bg-yellow-100 cursor-not-allowed transition-colors';
                div.setAttribute('data-index', index);
                div.innerHTML = `<span class="text-sm text-gray-800 select-none w-full">${frase}</span>`;
                
                // Adicionar evento de clique
                div.addEventListener('click', function(e) {
                    // Verificar se o timer está ativo
                    if (!estado.timers.frases) {
                        e.preventDefault();
                        mostrarErro('Por favor, inicie o cronômetro antes de começar a marcar as frases.');
                        return;
                    }
                    
                    // Marcar como lida
                    if (!this.classList.contains('bg-green-200') && !this.classList.contains('bg-red-200')) {
                        this.classList.remove('bg-yellow-100', 'hover:bg-yellow-200', 'cursor-not-allowed');
                        this.classList.add('bg-green-200');
                        atualizarContadorFrases();
                    }
                });
                
                DOM.conteudo.frases.appendChild(div);
            });
            
            // Atualizar contador
            DOM.contadores.totalFrases.textContent = estado.avaliacao.frases.length;
            DOM.contadores.frasesLidas.textContent = '0';
            estado.frasesLidas = 0;
            
            console.log(`Etapa de frases preparada com ${estado.avaliacao.frases.length} frases`);
        } catch (error) {
            console.error('Erro ao preparar etapa de frases:', error);
            mostrarErro('Ocorreu um erro ao preparar a etapa de frases.');
        }
    }
    
    /**
     * Prepara a etapa de texto
     */
    function prepararEtapaTexto() {
        try {
            // Limpar o container
            DOM.conteudo.texto.innerHTML = '';
            
            // Dividir o texto em linhas (aproximadamente 10 palavras por linha)
            const palavras = estado.avaliacao.texto.split(' ');
            const linhas = [];
            let linhaAtual = [];
            
            palavras.forEach(palavra => {
                linhaAtual.push(palavra);
                if (linhaAtual.length >= 10) {
                    linhas.push(linhaAtual.join(' '));
                    linhaAtual = [];
                }
            });
            
            // Adicionar a última linha se houver palavras restantes
            if (linhaAtual.length > 0) {
                linhas.push(linhaAtual.join(' '));
            }
            
            // Adicionar as linhas ao container
            linhas.forEach((linha, index) => {
                const div = document.createElement('div');
                div.className = 'border rounded p-2 mb-2 linha-texto-item bg-yellow-100 cursor-not-allowed transition-colors';
                div.setAttribute('data-index', index);
                div.innerHTML = `<span class="text-sm text-gray-800 select-none">${linha}</span>`;
                
                // Adicionar evento de clique
                div.addEventListener('click', function(e) {
                    // Verificar se o timer está ativo
                    if (!estado.timers.texto) {
                        e.preventDefault();
                        mostrarErro('Por favor, inicie o cronômetro antes de começar a marcar as linhas de texto.');
                        return;
                    }
                    
                    // Marcar como lida
                    if (!this.classList.contains('bg-green-200') && !this.classList.contains('bg-red-200')) {
                        this.classList.remove('bg-yellow-100', 'hover:bg-yellow-200', 'cursor-not-allowed');
                        this.classList.add('bg-green-200');
                        atualizarContadorLinhas();
                    }
                });
                
                DOM.conteudo.texto.appendChild(div);
            });
            
            // Atualizar contador
            DOM.contadores.totalLinhas.textContent = linhas.length;
            DOM.contadores.linhasLidas.textContent = '0';
            estado.linhasLidas = 0;
            
            console.log(`Etapa de texto preparada com ${linhas.length} linhas`);
        } catch (error) {
            console.error('Erro ao preparar etapa de texto:', error);
            mostrarErro('Ocorreu um erro ao preparar a etapa de texto.');
        }
    }
    
    /**
     * Prepara a etapa de interpretação de texto
     */
    function prepararEtapaInterpretacao() {
        try {
            // Limpar o container
            DOM.conteudo.questoes.innerHTML = '';
            
            // Adicionar as questões ao container
            estado.avaliacao.questoes.forEach((questao, qIndex) => {
                const div = document.createElement('div');
                div.className = 'border border-gray-200 rounded-lg p-4 questao-item bg-white';
                
                // Criar HTML para as opções
                let opcoesHTML = '';
                questao.opcoes.forEach((opcao, oIndex) => {
                    opcoesHTML += `
                        <div class="flex items-center mt-2">
                            <input type="radio" id="questao-${qIndex}-opcao-${oIndex}" name="questao-${qIndex}" value="${oIndex}" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 questao-opcao">
                            <label for="questao-${qIndex}-opcao-${oIndex}" class="ml-2 text-sm text-gray-800">${opcao}</label>
                        </div>
                    `;
                });
                
                // Montar DIV completa
                div.innerHTML = `
                    <p class="font-medium text-gray-800 mb-2">Questão ${qIndex + 1}: ${questao.pergunta}</p>
                    <div class="ml-4">
                        ${opcoesHTML}
                    </div>
                `;
                DOM.conteudo.questoes.appendChild(div);
            });
            
            // Configurar evento para os radio buttons
            const radios = DOM.conteudo.questoes.querySelectorAll('.questao-opcao');
            radios.forEach(radio => {
                radio.addEventListener('change', atualizarContadorRespostas);
            });
            
            // Atualizar contador
            DOM.contadores.totalQuestoes.textContent = estado.avaliacao.questoes.length;
            DOM.contadores.respostasCorretas.textContent = '0';
            estado.respostasCorretas = 0;
            
            console.log(`Etapa de interpretação preparada com ${estado.avaliacao.questoes.length} questões`);
        } catch (error) {
            console.error('Erro ao preparar etapa de interpretação:', error);
            mostrarErro('Ocorreu um erro ao preparar a etapa de interpretação.');
        }
    }
    
    // ===================================================
    // FUNÇÕES DE ATUALIZAÇÃO DE CONTADORES
    // ===================================================
    
    /**
     * Atualiza o contador de palavras lidas
     */
    function atualizarContadorPalavras() {
        const itensVerdes = DOM.containers.etapaPalavras.querySelectorAll('.palavra-item.bg-green-200');
        estado.palavrasLidas = itensVerdes.length;
        DOM.contadores.palavrasLidas.textContent = estado.palavrasLidas;
    }
    
    /**
     * Atualiza o contador de pseudopalavras lidas
     */
    function atualizarContadorPseudopalavras() {
        const itensVerdes = DOM.containers.etapaPseudopalavras.querySelectorAll('.pseudopalavra-item.bg-green-200');
        estado.pseudopalavrasLidas = itensVerdes.length;
        DOM.contadores.pseudopalavrasLidas.textContent = estado.pseudopalavrasLidas;
    }
    
    /**
     * Atualiza o contador de frases lidas
     */
    function atualizarContadorFrases() {
        const itensVerdes = document.querySelectorAll('.frase-item.bg-green-200');
        estado.frasesLidas = itensVerdes.length;
        DOM.contadores.frasesLidas.textContent = estado.frasesLidas;
    }
    
    /**
     * Atualiza o contador de linhas lidas
     */
    function atualizarContadorLinhas() {
        const itensVerdes = document.querySelectorAll('.linha-texto-item.bg-green-200');
        estado.linhasLidas = itensVerdes.length;
        DOM.contadores.linhasLidas.textContent = estado.linhasLidas;
    }
    
    /**
     * Atualiza o contador de respostas corretas
     */
    function atualizarContadorRespostas() {
        estado.respostasCorretas = 0;
        
        // Contar respostas corretas
        estado.avaliacao.questoes.forEach((questao, index) => {
            const selecionada = document.querySelector(`input[name="questao-${index}"]:checked`);
            
            if (selecionada && parseInt(selecionada.value) === questao.respostaCorreta) {
                estado.respostasCorretas++;
            }
        });
        
        DOM.contadores.respostasCorretas.textContent = estado.respostasCorretas;
    }

    // ===================================================
    // FUNÇÕES DE CONTROLE DE TIMER
    // ===================================================
    
    /**
     * Inicia o timer para uma etapa específica
     * @param {string} etapa - Nome da etapa para iniciar o timer
     */
    function iniciarTimer(etapa) {
        try {
            console.log(`Iniciando timer para a etapa: ${etapa}`);
            
            let segundosRestantes = 60;
            const timerElement = DOM.timers[etapa];
            const btnElement = DOM.timers[`iniciar${etapa.charAt(0).toUpperCase() + etapa.slice(1)}`];
            
            // Desabilitar o botão
            btnElement.disabled = true;
            btnElement.classList.add('bg-gray-400');
            btnElement.classList.remove('bg-blue-600', 'hover:bg-blue-700');
            btnElement.textContent = 'Cronômetro iniciado';
            
            // Habilitar os itens desta etapa para cliques
            habilitarCliques(etapa);
            
            // Iniciar contagem regressiva
            estado.timers[etapa] = setInterval(() => {
                segundosRestantes--;
                
                // Formatar tempo (MM:SS)
                const minutos = Math.floor(segundosRestantes / 60);
                const segundos = segundosRestantes % 60;
                timerElement.textContent = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
                
                // Verificar se o tempo acabou
                if (segundosRestantes <= 0) {
                    clearInterval(estado.timers[etapa]);
                    timerElement.textContent = '00:00';
                    
                    // Marcar itens não clicados como não lidos
                    marcarNaoLidos(etapa);
                    
                    // Notificar o usuário
                    mostrarMensagem('Tempo esgotado! Por favor, avance para a próxima etapa.');
                }
            }, 1000);
        } catch (error) {
            console.error(`Erro ao iniciar timer para ${etapa}:`, error);
            mostrarErro('Não foi possível iniciar o cronômetro. Por favor, tente novamente.');
        }
    }
    
    /**
     * Habilita os cliques nos itens de uma etapa
     * @param {string} etapa - Nome da etapa
     */
    function habilitarCliques(etapa) {
        let items;
        
        switch (etapa) {
            case 'palavras':
                items = document.querySelectorAll('.palavra-item');
                break;
            case 'pseudopalavras':
                items = document.querySelectorAll('.pseudopalavra-item');
                break;
            case 'frases':
                items = document.querySelectorAll('.frase-item');
                break;
            case 'texto':
                items = document.querySelectorAll('.linha-texto-item');
                break;
        }
        
        if (items && items.length > 0) {
            items.forEach(item => {
                item.classList.remove('cursor-not-allowed');
                item.classList.add('hover:bg-yellow-200', 'cursor-pointer');
                item.style.pointerEvents = 'auto';
            });
            
            console.log(`${items.length} itens habilitados para cliques na etapa ${etapa}`);
        }
    }
    
    /**
     * Marca os itens não clicados como não lidos
     * @param {string} etapa - Nome da etapa
     */
    function marcarNaoLidos(etapa) {
        let items;
        
        switch (etapa) {
            case 'palavras':
                items = document.querySelectorAll('.palavra-item:not(.bg-green-200)');
                break;
            case 'pseudopalavras':
                items = document.querySelectorAll('.pseudopalavra-item:not(.bg-green-200)');
                break;
            case 'frases':
                items = document.querySelectorAll('.frase-item:not(.bg-green-200)');
                break;
            case 'texto':
                items = document.querySelectorAll('.linha-texto-item:not(.bg-green-200)');
                break;
        }
        
        if (items && items.length > 0) {
            items.forEach(item => {
                item.classList.remove('bg-yellow-100', 'hover:bg-yellow-200');
                item.classList.add('bg-red-200');
                item.style.pointerEvents = 'none';
            });
            
            console.log(`${items.length} itens marcados como não lidos na etapa ${etapa}`);
        }
    }
    
    // ===================================================
    // FUNÇÕES DE NAVEGAÇÃO ENTRE ETAPAS
    // ===================================================
    
    /**
     * Muda de uma etapa para outra
     * @param {string} etapaAtual - Nome da etapa atual
     * @param {string} proximaEtapa - Nome da próxima etapa
     */
    function mudarEtapa(etapaAtual, proximaEtapa) {
        try {
            console.log(`Mudando de etapa: ${etapaAtual} -> ${proximaEtapa}`);
            
            // Parar o timer da etapa atual se estiver ativo
            if (estado.timers[etapaAtual]) {
                clearInterval(estado.timers[etapaAtual]);
                estado.timers[etapaAtual] = null;
            }
            
            // Para etapa de palavras, calcular e verificar nível com base nas regras específicas da série
            if (etapaAtual === 'palavras' && proximaEtapa === 'pseudopalavras') {
                // Calcular palavras por minuto
                const ppm = Math.round((estado.palavrasLidas / 60) * 60);
                console.log(`Palavras por minuto: ${ppm}`);
                
                // Verificar se é "Não Leitor" de acordo com as regras específicas da série
                if (estado.regras && (
                    (estado.faixaSerie === "1-2" && ppm <= estado.regras.palavrasPorMinutoMinimo.maxNaoLeitor) ||
                    (estado.faixaSerie === "3-5" && ppm <= estado.regras.palavrasPorMinutoMinimo.maxNaoLeitor) ||
                    (estado.faixaSerie === "6-9" && ppm <= estado.regras.palavrasPorMinutoMinimo.maxNaoLeitor)
                )) {
                    // Se configurado para finalizar para "Não Leitor"
                    if (estado.regras.finalizarSeNaoLeitor) {
                        mostrarMensagem(`ATENÇÃO: O aluno leu ${estado.palavrasLidas} palavras em 1 minuto (${ppm} PPM), o que corresponde ao perfil NÍVEL 1 - NÃO LEITOR. De acordo com as regras para ${estado.faixaSerie === "1-2" ? "1º e 2º anos" : estado.faixaSerie === "3-5" ? "3º ao 5º anos" : "6º ao 9º anos"}, a avaliação será finalizada automaticamente.`);
                        finalizarAvaliacaoAntecipadamente();
                        return;
                    } else {
                        // Somente mostrar mensagem e continuar
                        mostrarMensagem(`ATENÇÃO: O aluno corresponde ao perfil NÍVEL 1 - NÃO LEITOR. ${estado.regras.mensagens.naoLeitor}`);
                    }
                }
            }
            
            // Verificar condições para a etapa de pseudopalavras
            if (etapaAtual === 'pseudopalavras' && proximaEtapa === 'frases') {
                // Calcular palavras por minuto
                const ppm = Math.round((estado.palavrasLidas / 60) * 60);
                
                // Se o aluno corresponde ao perfil "Leitor de Sílabas" de acordo com a série
                if (estado.regras && (
                    (estado.faixaSerie === "1-2" && 
                     ppm >= estado.regras.palavrasPorMinutoMinimo.leitorSilabas && 
                     ppm <= estado.regras.palavrasPorMinutoMinimo.maxLeitorSilabas) ||
                    (estado.faixaSerie === "3-5" && 
                     ppm >= estado.regras.palavrasPorMinutoMinimo.leitorSilabas && 
                     ppm <= estado.regras.palavrasPorMinutoMinimo.maxLeitorSilabas) ||
                    (estado.faixaSerie === "6-9" && 
                     ppm >= estado.regras.palavrasPorMinutoMinimo.leitorSilabas && 
                     ppm <= estado.regras.palavrasPorMinutoMinimo.maxLeitorSilabas)
                )) {
                    // Se configurado para finalizar para "Leitor de Sílabas"
                    if (estado.regras.finalizarSeLeitorSilabas) {
                        mostrarMensagem(`ATENÇÃO: O aluno leu ${estado.palavrasLidas} palavras em 1 minuto (${ppm} PPM) e ${estado.pseudopalavrasLidas} pseudopalavras, o que corresponde ao perfil NÍVEL 2 - LEITOR DE SÍLABAS. De acordo com as regras para ${estado.faixaSerie === "1-2" ? "1º e 2º anos" : estado.faixaSerie === "3-5" ? "3º ao 5º anos" : "6º ao 9º anos"}, a avaliação será finalizada automaticamente.`);
                        finalizarAvaliacaoAntecipadamente();
                        return;
                    } else {
                        // Somente mostrar mensagem e continuar
                        mostrarMensagem(`ATENÇÃO: O aluno corresponde ao perfil NÍVEL 2 - LEITOR DE SÍLABAS. ${estado.regras.mensagens.leitorSilabas}`);
                    }
                }
                
                // Verificar pseudopalavras de acordo com o nível determinado pelas palavras lidas
                const nivel = determinarNivelGenerico(estado.faixaSerie);
                let pseudoMin = 0;
                
                switch (nivel) {
                    case 3: // Leitor de Palavras
                        pseudoMin = estado.regras.pseudopalavrasMinimo.leitorPalavras;
                        break;
                    case 4: // Leitor de Frases
                        pseudoMin = estado.regras.pseudopalavrasMinimo.leitorFrases;
                        break;
                    case 5: // Leitor de Texto sem Fluência
                        pseudoMin = estado.regras.pseudopalavrasMinimo.leitorTextoSemFluencia;
                        break;
                    case 6: // Leitor de Texto com Fluência
                        pseudoMin = estado.regras.pseudopalavrasMinimo.leitorTextoComFluencia;
                        break;
                }
                
                // Verificar se o número de pseudopalavras é muito baixo para o nível esperado
                if (nivel >= 3 && estado.pseudopalavrasLidas < pseudoMin) {
                    mostrarMensagem(`ATENÇÃO: O aluno leu apenas ${estado.pseudopalavrasLidas} pseudopalavras, o que está abaixo do esperado para o nível determinado pela leitura de palavras (mínimo: ${pseudoMin}). Considere registrar esta observação na avaliação.`);
                }
            }
            
            // Exibir a próxima etapa
            exibirEtapa(proximaEtapa);
            
            // Preparar a próxima etapa
            switch (proximaEtapa) {
                case 'pseudopalavras':
                    prepararEtapaPseudopalavras();
                    break;
                case 'frases':
                    prepararEtapaFrases();
                    break;
                case 'texto':
                    prepararEtapaTexto();
                    break;
                case 'interpretacao':
                    prepararEtapaInterpretacao();
                    break;
            }
        } catch (error) {
            console.error(`Erro ao mudar para a etapa ${proximaEtapa}:`, error);
            mostrarErro('Ocorreu um erro ao mudar de etapa. Por favor, tente novamente.');
        }
    }
    
    // ===================================================
    // FUNÇÕES DE FINALIZAÇÃO E RESULTADOS
    // ===================================================
    
    /**
     * Finaliza a avaliação
     */
    function finalizarAvaliacao() {
        finalizarAvaliacaoAntecipadamente();
    }
    
    /**
     * Finaliza a avaliação antecipadamente
     */
    function finalizarAvaliacaoAntecipadamente() {
        try {
            console.log('Finalizando avaliação antecipadamente');
            
            // Exibir a tela de resultado
            exibirEtapa('resultado');
            
            // Verificar se deve mostrar resultados detalhados
            const mostrarResultados = DOM.resultados.mostrarResultados.checked;
            
            // Se não mostrar resultados detalhados, esconder elementos
            if (!mostrarResultados) {
                const elementosParaEsconder = [
                    'resultado-nome-aluno',
                    'resultado-serie-aluno',
                    'resultado-palavras-lidas',
                    'resultado-tempo-leitura',
                    'resultado-palavras-por-minuto',
                    'resultado-precisao',
                    'resultado-nivel-sugerido',
                    'resultado-classificacao'
                ];
                
                // Esconder elementos
                elementosParaEsconder.forEach(id => {
                    const elemento = document.getElementById(id);
                    if (elemento) {
                        elemento.classList.add('hidden');
                    }
                });
                
                // Esconder seções de resultado
                document.querySelectorAll('.secao-resultado').forEach(secao => {
                    secao.classList.add('hidden');
                });
            }
            
            // Atualizar os resultados
            atualizarResultados();
            
            // Voltar para o topo da página
            window.scrollTo(0, 0);
            
            console.log('Avaliação finalizada com sucesso');
        } catch (error) {
            console.error('Erro ao finalizar avaliação:', error);
            mostrarErro('Ocorreu um erro ao finalizar a avaliação.');
        }
    }
    
    /**
     * Atualiza e exibe os resultados da avaliação
     */
    function atualizarResultados() {
        try {
            // Determinar nível de leitura
            sugerirNivel();
        } catch (error) {
            console.error('Erro ao atualizar resultados:', error);
            mostrarErro('Não foi possível calcular os resultados corretamente.');
        }
    }
    
    /**
     * Salva os resultados da avaliação
     */
    function salvarAvaliacao() {
        try {
            // Obter nível determinado
            const nivelSelecionado = window.nivelLeitorSugerido;
            const descricaoNivel = window.descricaoNivelLeitor;
            
            if (!nivelSelecionado) {
                mostrarErro('Não foi possível determinar o nível do leitor.');
                return;
            }
            
            // Buscar turma do aluno
            const turmaAluno = DADOS.turmas.find(t => t.id === estado.aluno.turma_id);
            const faixaSerieExibicao = estado.faixaSerie === "1-2" ? "1º-2º ano" : estado.faixaSerie === "3-5" ? "3º-5º ano" : "6º-9º ano";
            
            // Calcular palavras por minuto
            const ppm = Math.round((estado.palavrasLidas / 60) * 60);
            
            // Preparar dados para API
            const dataAvaliacao = {
                aluno: {
                    id: estado.aluno.id,
                    nome: estado.aluno.nome,
                    matricula: estado.aluno.matricula,
                    turma: turmaAluno ? turmaAluno.nome : '',
                    serie: turmaAluno ? turmaAluno.serie : '',
                    faixaSerie: faixaSerieExibicao
                },
                evento: {
                    id: estado.avaliacao.id,
                    nome: estado.avaliacao.nome
                },
                data: new Date().toISOString(),
                resultados: {
                    palavras: {
                        total: estado.avaliacao.palavras.length,
                        corretas: estado.palavrasLidas,
                        ppm: ppm,
                        porcentagem: Math.round((estado.palavrasLidas / estado.avaliacao.palavras.length) * 100)
                    },
                    pseudopalavras: {
                        total: estado.avaliacao.pseudopalavras.length,
                        corretas: estado.pseudopalavrasLidas,
                        porcentagem: Math.round((estado.pseudopalavrasLidas / estado.avaliacao.pseudopalavras.length) * 100)
                    },
                    frases: {
                        total: estado.avaliacao.frases ? estado.avaliacao.frases.length : 0,
                        corretas: estado.frasesLidas,
                        porcentagem: estado.avaliacao.frases && estado.avaliacao.frases.length > 0 ? 
                            Math.round((estado.frasesLidas / estado.avaliacao.frases.length) * 100) : 0
                    },
                    interpretacao: {
                        total: estado.avaliacao.questoes ? estado.avaliacao.questoes.length : 0,
                        corretas: estado.respostasCorretas,
                        porcentagem: estado.avaliacao.questoes && estado.avaliacao.questoes.length > 0 ? 
                            Math.round((estado.respostasCorretas / estado.avaliacao.questoes.length) * 100) : 0
                    },
                    nivel: {
                        valor: nivelSelecionado,
                        descricao: descricaoNivel,
                        regras: faixaSerieExibicao
                    }
                },
                regrasAplicadas: {
                    faixaSerie: estado.faixaSerie,
                    criterios: {
                        naoLeitor: estado.regras.palavrasPorMinutoMinimo.maxNaoLeitor,
                        leitorSilabas: {
                            min: estado.regras.palavrasPorMinutoMinimo.leitorSilabas,
                            max: estado.regras.palavrasPorMinutoMinimo.maxLeitorSilabas
                        },
                        leitorPalavras: {
                            min: estado.regras.palavrasPorMinutoMinimo.leitorPalavras,
                            max: estado.regras.palavrasPorMinutoMinimo.maxLeitorPalavras,
                            pseudopalavrasMin: estado.regras.pseudopalavrasMinimo.leitorPalavras
                        },
                        leitorFrases: {
                            min: estado.regras.palavrasPorMinutoMinimo.leitorFrases,
                            max: estado.regras.palavrasPorMinutoMinimo.maxLeitorFrases,
                            pseudopalavrasMin: estado.regras.pseudopalavrasMinimo.leitorFrases
                        },
                        leitorTextoSemFluencia: {
                            min: estado.regras.palavrasPorMinutoMinimo.leitorTextoSemFluencia,
                            max: estado.regras.palavrasPorMinutoMinimo.maxLeitorTextoSemFluencia,
                            pseudopalavrasMin: estado.regras.pseudopalavrasMinimo.leitorTextoSemFluencia
                        },
                        leitorTextoComFluencia: {
                            min: estado.regras.palavrasPorMinutoMinimo.leitorTextoComFluencia,
                            pseudopalavrasMin: estado.regras.pseudopalavrasMinimo.leitorTextoComFluencia
                        }
                    },
                    aplicacao: {
                        finalizarSeNaoLeitor: estado.regras.finalizarSeNaoLeitor,
                        finalizarSeLeitorSilabas: estado.regras.finalizarSeLeitorSilabas
                    }
                }
            };
            
            // Em uma implementação real, enviar dados para API
            console.log('Dados para salvar:', dataAvaliacao);
            
            // Adicionar informações sobre as regras específicas da série na mensagem
            let regrasInfo = '';
            if (estado.regras) {
                regrasInfo = `\nRegras aplicadas: ${faixaSerieExibicao}
- Não Leitor: até ${estado.regras.palavrasPorMinutoMinimo.maxNaoLeitor} PPM
- Leitor de Sílabas: ${estado.regras.palavrasPorMinutoMinimo.leitorSilabas}-${estado.regras.palavrasPorMinutoMinimo.maxLeitorSilabas} PPM
- Leitor de Palavras: ${estado.regras.palavrasPorMinutoMinimo.leitorPalavras}-${estado.regras.palavrasPorMinutoMinimo.maxLeitorPalavras} PPM
- Leitor de Frases: ${estado.regras.palavrasPorMinutoMinimo.leitorFrases}-${estado.regras.palavrasPorMinutoMinimo.maxLeitorFrases} PPM
- Leitor de Texto sem Fluência: ${estado.regras.palavrasPorMinutoMinimo.leitorTextoSemFluencia}-${estado.regras.palavrasPorMinutoMinimo.maxLeitorTextoSemFluencia} PPM
- Leitor de Texto com Fluência: ${estado.regras.palavrasPorMinutoMinimo.leitorTextoComFluencia}+ PPM`;
            }
            
            // Exibir mensagem de confirmação
            const mensagem = `Avaliação salva com sucesso!

Aluno: ${estado.aluno.nome}
Turma: ${turmaAluno ? turmaAluno.nome : '-'}
Série: ${turmaAluno ? turmaAluno.serie : '-'}
Evento: ${estado.avaliacao.nome}
Data: ${new Date().toLocaleDateString('pt-BR')}

Resultados:
- Palavras lidas: ${estado.palavrasLidas}/${estado.avaliacao.palavras.length} (${Math.round((estado.palavrasLidas / estado.avaliacao.palavras.length) * 100)}%)
- Pseudopalavras lidas: ${estado.pseudopalavrasLidas}/${estado.avaliacao.pseudopalavras.length} (${Math.round((estado.pseudopalavrasLidas / estado.avaliacao.pseudopalavras.length) * 100)}%)
- Frases lidas: ${estado.frasesLidas}/${estado.avaliacao.frases ? estado.avaliacao.frases.length : 0}
- Respostas corretas: ${estado.respostasCorretas}/${estado.avaliacao.questoes ? estado.avaliacao.questoes.length : 0}
- PPM (Palavras por minuto): ${ppm}

Nível do leitor: ${descricaoNivel}${regrasInfo}`;

            mostrarMensagem(mensagem);
            
            // Limpar avaliação atual
            resetarAvaliacao();
            
            console.log('Avaliação salva com sucesso');
        } catch (error) {
            console.error('Erro ao salvar avaliação:', error);
            mostrarErro('Ocorreu um erro ao salvar a avaliação.');
        }
    }
    
    /**
     * Reseta a avaliação atual para iniciar uma nova
     */
    function resetarAvaliacao() {
        try {
            console.log('Resetando avaliação');
            
            // Limpar estado
            estado.aluno = null;
            estado.avaliacao = null;
            estado.palavrasLidas = 0;
            estado.pseudopalavrasLidas = 0;
            estado.frasesLidas = 0;
            estado.linhasLidas = 0;
            estado.respostasCorretas = 0;
            
            // Parar todos os timers
            Object.keys(estado.timers).forEach(etapa => {
                if (estado.timers[etapa]) {
                    clearInterval(estado.timers[etapa]);
                    estado.timers[etapa] = null;
                }
            });
            
            // Resetar timers na interface
            DOM.timers.palavras.textContent = '01:00';
            DOM.timers.pseudopalavras.textContent = '01:00';
            DOM.timers.frases.textContent = '01:00';
            DOM.timers.texto.textContent = '01:00';
            
            // Reativar botões
            const botoes = [
                DOM.timers.iniciarPalavras,
                DOM.timers.iniciarPseudopalavras,
                DOM.timers.iniciarFrases,
                DOM.timers.iniciarTexto
            ];
            
            botoes.forEach(btn => {
                btn.disabled = false;
                btn.classList.remove('bg-gray-400');
                btn.classList.add('bg-blue-600', 'hover:bg-blue-700');
                btn.textContent = 'Iniciar Cronômetro';
            });
            
            // Voltar para a tela de seleção
            exibirEtapa('selecaoAluno');
            
            console.log('Avaliação resetada com sucesso');
        } catch (error) {
            console.error('Erro ao resetar avaliação:', error);
            mostrarErro('Ocorreu um erro ao preparar uma nova avaliação.');
        }
    }

    // ===================================================
    // FUNÇÕES DE ANÁLISE DE NÍVEL DE LEITURA
    // ===================================================
    
    /**
     * Sugere o nível de leitura baseado nos resultados da avaliação
     */
    function sugerirNivel() {
        try {
            console.log('Calculando o nível de leitura sugerido');
            
            let nivelSugerido = 0;
            let descricaoNivel = "";
            let infoDetalhada = "";
            let corNivel = "";
            
            // Calcular palavras por minuto
            const ppm = Math.round((estado.palavrasLidas / 60) * 60);
            
            // Exibir regras específicas para a faixa de série
            if (DOM.resultados.regras) {
                DOM.resultados.regras.innerHTML = `<strong>Regras para ${estado.faixaSerie === "1-2" ? "1º e 2º anos" : estado.faixaSerie === "3-5" ? "3º ao 5º anos" : "6º ao 9º anos"}</strong>`;
                
                // Adicionar tabela de regras aplicadas, se disponíveis
                if (estado.regras) {
                    let regrasTabelaHTML = `
                    <div class="mt-2 text-xs">
                        <table class="w-full table-auto border-collapse">
                            <thead>
                                <tr class="bg-gray-200">
                                    <th class="border px-2 py-1">Nível</th>
                                    <th class="border px-2 py-1">PPM</th>
                                    <th class="border px-2 py-1">Pseudopalavras</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="border px-2 py-1">Não Leitor</td>
                                    <td class="border px-2 py-1">0-${estado.regras.palavrasPorMinutoMinimo.maxNaoLeitor}</td>
                                    <td class="border px-2 py-1">-</td>
                                </tr>
                                <tr>
                                    <td class="border px-2 py-1">Leitor de Sílabas</td>
                                    <td class="border px-2 py-1">${estado.regras.palavrasPorMinutoMinimo.leitorSilabas}-${estado.regras.palavrasPorMinutoMinimo.maxLeitorSilabas}</td>
                                    <td class="border px-2 py-1">-</td>
                                </tr>
                                <tr>
                                    <td class="border px-2 py-1">Leitor de Palavras</td>
                                    <td class="border px-2 py-1">${estado.regras.palavrasPorMinutoMinimo.leitorPalavras}-${estado.regras.palavrasPorMinutoMinimo.maxLeitorPalavras}</td>
                                    <td class="border px-2 py-1">${estado.regras.pseudopalavrasMinimo.leitorPalavras}+</td>
                                </tr>
                                <tr>
                                    <td class="border px-2 py-1">Leitor de Frases</td>
                                    <td class="border px-2 py-1">${estado.regras.palavrasPorMinutoMinimo.leitorFrases}-${estado.regras.palavrasPorMinutoMinimo.maxLeitorFrases}</td>
                                    <td class="border px-2 py-1">${estado.regras.pseudopalavrasMinimo.leitorFrases}+</td>
                                </tr>
                                <tr>
                                    <td class="border px-2 py-1">Leitor sem Fluência</td>
                                    <td class="border px-2 py-1">${estado.regras.palavrasPorMinutoMinimo.leitorTextoSemFluencia}-${estado.regras.palavrasPorMinutoMinimo.maxLeitorTextoSemFluencia}</td>
                                    <td class="border px-2 py-1">${estado.regras.pseudopalavrasMinimo.leitorTextoSemFluencia}+</td>
                                </tr>
                                <tr>
                                    <td class="border px-2 py-1">Leitor com Fluência</td>
                                    <td class="border px-2 py-1">${estado.regras.palavrasPorMinutoMinimo.leitorTextoComFluencia}+</td>
                                    <td class="border px-2 py-1">${estado.regras.pseudopalavrasMinimo.leitorTextoComFluencia}+</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    `;
                    DOM.resultados.regras.innerHTML += regrasTabelaHTML;
                }
            }
            
            // Determinar nível usando a função específica
            nivelSugerido = determinarNivelGenerico(estado.faixaSerie);
            console.log(`Nível sugerido: ${nivelSugerido} para faixa de série ${estado.faixaSerie} com ${ppm} PPM e ${estado.pseudopalavrasLidas} pseudopalavras`);
            
            // Definir descrição e cor do nível
            if (nivelSugerido === 0) {
                descricaoNivel = "NÍVEL 0 - NÃO AVALIADO";
                corNivel = "#6B7280"; // Cinza
                if (estado.regras) {
                    infoDetalhada = "Não lê nem tenta. Intervenção imediata necessária.";
                } else if (estado.faixaSerie === "1-2") {
                    infoDetalhada = "Não lê nem tenta. Intervenção imediata necessária.";
                } else if (estado.faixaSerie === "3-5") {
                    infoDetalhada = "Não lê. Requer desenvolvimento de consciência fonológica.";
                } else {
                    infoDetalhada = "Não lê. Requer intervenção fonológica urgente.";
                }
            } else if (nivelSugerido === 1) {
                descricaoNivel = "NÍVEL 1 - NÃO LEITOR";
                corNivel = "#EF4444"; // Vermelho
                if (estado.regras && estado.regras.mensagens && estado.regras.mensagens.naoLeitor) {
                    infoDetalhada = estado.regras.mensagens.naoLeitor;
                } else if (estado.faixaSerie === "1-2") {
                    infoDetalhada = "Lê até 10 palavras/min. Necessita intervenção urgente.";
                } else if (estado.faixaSerie === "3-5") {
                    infoDetalhada = "Lê até 20 palavras/min. Necessita intervenção urgente.";
                } else {
                    infoDetalhada = "Lê até 50 palavras/min. Intervenção imediata necessária.";
                }
            } else if (nivelSugerido === 2) {
                descricaoNivel = "NÍVEL 2 - LEITOR DE SÍLABAS";
                corNivel = "#F97316"; // Laranja
                if (estado.regras && estado.regras.mensagens && estado.regras.mensagens.leitorSilabas) {
                    infoDetalhada = estado.regras.mensagens.leitorSilabas;
                } else if (estado.faixaSerie === "1-2") {
                    infoDetalhada = "Lê de 11 a 25 palavras/min. Decodificação básica.";
                } else if (estado.faixaSerie === "3-5") {
                    infoDetalhada = "Lê 21 a 39 palavras/min. Foco em decodificação.";
                } else {
                    infoDetalhada = "Lê 51 a 80 palavras/min. Foco em decodificação e fluência.";
                }
            } else if (nivelSugerido === 3) {
                descricaoNivel = "NÍVEL 3 - LEITOR DE PALAVRAS";
                corNivel = "#FBBF24"; // Amarelo
                if (estado.regras) {
                    infoDetalhada = `Lê de ${estado.regras.palavrasPorMinutoMinimo.leitorPalavras} a ${estado.regras.palavrasPorMinutoMinimo.maxLeitorPalavras} palavras/min. `;
                    if (estado.pseudopalavrasLidas < estado.regras.pseudopalavrasMinimo.leitorPalavras) {
                        infoDetalhada += `Atenção: leu apenas ${estado.pseudopalavrasLidas} pseudopalavras (mínimo esperado: ${estado.regras.pseudopalavrasMinimo.leitorPalavras}).`;
                    } else {
                        infoDetalhada += "Desenvolver fluência.";
                    }
                } else if (estado.faixaSerie === "1-2") {
                    infoDetalhada = "Lê de 26 a 35 palavras/min. Atenção à fluência.";
                } else if (estado.faixaSerie === "3-5") {
                    infoDetalhada = "Lê 40 a 69 palavras/min. Fluência emergente.";
                } else {
                    infoDetalhada = "Lê 81 a 110 palavras/min. Leitura autônoma em desenvolvimento.";
                }
            } else if (nivelSugerido === 4) {
                descricaoNivel = "NÍVEL 4 - LEITOR DE FRASES";
                corNivel = "#34D399"; // Verde claro
                if (estado.regras) {
                    infoDetalhada = `Lê de ${estado.regras.palavrasPorMinutoMinimo.leitorFrases} a ${estado.regras.palavrasPorMinutoMinimo.maxLeitorFrases} palavras/min. `;
                    if (estado.pseudopalavrasLidas < estado.regras.pseudopalavrasMinimo.leitorFrases) {
                        infoDetalhada += `Atenção: leu apenas ${estado.pseudopalavrasLidas} pseudopalavras (mínimo esperado: ${estado.regras.pseudopalavrasMinimo.leitorFrases}).`;
                    } else {
                        infoDetalhada += "Ritmo ainda comprometido.";
                    }
                } else if (estado.faixaSerie === "1-2") {
                    infoDetalhada = "Lê de 36 a 44 palavras/min. Ritmo comprometido.";
                } else if (estado.faixaSerie === "3-5") {
                    infoDetalhada = "Lê 70 a 89 palavras/min. Precisa ajustar entonação.";
                } else {
                    infoDetalhada = "Lê 111 a 130 palavras/min. Ritmo ainda comprometido.";
                }
            } else if (nivelSugerido === 5) {
                descricaoNivel = "NÍVEL 5 - LEITOR DE TEXTO SEM FLUÊNCIA";
                corNivel = "#22D3EE"; // Azul claro
                if (estado.regras) {
                    infoDetalhada = `Lê de ${estado.regras.palavrasPorMinutoMinimo.leitorTextoSemFluencia} a ${estado.regras.palavrasPorMinutoMinimo.maxLeitorTextoSemFluencia} palavras/min. `;
                    if (estado.pseudopalavrasLidas < estado.regras.pseudopalavrasMinimo.leitorTextoSemFluencia) {
                        infoDetalhada += `Atenção: leu apenas ${estado.pseudopalavrasLidas} pseudopalavras (mínimo esperado: ${estado.regras.pseudopalavrasMinimo.leitorTextoSemFluencia}).`;
                    } else {
                        infoDetalhada += "Boa base.";
                    }
                } else if (estado.faixaSerie === "1-2") {
                    infoDetalhada = "Lê de 45 a 59 palavras/min. Leitura funcional.";
                } else if (estado.faixaSerie === "3-5") {
                    infoDetalhada = "Lê 90 a 109 palavras/min. Boa base.";
                } else {
                    infoDetalhada = "Lê 131 a 160 palavras/min. Boa base, mas fluência limitada.";
                }
            } else {
                descricaoNivel = "NÍVEL 6 - LEITOR DE TEXTO COM FLUÊNCIA";
                corNivel = "#2563EB"; // Azul
                if (estado.regras) {
                    infoDetalhada = `Lê ${estado.regras.palavrasPorMinutoMinimo.leitorTextoComFluencia}+ palavras/min. `;
                    if (estado.pseudopalavrasLidas < estado.regras.pseudopalavrasMinimo.leitorTextoComFluencia) {
                        infoDetalhada += `Atenção: leu apenas ${estado.pseudopalavrasLidas} pseudopalavras (mínimo esperado: ${estado.regras.pseudopalavrasMinimo.leitorTextoComFluencia}).`;
                    } else {
                        infoDetalhada += "Leitura fluente.";
                    }
                } else if (estado.faixaSerie === "1-2") {
                    infoDetalhada = "Lê ≥ 60 palavras/min. Leitura fluente.";
                } else if (estado.faixaSerie === "3-5") {
                    infoDetalhada = "Lê ≥ 110 palavras/min. Leitura fluente.";
                } else {
                    infoDetalhada = "Lê mais de 160 palavras/min. Leitura fluente e compreensiva.";
                }
            }
            
            // Adicionar métricas detalhadas
            infoDetalhada += ` PPM: ${ppm}.`;
            if (estado.pseudopalavrasLidas > 0) {
                infoDetalhada += ` Pseudopalavras lidas: ${estado.pseudopalavrasLidas}.`;
            }
            
            // Atualizar elementos da interface
            if (DOM.resultados.nivelLeitor) {
                DOM.resultados.nivelLeitor.textContent = descricaoNivel;
                DOM.resultados.nivelLeitor.style.color = corNivel;
                DOM.resultados.nivelLeitor.className = "text-2xl font-bold mb-2";
            }
            
            if (DOM.resultados.descricaoNivel) {
                DOM.resultados.descricaoNivel.textContent = infoDetalhada;
                DOM.resultados.descricaoNivel.className = "text-gray-700 mb-4";
            }
            
            if (DOM.resultados.progresso) {
                DOM.resultados.progresso.style.width = `${(nivelSugerido / 6) * 100}%`;
                DOM.resultados.progresso.style.backgroundColor = corNivel;
            }
            
            // Gerar recomendações pedagógicas
            const recomendacoes = gerarRecomendacoes(nivelSugerido);
            
            if (DOM.resultados.observacoes) {
                DOM.resultados.observacoes.innerHTML = `<strong>Recomendações:</strong><br>• ${recomendacoes.join('<br>• ')}`;
            }
            
            // Armazenar nível para uso posterior
            window.nivelLeitorSugerido = nivelSugerido;
            window.descricaoNivelLeitor = descricaoNivel;
            
            console.log('Nível de leitura calculado com sucesso');
        } catch (error) {
            console.error('Erro ao sugerir nível de leitura:', error);
            mostrarErro('Não foi possível calcular o nível de leitura sugerido.');
        }
    }
    
    /**
     * Determina o nível baseado na faixa de série e palavras lidas
     * @param {string} faixaSerie - Faixa de série do aluno
     * @returns {number} Nível sugerido (0-6)
     */
    function determinarNivelGenerico(faixaSerie) {
        // Se não leu nenhuma palavra
        if (estado.palavrasLidas === 0) {
            return 0; // Não Avaliado
        }
        
        // Calcular palavras por minuto
        const ppm = Math.round((estado.palavrasLidas / 60) * 60);
        
        // Verificar se existem regras específicas para a série
        if (estado.regras) {
            const regras = estado.regras;
            
            // Aplicar regras específicas para determinar o nível
            if (ppm <= regras.palavrasPorMinutoMinimo.maxNaoLeitor) {
                return 1; // Não Leitor
            } else if (ppm >= regras.palavrasPorMinutoMinimo.leitorSilabas && ppm <= regras.palavrasPorMinutoMinimo.maxLeitorSilabas) {
                return 2; // Leitor de Sílabas
            } else if (ppm >= regras.palavrasPorMinutoMinimo.leitorPalavras && ppm <= regras.palavrasPorMinutoMinimo.maxLeitorPalavras) {
                return 3; // Leitor de Palavras
            } else if (ppm >= regras.palavrasPorMinutoMinimo.leitorFrases && ppm <= regras.palavrasPorMinutoMinimo.maxLeitorFrases) {
                return 4; // Leitor de Frases
            } else if (ppm >= regras.palavrasPorMinutoMinimo.leitorTextoSemFluencia && ppm <= regras.palavrasPorMinutoMinimo.maxLeitorTextoSemFluencia) {
                return 5; // Leitor de Texto sem Fluência
            } else if (ppm >= regras.palavrasPorMinutoMinimo.leitorTextoComFluencia) {
                return 6; // Leitor de Texto com Fluência
            }
        }
        
        // Se não há regras específicas, usar regras padrão baseadas na faixa de série
        if (faixaSerie === "1-2") {
            // Regras para 1º e 2º anos
            if (ppm <= 10) return 1; // Não Leitor
            if (ppm <= 25) return 2; // Leitor de Sílabas
            if (ppm <= 35) return 3; // Leitor de Palavras
            if (ppm <= 44) return 4; // Leitor de Frases
            if (ppm <= 59) return 5; // Leitor de Texto sem Fluência
            return 6; // Leitor de Texto com Fluência
        } else if (faixaSerie === "3-5") {
            // Regras para 3º ao 5º anos
            if (ppm <= 20) return 1; // Não Leitor
            if (ppm <= 39) return 2; // Leitor de Sílabas
            if (ppm <= 69) return 3; // Leitor de Palavras
            if (ppm <= 89) return 4; // Leitor de Frases
            if (ppm <= 109) return 5; // Leitor de Texto sem Fluência
            return 6; // Leitor de Texto com Fluência
        } else { // 6-9
            // Regras para 6º ao 9º anos
            if (ppm <= 50) return 1; // Não Leitor
            if (ppm <= 80) return 2; // Leitor de Sílabas
            if (ppm <= 110) return 3; // Leitor de Palavras
            if (ppm <= 130) return 4; // Leitor de Frases
            if (ppm <= 160) return 5; // Leitor de Texto sem Fluência
            return 6; // Leitor de Texto com Fluência
        }
    }
    
    /**
     * Gera recomendações pedagógicas baseadas no nível do aluno
     * @param {number} nivel - Nível do aluno (0-6)
     * @returns {Array} Lista de recomendações
     */
    function gerarRecomendacoes(nivel) {
        const recomendacoes = [];
        
        if (nivel <= 2) {
            // Recomendações para níveis iniciais
            recomendacoes.push("Intervenção intensiva necessária");
            recomendacoes.push("Desenvolvimento de consciência fonológica");
            recomendacoes.push("Atividades de associação letra-som");
            recomendacoes.push("Trabalho com sílabas simples e complexas");
            recomendacoes.push("Leitura diária de palavras isoladas");
        } else if (nivel <= 4) {
            // Recomendações para níveis intermediários
            recomendacoes.push("Prática de leitura diária");
            recomendacoes.push("Atividades de compreensão textual");
            recomendacoes.push("Trabalho com diferentes gêneros textuais");
            recomendacoes.push("Exercícios de fluência e ritmo");
            recomendacoes.push("Atividades de reconhecimento rápido de palavras");
        } else {
            // Recomendações para níveis avançados
            recomendacoes.push("Estímulo à leitura de textos mais complexos");
            recomendacoes.push("Atividades de interpretação crítica");
            recomendacoes.push("Ampliação do vocabulário");
            recomendacoes.push("Leitura dramatizada para melhorar a expressão");
            recomendacoes.push("Produção textual relacionada às leituras");
        }
        
        return recomendacoes;
    }
    
    // ===================================================
    // FUNÇÕES UTILITÁRIAS
    // ===================================================
    
    /**
     * Exibe uma mensagem de erro ao usuário
     * @param {string} mensagem - Mensagem a ser exibida
     */
    function mostrarErro(mensagem) {
        alert(mensagem);
    }
    
    /**
     * Exibe uma mensagem informativa ao usuário
     * @param {string} mensagem - Mensagem a ser exibida
     */
    function mostrarMensagem(mensagem) {
        alert(mensagem);
    }
})();
