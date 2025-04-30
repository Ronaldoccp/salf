document.addEventListener('DOMContentLoaded', function() {
    // ==========================================
    // CONFIGURAÇÃO INICIAL E REFERÊNCIAS DOM
    // ==========================================
    
    // Referências às etapas principais
    const elementos = {
        // Containers de etapas
        selecaoAluno: document.getElementById('selecao-aluno'),
        etapaPalavras: document.getElementById('etapa-palavras'),
        etapaPseudopalavras: document.getElementById('etapa-pseudopalavras'),
        etapaFrases: document.getElementById('etapa-frases'),
        etapaTexto: document.getElementById('etapa-texto'),
        etapaInterpretacao: document.getElementById('etapa-interpretacao'),
        etapaResultado: document.getElementById('etapa-resultado'),
        
        // Selects para seleção de aluno
        eventoSelect: document.getElementById('evento-avaliacao'),
        escolaSelect: document.getElementById('escola-aluno'),
        turmaSelect: document.getElementById('turma-aluno'),
        alunoSelect: document.getElementById('aluno'),
        
        // Botões principais
        iniciarAvaliacaoBtn: document.getElementById('iniciar-avaliacao'),
        salvarAvaliacaoBtn: document.getElementById('salvar-avaliacao'),
        btnDebugCarregarTurmas: document.getElementById('btn-debug-carregar-turmas'),
        
        // Timers
        timerPalavras: document.getElementById('timer-palavras'),
        timerPseudopalavras: document.getElementById('timer-pseudopalavras'),
        timerFrases: document.getElementById('timer-frases'),
        timerTexto: document.getElementById('timer-texto'),
        
        // Botões de iniciar timer
        iniciarTimerPalavrasBtn: document.getElementById('iniciar-timer-palavras'),
        iniciarTimerPseudopalavrasBtn: document.getElementById('iniciar-timer-pseudopalavras'),
        iniciarTimerFrasesBtn: document.getElementById('iniciar-timer-frases'),
        iniciarTimerTextoBtn: document.getElementById('iniciar-timer-texto'),
        
        // Botões de avançar etapa
        proximoEtapaPalavrasBtn: document.getElementById('proximo-etapa-palavras'),
        proximoEtapaPseudopalavrasBtn: document.getElementById('proximo-etapa-pseudopalavras'),
        proximoEtapaFrasesBtn: document.getElementById('proximo-etapa-frases'),
        proximoEtapaTextoBtn: document.getElementById('proximo-etapa-texto'),
        finalizarAvaliacaoBtn: document.getElementById('finalizar-avaliacao'),
        
        // Contadores
        totalPalavrasLidas: document.getElementById('total-palavras-lidas'),
        totalPalavras: document.getElementById('total-palavras'),
        totalPseudopalavrasLidas: document.getElementById('total-pseudopalavras-lidas'),
        totalPseudopalavras: document.getElementById('total-pseudopalavras'),
        totalFrasesLidas: document.getElementById('total-frases-lidas'),
        totalFrases: document.getElementById('total-frases'),
        totalLinhasLidas: document.getElementById('total-linhas-lidas'),
        totalLinhas: document.getElementById('total-linhas'),
        totalRespostasCorretas: document.getElementById('total-respostas-corretas'),
        totalQuestoes: document.getElementById('total-questoes'),
        
        // Resultados
        resultadoPalavras: document.getElementById('resultado-palavras'),
        resultadoPseudopalavras: document.getElementById('resultado-pseudopalavras'),
        resultadoTexto: document.getElementById('resultado-texto'),
        resultadoInterpretacao: document.getElementById('resultado-interpretacao'),
        resultadoTotalQuestoes: document.getElementById('resultado-total-questoes')
    };
    
    // ==========================================
    // DADOS PARA SIMULAÇÃO
    // ==========================================
    
    // Base de dados simulada (em uma aplicação real, estes dados viriam de uma API)
    const dados = {
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
    
    // ==========================================
    // VARIÁVEIS DE ESTADO
    // ==========================================
    
    // Estado atual da avaliação
    const estado = {
        avaliacaoAtual: null,
        alunoAtual: null,
        palavrasLidas: 0,
        pseudopalavrasLidas: 0,
        frasesLidas: 0,
        linhasLidas: 0,
        respostasCorretas: 0,
        faixaSerie: null,
        timers: {
            palavras: null,
            pseudopalavras: null,
            frases: null,
            texto: null
        }
    };
    
    console.log("Documento carregado. Iniciando setup da página de avaliação...");
    
    // Verificar dados iniciais
    console.log("Verificando dados iniciais:");
    console.log("- Escolas:", typeof dados.escolas, Array.isArray(dados.escolas) ? dados.escolas.length : "não é array", dados.escolas);
    console.log("- Turmas:", typeof dados.turmas, Array.isArray(dados.turmas) ? dados.turmas.length : "não é array", dados.turmas);
    console.log("- Alunos:", typeof dados.alunos, Array.isArray(dados.alunos) ? dados.alunos.length : "não é array", dados.alunos);
    console.log("- Avaliações:", typeof dados.avaliacoes, Array.isArray(dados.avaliacoes) ? dados.avaliacoes.length : "não é array", dados.avaliacoes);
    
    // Verificar referências aos elementos principais
    console.log("Verificando referências aos elementos:");
    console.log("- selecaoAluno:", elementos.selecaoAluno);
    console.log("- escolaSelect:", elementos.escolaSelect);
    console.log("- turmaSelect:", elementos.turmaSelect);
    console.log("- alunoSelect:", elementos.alunoSelect);
    console.log("- eventoSelect:", elementos.eventoSelect);
    console.log("- iniciarAvaliacaoBtn:", elementos.iniciarAvaliacaoBtn);
    
    if (!elementos.escolaSelect) {
        console.error("ERRO CRÍTICO: Elemento 'escola-aluno' não encontrado na página!");
        alert("Erro: O formulário não pode ser inicializado corretamente. Por favor, recarregue a página.");
        return;
    }
    
    if (!elementos.turmaSelect) {
        console.error("ERRO CRÍTICO: Elemento 'turma-aluno' não encontrado na página!");
        alert("Erro: O formulário não pode ser inicializado corretamente. Por favor, recarregue a página.");
        return;
    }
    
    // Event Listeners
    console.log("Elemento escolaSelect:", elementos.escolaSelect);
    elementos.escolaSelect.addEventListener('change', function() {
        console.log("Evento change disparado em escolaSelect");
        carregarTurmas();
    });
    
    // Adicionar event listener para o botão de debug
    if (elementos.btnDebugCarregarTurmas) {
        elementos.btnDebugCarregarTurmas.addEventListener('click', function() {
            console.log("Botão de debug clicado");
            
            // Método alternativo para carregar turmas diretamente - sem usar a função carregarTurmas
            try {
                console.log("Carregando turmas via método alternativo...");
                const escolaId = parseInt(elementos.escolaSelect.value);
                console.log("Escola ID selecionada:", escolaId);
                
                if (!escolaId) {
                    alert("Por favor, selecione uma escola primeiro");
                    return;
                }
                
                // Limpar os selects
                elementos.turmaSelect.innerHTML = '<option value="">Selecione uma turma</option>';
                elementos.alunoSelect.innerHTML = '<option value="">Selecione um aluno</option>';
                
                // Filtrar as turmas manualmente
                console.log("Todas as turmas:", dados.turmas);
                const turmasFiltradas = [];
                for (let i = 0; i < dados.turmas.length; i++) {
                    if (dados.turmas[i].escola_id === escolaId) {
                        turmasFiltradas.push(dados.turmas[i]);
                    }
                }
                console.log("Turmas filtradas manualmente:", turmasFiltradas);
                
                // Adicionar as opções ao select
                turmasFiltradas.forEach(turma => {
                    const option = document.createElement('option');
                    option.value = turma.id;
                    option.textContent = `${turma.nome} (${turma.serie})`;
                    elementos.turmaSelect.appendChild(option);
                });
                
                console.log("Turmas carregadas com sucesso!");
                alert(`Foram carregadas ${turmasFiltradas.length} turmas para esta escola.`);
            } catch (error) {
                console.error("Erro ao carregar turmas:", error);
                alert("Erro ao carregar turmas: " + error.message);
            }
        });
    } else {
        console.error("Botão de debug não encontrado!");
    }
    
    elementos.turmaSelect.addEventListener('change', carregarAlunos);
    elementos.iniciarAvaliacaoBtn.addEventListener('click', iniciarAvaliacao);
    
    elementos.iniciarTimerPalavrasBtn.addEventListener('click', () => iniciarTimer('palavras'));
    elementos.iniciarTimerPseudopalavrasBtn.addEventListener('click', () => iniciarTimer('pseudopalavras'));
    elementos.iniciarTimerFrasesBtn.addEventListener('click', () => iniciarTimer('frases'));
    elementos.iniciarTimerTextoBtn.addEventListener('click', () => iniciarTimer('texto'));
    
    elementos.proximoEtapaPalavrasBtn.addEventListener('click', () => mudarEtapa('palavras', 'pseudopalavras'));
    elementos.proximoEtapaPseudopalavrasBtn.addEventListener('click', () => mudarEtapa('pseudopalavras', 'frases'));
    elementos.proximoEtapaFrasesBtn.addEventListener('click', () => mudarEtapa('frases', 'texto'));
    elementos.proximoEtapaTextoBtn.addEventListener('click', () => mudarEtapa('texto', 'interpretacao'));
    elementos.finalizarAvaliacaoBtn.addEventListener('click', finalizarAvaliacao);
    
    elementos.salvarAvaliacaoBtn.addEventListener('click', salvarAvaliacao);
    
    // Funções
    function carregarTurmas() {
        try {
            console.log("Função carregarTurmas foi chamada");
            const escolaId = parseInt(elementos.escolaSelect.value);
            console.log("Escola selecionada (ID):", escolaId);
            console.log("Valor original do select:", elementos.escolaSelect.value);
            console.log("Turmas disponíveis:", dados.turmas);
            
            if (isNaN(escolaId)) {
                console.warn("ID da escola não é um número válido");
                elementos.turmaSelect.innerHTML = '<option value="">Selecione uma escola primeiro</option>';
                elementos.alunoSelect.innerHTML = '<option value="">Selecione um aluno</option>';
                return;
            }
            
            // Limpar os selects
            elementos.turmaSelect.innerHTML = '<option value="">Selecione uma turma</option>';
            elementos.alunoSelect.innerHTML = '<option value="">Selecione um aluno</option>';
            
            // Verificar se o array de turmas existe e tem elementos
            if (!dados.turmas || !Array.isArray(dados.turmas) || dados.turmas.length === 0) {
                console.error("Array de turmas inválido ou vazio:", dados.turmas);
                alert("Erro: Não foram encontradas turmas no sistema.");
                return;
            }
            
            // Log de todas as turmas para debug
            dados.turmas.forEach((turma, index) => {
                console.log(`Turma ${index}:`, turma);
            });
            
            // Filtrar as turmas pela escola selecionada
            const turmasFiltradas = dados.turmas.filter(turma => {
                console.log(`Comparando turma.escola_id (${turma.escola_id}) com escolaId (${escolaId}):`, turma.escola_id === escolaId);
                return turma.escola_id === escolaId;
            });
            
            console.log("Turmas filtradas:", turmasFiltradas);
            
            if (turmasFiltradas.length === 0) {
                console.warn("Nenhuma turma encontrada para esta escola");
                const option = document.createElement('option');
                option.value = "";
                option.textContent = "Nenhuma turma encontrada";
                elementos.turmaSelect.appendChild(option);
                return;
            }
            
            // Adicionar as opções ao select
            turmasFiltradas.forEach(turma => {
                const option = document.createElement('option');
                option.value = turma.id;
                option.textContent = `${turma.nome} (${turma.serie})`;
                elementos.turmaSelect.appendChild(option);
                console.log("Opção adicionada:", option.value, option.textContent);
            });
            
            console.log("Seletor de turmas atualizado. Total de opções:", elementos.turmaSelect.options.length);
        } catch (error) {
            console.error("Erro na função carregarTurmas:", error);
            alert("Ocorreu um erro ao carregar as turmas: " + error.message);
        }
    }
    
    function carregarAlunos() {
        console.log("Função carregarAlunos foi chamada");
        const turmaId = parseInt(elementos.turmaSelect.value);
        elementos.alunoSelect.innerHTML = '<option value="">Selecione um aluno</option>';
        
        if (turmaId) {
            // Determinar a faixa de série com base na turma selecionada
            const turmaSelecionada = dados.turmas.find(turma => turma.id === turmaId);
            console.log("Turma selecionada:", turmaSelecionada);
            
            if (turmaSelecionada) {
                const serie = turmaSelecionada.serie;
                // Extrair apenas o número da série
                const match = serie.match(/\d+/);
                let numeroSerie = 1; // valor padrão
                
                if (match && match[0]) {
                    numeroSerie = parseInt(match[0]);
                } else {
                    console.log("Não foi possível extrair o número da série:", serie);
                }
                
                if (numeroSerie <= 2) {
                    estado.faixaSerie = "1-2";
                } else if (numeroSerie <= 5) {
                    estado.faixaSerie = "3-5";
                } else {
                    estado.faixaSerie = "6-9";
                }
                
                console.log(`Faixa de série determinada: ${estado.faixaSerie} (Série: ${serie}, Número: ${numeroSerie})`);
            }
            
            const alunosFiltrados = dados.alunos.filter(aluno => aluno.turma_id === turmaId);
            console.log("Alunos filtrados:", alunosFiltrados);
            
            alunosFiltrados.forEach(aluno => {
                const option = document.createElement('option');
                option.value = aluno.id;
                option.textContent = `${aluno.nome} (${aluno.matricula})`;
                elementos.alunoSelect.appendChild(option);
            });
        }
    }
    
    function iniciarAvaliacao() {
        console.log("Função iniciarAvaliacao foi chamada");
        const eventoId = parseInt(elementos.eventoSelect.value);
        const alunoId = parseInt(elementos.alunoSelect.value);
        
        if (!eventoId || !alunoId) {
            alert('Por favor, selecione um evento de avaliação e um aluno.');
            return;
        }
        
        // Obter a avaliação e o aluno
        estado.avaliacaoAtual = dados.avaliacoes.find(a => a.id === eventoId);
        estado.alunoAtual = dados.alunos.find(a => a.id === alunoId);
        
        if (!estado.avaliacaoAtual || !estado.alunoAtual) {
            alert('Erro ao carregar os dados da avaliação.');
            return;
        }
        
        // Encontrar a turma do aluno para determinar a faixa de série
        const turmaAluno = dados.turmas.find(t => t.id === estado.alunoAtual.turma_id);
        if (turmaAluno) {
            // Determinar a faixa de série com base no ano escolar da turma
            const serie = turmaAluno.serie;
            // Extrair apenas o número da série
            const match = serie.match(/\d+/);
            let numeroSerie = 1; // valor padrão
            
            if (match && match[0]) {
                numeroSerie = parseInt(match[0]);
            } else {
                console.log("Não foi possível extrair o número da série:", serie);
            }
            
            if (numeroSerie <= 2) {
                estado.faixaSerie = "1-2";
            } else if (numeroSerie <= 5) {
                estado.faixaSerie = "3-5";
            } else {
                estado.faixaSerie = "6-9";
            }
            
            console.log(`Faixa de série determinada: ${estado.faixaSerie} (Série: ${serie}, Número: ${numeroSerie})`);
        }
        
        // Preparar a primeira etapa
        prepararEtapaPalavras();
        
        // Mostrar a etapa de palavras e esconder a seleção de aluno
        elementos.selecaoAluno.classList.add('hidden');
        elementos.etapaPalavras.classList.remove('hidden');
    }
    
    function prepararEtapaPalavras() {
        const containerPalavras = elementos.etapaPalavras.querySelector('.grid');
        containerPalavras.innerHTML = '';
        
        // Adicionar as palavras ao container
        estado.avaliacaoAtual.palavras.forEach((palavra, index) => {
            const div = document.createElement('div');
            div.className = 'border rounded p-2 flex items-center palavra-item bg-yellow-100 cursor-not-allowed transition-colors';
            div.setAttribute('data-index', index);
            div.innerHTML = `<span class="text-sm text-gray-800 select-none w-full text-center">${palavra}</span>`;
            
            // Adicionar evento de clique diretamente no div (em vez de checkbox)
            div.addEventListener('click', function(e) {
                // Não permitir marcação até que o cronômetro esteja ativo
                if (!estado.timers['palavras']) {
                    e.preventDefault();
                    alert('Por favor, inicie o cronômetro antes de começar a marcar as palavras.');
                    return;
                }
                
                if (!this.classList.contains('bg-green-200') && !this.classList.contains('bg-red-200')) {
                    this.classList.remove('bg-yellow-100', 'hover:bg-yellow-200', 'cursor-not-allowed');
                    this.classList.add('bg-green-200');
                    atualizarContadorPalavras();
                }
            });
            
            containerPalavras.appendChild(div);
        });
        
        // Atualizar o contador total
        elementos.totalPalavras.textContent = estado.avaliacaoAtual.palavras.length;
    }
    
    function prepararEtapaPseudopalavras() {
        const containerPseudopalavras = elementos.etapaPseudopalavras.querySelector('.grid');
        containerPseudopalavras.innerHTML = '';
        
        // Adicionar as pseudopalavras ao container
        estado.avaliacaoAtual.pseudopalavras.forEach((palavra, index) => {
            const div = document.createElement('div');
            div.className = 'border rounded p-2 flex items-center pseudopalavra-item bg-yellow-100 cursor-not-allowed transition-colors';
            div.setAttribute('data-index', index);
            div.innerHTML = `<span class="text-sm text-gray-800 select-none w-full text-center">${palavra}</span>`;
            
            // Adicionar evento de clique diretamente no div
            div.addEventListener('click', function(e) {
                // Não permitir marcação até que o cronômetro esteja ativo
                if (!estado.timers['pseudopalavras']) {
                    e.preventDefault();
                    alert('Por favor, inicie o cronômetro antes de começar a marcar as pseudopalavras.');
                    return;
                }
                
                if (!this.classList.contains('bg-green-200') && !this.classList.contains('bg-red-200')) {
                    this.classList.remove('bg-yellow-100', 'hover:bg-yellow-200', 'cursor-not-allowed');
                    this.classList.add('bg-green-200');
                    atualizarContadorPseudopalavras();
                }
            });
            
            containerPseudopalavras.appendChild(div);
        });
        
        // Atualizar o contador total
        elementos.totalPseudopalavras.textContent = estado.avaliacaoAtual.pseudopalavras.length;
    }
    
    function prepararEtapaFrases() {
        const containerFrases = document.getElementById('frases-container');
        containerFrases.innerHTML = '';
        
        // Adicionar as frases ao container
        estado.avaliacaoAtual.frases.forEach((frase, index) => {
            const div = document.createElement('div');
            div.className = 'border rounded p-3 flex items-center frase-item bg-yellow-100 cursor-not-allowed transition-colors';
            div.setAttribute('data-index', index);
            div.innerHTML = `<span class="text-sm text-gray-800 select-none w-full">${frase}</span>`;
            
            // Adicionar evento de clique diretamente no div
            div.addEventListener('click', function(e) {
                // Não permitir marcação até que o cronômetro esteja ativo
                if (!estado.timers['frases']) {
                    e.preventDefault();
                    alert('Por favor, inicie o cronômetro antes de começar a marcar as frases.');
                    return;
                }
                
                if (!this.classList.contains('bg-green-200') && !this.classList.contains('bg-red-200')) {
                    this.classList.remove('bg-yellow-100', 'hover:bg-yellow-200', 'cursor-not-allowed');
                    this.classList.add('bg-green-200');
                    atualizarContadorFrases();
                }
            });
            
            containerFrases.appendChild(div);
        });
        
        // Atualizar o contador total
        elementos.totalFrases.textContent = estado.avaliacaoAtual.frases.length;
    }
    
    function prepararEtapaTexto() {
        const containerTexto = document.getElementById('texto-container');
        containerTexto.innerHTML = '';
        
        // Dividir o texto em linhas (aproximadamente 10 palavras por linha)
        const palavras = estado.avaliacaoAtual.texto.split(' ');
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
            
            // Adicionar evento de clique diretamente no div
            div.addEventListener('click', function(e) {
                // Não permitir marcação até que o cronômetro esteja ativo
                if (!estado.timers['texto']) {
                    e.preventDefault();
                    alert('Por favor, inicie o cronômetro antes de começar a marcar as linhas de texto.');
                    return;
                }
                
                if (!this.classList.contains('bg-green-200') && !this.classList.contains('bg-red-200')) {
                    this.classList.remove('bg-yellow-100', 'hover:bg-yellow-200', 'cursor-not-allowed');
                    this.classList.add('bg-green-200');
                    atualizarContadorLinhas();
                }
            });
            
            containerTexto.appendChild(div);
        });
        
        // Atualizar o contador total
        elementos.totalLinhas.textContent = linhas.length;
    }
    
    function atualizarContadorPalavras() {
        const itensVerdes = elementos.etapaPalavras.querySelectorAll('.palavra-item.bg-green-200');
        estado.palavrasLidas = itensVerdes.length;
        elementos.totalPalavrasLidas.textContent = estado.palavrasLidas;
    }
    
    function atualizarContadorPseudopalavras() {
        const itensVerdes = elementos.etapaPseudopalavras.querySelectorAll('.pseudopalavra-item.bg-green-200');
        estado.pseudopalavrasLidas = itensVerdes.length;
        elementos.totalPseudopalavrasLidas.textContent = estado.pseudopalavrasLidas;
    }
    
    function atualizarContadorFrases() {
        const itensVerdes = document.querySelectorAll('.frase-item.bg-green-200');
        estado.frasesLidas = itensVerdes.length;
        elementos.totalFrasesLidas.textContent = estado.frasesLidas;
    }
    
    function atualizarContadorLinhas() {
        const itensVerdes = document.querySelectorAll('.linha-texto-item.bg-green-200');
        estado.linhasLidas = itensVerdes.length;
        elementos.totalLinhasLidas.textContent = estado.linhasLidas;
    }
    
    function iniciarTimer(etapa) {
        let segundosRestantes = 60;
        const timerElement = document.getElementById(`timer-${etapa}`);
        const btnElement = document.getElementById(`iniciar-timer-${etapa}`);
        
        // Desabilitar o botão
        btnElement.disabled = true;
        btnElement.classList.add('bg-gray-400');
        btnElement.classList.remove('bg-blue-600', 'hover:bg-blue-700');
        btnElement.textContent = 'Cronômetro iniciado';
        
        // Habilitar os itens desta etapa para cliques
        habilitarCliques(etapa);
        
        // Atualizar o timer a cada segundo
        estado.timers[etapa] = setInterval(() => {
            segundosRestantes--;
            
            // Formatar o tempo restante (MM:SS)
            const minutos = Math.floor(segundosRestantes / 60);
            const segundos = segundosRestantes % 60;
            timerElement.textContent = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
            
            // Se o tempo acabar, parar o timer
            if (segundosRestantes <= 0) {
                clearInterval(estado.timers[etapa]);
                timerElement.textContent = '00:00';
                
                // Marcar os itens não clicados como vermelhos
                marcarNaoLidos(etapa);
                
                // Mostrar alerta
                alert('Tempo esgotado! Por favor, avance para a próxima etapa.');
            }
        }, 1000);
    }
    
    // Função para habilitar os cliques nos itens
    function habilitarCliques(etapa) {
        let items;
        
        if (etapa === 'palavras') {
            items = document.querySelectorAll('.palavra-item');
        } else if (etapa === 'pseudopalavras') {
            items = document.querySelectorAll('.pseudopalavra-item');
        } else if (etapa === 'frases') {
            items = document.querySelectorAll('.frase-item');
        } else if (etapa === 'texto') {
            items = document.querySelectorAll('.linha-texto-item');
        }
        
        if (items) {
            items.forEach(item => {
                // Remover classe de cursor-not-allowed e adicionar classe de hover
                item.classList.remove('cursor-not-allowed');
                item.classList.add('hover:bg-yellow-200', 'cursor-pointer');
                item.style.pointerEvents = 'auto'; // Habilita interações de clique
            });
        }
    }
    
    // Função para marcar os itens não clicados como vermelhos (não lidos)
    function marcarNaoLidos(etapa) {
        let items;
        
        if (etapa === 'palavras') {
            items = document.querySelectorAll('.palavra-item:not(.bg-green-200)');
        } else if (etapa === 'pseudopalavras') {
            items = document.querySelectorAll('.pseudopalavra-item:not(.bg-green-200)');
        } else if (etapa === 'frases') {
            items = document.querySelectorAll('.frase-item:not(.bg-green-200)');
        } else if (etapa === 'texto') {
            items = document.querySelectorAll('.linha-texto-item:not(.bg-green-200)');
        }
        
        if (items) {
            items.forEach(item => {
                item.classList.remove('bg-yellow-100', 'hover:bg-yellow-200');
                item.classList.add('bg-red-200');
                item.style.pointerEvents = 'none'; // Desabilita interações futuras
            });
        }
    }
    
    function prepararEtapaInterpretacao() {
        try {
            const containerQuestoes = document.getElementById('questoes-container');
            containerQuestoes.innerHTML = '';
            
            // Adicionar questões ao container
            estado.avaliacaoAtual.questoes.forEach((questao, qIndex) => {
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
                containerQuestoes.appendChild(div);
            });
            
            // Configurar eventos para os radio buttons
            const radios = containerQuestoes.querySelectorAll('.questao-opcao');
            radios.forEach(radio => {
                radio.addEventListener('change', atualizarContadorRespostas);
            });
            
            // Atualizar contador total
            elementos.totalQuestoes.textContent = estado.avaliacaoAtual.questoes.length;
        } catch (error) {
            console.error("Erro ao preparar etapa de interpretação:", error);
            alert("Ocorreu um erro ao preparar a etapa de interpretação.");
        }
    }
    
    function atualizarContadorRespostas() {
        estado.respostasCorretas = 0;
        
        // Verificar respostas selecionadas
        estado.avaliacaoAtual.questoes.forEach((questao, index) => {
            const selecionada = document.querySelector(`input[name="questao-${index}"]:checked`);
            
            if (selecionada && parseInt(selecionada.value) === questao.respostaCorreta) {
                estado.respostasCorretas++;
            }
        });
        
        elementos.totalRespostasCorretas.textContent = estado.respostasCorretas;
    }
    
    // ==========================================
    // FUNÇÕES DE NAVEGAÇÃO E FINALIZAÇÃO
    // ==========================================
    
    // Mudar de uma etapa para outra
    function mudarEtapa(etapaAtual, proximaEtapa) {
        // Parar timer da etapa atual se estiver rodando
        if (estado.timers[etapaAtual]) {
            clearInterval(estado.timers[etapaAtual]);
        }
        
        // Verificar condições especiais baseadas na etapa atual
        if (etapaAtual === 'palavras') {
            // Se o aluno não leu palavras ou leu muito poucas (perfil não leitor)
            if (estado.palavrasLidas <= 10) {
                let mensagem = estado.palavrasLidas === 0 
                    ? "ATENÇÃO: O aluno não leu nenhuma palavra, o que corresponde ao perfil NÍVEL 0 - NÃO AVALIADO. A avaliação será finalizada automaticamente."
                    : `ATENÇÃO: O aluno leu apenas ${estado.palavrasLidas} palavra(s), o que corresponde ao perfil NÍVEL 1 - NÃO LEITOR. A avaliação será finalizada automaticamente.`;
                
                alert(mensagem);
                finalizarAvaliacaoAntecipadamente();
                return;
            }
        }
        
        // Verificar condições para a etapa de pseudopalavras
        if (etapaAtual === 'pseudopalavras' && proximaEtapa === 'frases') {
            // Se o aluno leu poucas pseudopalavras (perfil leitor de sílabas)
            if (estado.pseudopalavrasLidas <= 6) {
                alert(`ATENÇÃO: O aluno leu apenas ${estado.pseudopalavrasLidas} pseudopalavra(s), o que corresponde ao perfil NÍVEL 2 - LEITOR DE SÍLABAS. A avaliação será finalizada automaticamente.`);
                finalizarAvaliacaoAntecipadamente();
                return;
            }
        }
        
        // Esconder etapa atual
        exibirEtapa(proximaEtapa);
        
        // Preparar a próxima etapa
        if (proximaEtapa === 'pseudopalavras') {
            prepararEtapaPseudopalavras();
        } else if (proximaEtapa === 'frases') {
            prepararEtapaFrases();
        } else if (proximaEtapa === 'texto') {
            prepararEtapaTexto();
        } else if (proximaEtapa === 'interpretacao') {
            prepararEtapaInterpretacao();
        }
    }
    
    // Finalizar avaliação e mostrar resultados
    function finalizarAvaliacao() {
        finalizarAvaliacaoAntecipadamente();
    }
    
    // Finalizar avaliação antecipadamente
    function finalizarAvaliacaoAntecipadamente() {
        // Mostrar a tela de resultado
        exibirEtapa('resultado');
        
        // Verificar se deve mostrar resultados detalhados
        const mostrarResultados = document.getElementById('mostrar-resultados').checked;
        
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
        
        // Calcular e atualizar resultados
        atualizarResultados();
        
        // Voltar para o topo da página
        window.scrollTo(0, 0);
    }
    
    // Atualizar resultados na tela
    function atualizarResultados() {
        try {
            // Sugerir nível baseado na leitura
            sugerirNivel();
            
            // Aqui você pode adicionar código para mostrar outros resultados 
            // como detalhes da avaliação, gráficos, etc.
        } catch (error) {
            console.error("Erro ao atualizar resultados:", error);
        }
    }
    
    // Sugerir nível de leitura baseado nos resultados
    function sugerirNivel() {
        let nivelSugerido = 0;
        let descricaoNivel = "";
        let infoDetalhada = "";
        let corNivel = "";
        
        // Exibir regras específicas para a faixa de série
        const regrasSerieElement = document.getElementById('info-regras-serie');
        if (regrasSerieElement) {
            regrasSerieElement.innerHTML = `<strong>Regras para ${estado.faixaSerie === "1-2" ? "1º e 2º anos" : estado.faixaSerie === "3-5" ? "3º ao 5º anos" : "6º ao 9º anos"}</strong>`;
        }
        
        // Determinar nível
        nivelSugerido = determinarNivelGenerico(estado.faixaSerie);
        
        // Definir descrição e cor do nível
        if (nivelSugerido === 0) {
            descricaoNivel = "NÍVEL 0 - NÃO AVALIADO";
            corNivel = "#6B7280"; // Cinza
            if (estado.faixaSerie === "1-2") {
                infoDetalhada = "Não lê nem tenta. Intervenção imediata necessária.";
            } else if (estado.faixaSerie === "3-5") {
                infoDetalhada = "Não lê. Requer desenvolvimento de consciência fonológica.";
            } else {
                infoDetalhada = "Não lê. Requer intervenção fonológica urgente.";
            }
        } else if (nivelSugerido === 1) {
            descricaoNivel = "NÍVEL 1 - NÃO LEITOR";
            corNivel = "#EF4444"; // Vermelho
            if (estado.faixaSerie === "1-2") {
                infoDetalhada = "Lê até 10 palavras/min. Necessita intervenção urgente.";
            } else if (estado.faixaSerie === "3-5") {
                infoDetalhada = "Lê até 20 palavras/min. Necessita intervenção urgente.";
            } else {
                infoDetalhada = "Lê até 50 palavras/min. Intervenção imediata necessária.";
            }
        } else if (nivelSugerido === 2) {
            descricaoNivel = "NÍVEL 2 - LEITOR DE SÍLABAS";
            corNivel = "#F97316"; // Laranja
            if (estado.faixaSerie === "1-2") {
                infoDetalhada = "Lê de 11 a 25 palavras/min. Decodificação básica.";
            } else if (estado.faixaSerie === "3-5") {
                infoDetalhada = "Lê 21 a 39 palavras/min. Foco em decodificação.";
            } else {
                infoDetalhada = "Lê 51 a 80 palavras/min. Foco em decodificação e fluência.";
            }
        } else if (nivelSugerido === 3) {
            descricaoNivel = "NÍVEL 3 - LEITOR DE PALAVRAS";
            corNivel = "#FBBF24"; // Amarelo
            if (estado.faixaSerie === "1-2") {
                infoDetalhada = "Lê de 26 a 35 palavras/min. Atenção à fluência.";
            } else if (estado.faixaSerie === "3-5") {
                infoDetalhada = "Lê 40 a 69 palavras/min. Fluência emergente.";
            } else {
                infoDetalhada = "Lê 81 a 110 palavras/min. Leitura autônoma em desenvolvimento.";
            }
        } else if (nivelSugerido === 4) {
            descricaoNivel = "NÍVEL 4 - LEITOR DE FRASES";
            corNivel = "#34D399"; // Verde claro
            if (estado.faixaSerie === "1-2") {
                infoDetalhada = "Lê de 36 a 44 palavras/min. Ritmo comprometido.";
            } else if (estado.faixaSerie === "3-5") {
                infoDetalhada = "Lê 70 a 89 palavras/min. Precisa ajustar entonação.";
            } else {
                infoDetalhada = "Lê 111 a 130 palavras/min. Ritmo ainda comprometido.";
            }
        } else if (nivelSugerido === 5) {
            descricaoNivel = "NÍVEL 5 - LEITOR DE TEXTO SEM FLUÊNCIA";
            corNivel = "#22D3EE"; // Azul claro
            if (estado.faixaSerie === "1-2") {
                infoDetalhada = "Lê de 45 a 59 palavras/min. Leitura funcional.";
            } else if (estado.faixaSerie === "3-5") {
                infoDetalhada = "Lê 90 a 109 palavras/min. Boa base.";
            } else {
                infoDetalhada = "Lê 131 a 160 palavras/min. Boa base, mas fluência limitada.";
            }
        } else {
            descricaoNivel = "NÍVEL 6 - LEITOR DE TEXTO COM FLUÊNCIA";
            corNivel = "#2563EB"; // Azul
            if (estado.faixaSerie === "1-2") {
                infoDetalhada = "Lê ≥ 60 palavras/min. Leitura fluente.";
            } else if (estado.faixaSerie === "3-5") {
                infoDetalhada = "Lê ≥ 110 palavras/min. Leitura fluente.";
            } else {
                infoDetalhada = "Lê mais de 160 palavras/min. Leitura fluente e compreensiva.";
            }
        }
        
        // Adicionar métricas detalhadas
        const ppm = Math.round((estado.palavrasLidas / 60) * 60);
        infoDetalhada += ` PPM: ${ppm}.`;
        if (estado.pseudopalavrasLidas > 0) {
            infoDetalhada += ` Pseudopalavras lidas: ${estado.pseudopalavrasLidas}.`;
        }
        
        // Atualizar nível na tela
        const nivelElement = document.getElementById('nivel-leitor-sugerido');
        if (nivelElement) {
            nivelElement.textContent = descricaoNivel;
            nivelElement.style.color = corNivel;
            nivelElement.className = "text-2xl font-bold mb-2";
        }
        
        // Atualizar descrição na tela
        const descricaoElement = document.getElementById('descricao-nivel');
        if (descricaoElement) {
            descricaoElement.textContent = infoDetalhada;
            descricaoElement.className = "text-gray-700 mb-4";
        }
        
        // Atualizar barra de progresso
        const nivelProgresso = document.getElementById('nivel-progresso');
        if (nivelProgresso) {
            nivelProgresso.style.width = `${(nivelSugerido / 6) * 100}%`;
            nivelProgresso.style.backgroundColor = corNivel;
        }
        
        // Adicionar recomendações pedagógicas
        const recomendacoes = [];
        if (nivelSugerido <= 2) {
            recomendacoes.push("Intervenção intensiva necessária");
            recomendacoes.push("Desenvolvimento de consciência fonológica");
            recomendacoes.push("Atividades de associação letra-som");
        } else if (nivelSugerido <= 4) {
            recomendacoes.push("Prática de leitura diária");
            recomendacoes.push("Atividades de compreensão textual");
            recomendacoes.push("Trabalho com diferentes gêneros textuais");
        } else {
            recomendacoes.push("Estímulo à leitura de textos mais complexos");
            recomendacoes.push("Atividades de interpretação crítica");
            recomendacoes.push("Ampliação do vocabulário");
        }
        
        // Exibir recomendações
        const recomendacoesElement = document.getElementById('nivel-observacao');
        if (recomendacoesElement) {
            recomendacoesElement.innerHTML = `<strong>Recomendações:</strong><br>• ${recomendacoes.join('<br>• ')}`;
        }
        
        // Armazenar nível para uso posterior
        window.nivelLeitorSugerido = nivelSugerido;
        window.descricaoNivelLeitor = descricaoNivel;
    }
    
    // Determinar nível baseado na faixa de série e resultados
    function determinarNivelGenerico(faixaSerie) {
        // Se não leu nenhuma palavra
        if (estado.palavrasLidas === 0) {
            return 0; // Não Avaliado
        }
        
        // Aplicar regras específicas por faixa
        if (faixaSerie === "1-2") {
            // Regras para 1º e 2º anos
            if (estado.palavrasLidas <= 10) return 1; // Não Leitor
            if (estado.palavrasLidas <= 25) return 2; // Leitor de Sílabas
            if (estado.palavrasLidas <= 35) return 3; // Leitor de Palavras
            if (estado.palavrasLidas <= 44) return 4; // Leitor de Frases
            if (estado.palavrasLidas <= 59) return 5; // Leitor de Texto sem Fluência
            return 6; // Leitor de Texto com Fluência
        } else if (faixaSerie === "3-5") {
            // Regras para 3º ao 5º anos
            if (estado.palavrasLidas <= 20) return 1; // Não Leitor
            if (estado.palavrasLidas <= 39) return 2; // Leitor de Sílabas
            if (estado.palavrasLidas <= 69) return 3; // Leitor de Palavras
            if (estado.palavrasLidas <= 89) return 4; // Leitor de Frases
            if (estado.palavrasLidas <= 109) return 5; // Leitor de Texto sem Fluência
            return 6; // Leitor de Texto com Fluência
        } else { // 6-9
            // Regras para 6º ao 9º anos
            if (estado.palavrasLidas <= 50) return 1; // Não Leitor
            if (estado.palavrasLidas <= 80) return 2; // Leitor de Sílabas
            if (estado.palavrasLidas <= 110) return 3; // Leitor de Palavras
            if (estado.palavrasLidas <= 130) return 4; // Leitor de Frases
            if (estado.palavrasLidas <= 160) return 5; // Leitor de Texto sem Fluência
            return 6; // Leitor de Texto com Fluência
        }
    }
    
    // Salvar avaliação
    function salvarAvaliacao() {
        try {
            // Usar nível determinado automaticamente
            const nivelSelecionado = window.nivelLeitorSugerido;
            const descricaoNivel = window.descricaoNivelLeitor;
            
            // Buscar turma do aluno
            const turmaAluno = dados.turmas.find(t => t.id === estado.alunoAtual.turma_id);
            const faixaSerieExibicao = estado.faixaSerie === "1-2" ? "1º-2º ano" : estado.faixaSerie === "3-5" ? "3º-5º ano" : "6º-9º ano";
            
            // Preparar dados para API
            const dataAvaliacao = {
                aluno: {
                    id: estado.alunoAtual.id,
                    nome: estado.alunoAtual.nome,
                    matricula: estado.alunoAtual.matricula,
                    turma: turmaAluno ? turmaAluno.nome : '',
                    serie: turmaAluno ? turmaAluno.serie : '',
                    faixaSerie: faixaSerieExibicao
                },
                evento: {
                    id: estado.avaliacaoAtual.id,
                    nome: estado.avaliacaoAtual.nome
                },
                data: new Date().toISOString(),
                resultados: {
                    palavras: {
                        total: estado.avaliacaoAtual.palavras.length,
                        corretas: estado.palavrasLidas,
                        ppm: Math.round((estado.palavrasLidas / 60) * 60),
                        porcentagem: Math.round((estado.palavrasLidas / estado.avaliacaoAtual.palavras.length) * 100)
                    },
                    pseudopalavras: {
                        total: estado.avaliacaoAtual.pseudopalavras.length,
                        corretas: estado.pseudopalavrasLidas,
                        porcentagem: Math.round((estado.pseudopalavrasLidas / estado.avaliacaoAtual.pseudopalavras.length) * 100)
                    },
                    frases: {
                        total: estado.avaliacaoAtual.frases ? estado.avaliacaoAtual.frases.length : 0,
                        corretas: estado.frasesLidas,
                        porcentagem: estado.avaliacaoAtual.frases && estado.avaliacaoAtual.frases.length > 0 ? 
                            Math.round((estado.frasesLidas / estado.avaliacaoAtual.frases.length) * 100) : 0
                    },
                    interpretacao: {
                        total: estado.avaliacaoAtual.questoes ? estado.avaliacaoAtual.questoes.length : 0,
                        corretas: estado.respostasCorretas,
                        porcentagem: estado.avaliacaoAtual.questoes && estado.avaliacaoAtual.questoes.length > 0 ? 
                            Math.round((estado.respostasCorretas / estado.avaliacaoAtual.questoes.length) * 100) : 0
                    },
                    nivel: {
                        valor: nivelSelecionado,
                        descricao: descricaoNivel,
                        regras: faixaSerieExibicao
                    }
                }
            };
            
            // Em uma implementação real, enviar para API
            console.log('Dados para salvar:', dataAvaliacao);
            
            // Mensagem para o usuário
            const mensagem = `Avaliação salva com sucesso!

Aluno: ${estado.alunoAtual.nome}
Turma: ${turmaAluno ? turmaAluno.nome : '-'}
Série: ${turmaAluno ? turmaAluno.serie : '-'}
Evento: ${estado.avaliacaoAtual.nome}
Data: ${new Date().toLocaleDateString('pt-BR')}

Resultados:
- Palavras lidas: ${estado.palavrasLidas}/${estado.avaliacaoAtual.palavras.length} (${Math.round((estado.palavrasLidas / estado.avaliacaoAtual.palavras.length) * 100)}%)
- Pseudopalavras lidas: ${estado.pseudopalavrasLidas}/${estado.avaliacaoAtual.pseudopalavras.length} (${Math.round((estado.pseudopalavrasLidas / estado.avaliacaoAtual.pseudopalavras.length) * 100)}%)
- Frases lidas: ${estado.frasesLidas}/${estado.avaliacaoAtual.frases ? estado.avaliacaoAtual.frases.length : 0}
- Respostas corretas: ${estado.respostasCorretas}/${estado.avaliacaoAtual.questoes ? estado.avaliacaoAtual.questoes.length : 0}
- PPM (Palavras por minuto): ${Math.round((estado.palavrasLidas / 60) * 60)}

Nível do leitor: ${descricaoNivel}
Regras aplicadas: ${faixaSerieExibicao}`;

            alert(mensagem);
            
            // Resetar avaliação
            resetarAvaliacao();
        } catch (error) {
            console.error("Erro ao salvar avaliação:", error);
            alert("Ocorreu um erro ao salvar a avaliação.");
        }
    }
    
    // Resetar avaliação para iniciar nova
    function resetarAvaliacao() {
        // Limpar contadores
        estado.palavrasLidas = 0;
        estado.pseudopalavrasLidas = 0;
        estado.frasesLidas = 0;
        estado.linhasLidas = 0;
        estado.respostasCorretas = 0;
        
        // Voltar para seleção de aluno
        exibirEtapa('selecaoAluno');
        
        // Resetar timers
        elementos.timerPalavras.textContent = '01:00';
        elementos.timerPseudopalavras.textContent = '01:00';
        elementos.timerFrases.textContent = '01:00';
        elementos.timerTexto.textContent = '01:00';
        
        // Reativar botões
        const botoesTimer = [
            elementos.iniciarTimerPalavrasBtn, 
            elementos.iniciarTimerPseudopalavrasBtn, 
            elementos.iniciarTimerFrasesBtn, 
            elementos.iniciarTimerTextoBtn
        ];
        
        botoesTimer.forEach(btn => {
            btn.disabled = false;
            btn.classList.remove('bg-gray-400');
            btn.classList.add('bg-blue-600', 'hover:bg-blue-700');
            btn.textContent = 'Iniciar Cronômetro';
        });
    }
    
    // Inicializar a aplicação
    inicializarAplicacao();
}); 