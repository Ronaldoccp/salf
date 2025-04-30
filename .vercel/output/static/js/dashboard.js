document.addEventListener('DOMContentLoaded', function() {
    // Inicializar os gráficos
    initCharts();
    
    // Referências aos elementos de filtro
    const filtroRegiao = document.getElementById('regiao');
    const filtroGrupo = document.getElementById('grupo');
    const filtroEscola = document.getElementById('escola');
    const filtroAnoEscolar = document.getElementById('ano-escolar');
    const filtroEvento = document.getElementById('evento');
    
    // Botões de ação
    const btnAplicarFiltros = document.getElementById('aplicar-filtros');
    const btnLimparFiltros = document.getElementById('limpar-filtros');
    
    // Dados simulados de escolas para filtros encadeados
    const escolas = [
        { id: 1, nome: "Escola Municipal João da Silva", regiao: "Norte", grupo: "Municipal" },
        { id: 2, nome: "Escola Estadual Maria José", regiao: "Sul", grupo: "Estadual" },
        { id: 3, nome: "Escola Municipal Pedro Alves", regiao: "Leste", grupo: "Municipal" },
        { id: 4, nome: "Colégio São Francisco", regiao: "Centro", grupo: "Particular" },
        { id: 5, nome: "Escola Federal Técnica", regiao: "Oeste", grupo: "Federal" }
    ];
    
    // Removido o carregamento dinâmico de regiões e grupos
    // Agora os filtros terão apenas as opções "Todas as regiões" e "Todos os grupos"
    
    // Event Listeners
    if (filtroRegiao) {
        filtroRegiao.addEventListener('change', function() {
            atualizarFiltroEscolas();
        });
    }
    
    if (filtroGrupo) {
        filtroGrupo.addEventListener('change', function() {
            atualizarFiltroEscolas();
        });
    }
    
    if (btnAplicarFiltros) {
        btnAplicarFiltros.addEventListener('click', function() {
            aplicarFiltros();
        });
    }
    
    if (btnLimparFiltros) {
        btnLimparFiltros.addEventListener('click', function() {
            limparFiltros();
        });
    }
    
    // Funções
    function atualizarFiltroEscolas() {
        const regiaoSelecionada = filtroRegiao.value;
        const grupoSelecionado = filtroGrupo.value;
        
        // Limpar opções atuais, mantendo a opção default
        while (filtroEscola.options.length > 1) {
            filtroEscola.remove(1);
        }
        
        // Filtrar escolas com base nos filtros selecionados
        let escolasFiltradas = escolas;
        
        if (regiaoSelecionada) {
            escolasFiltradas = escolasFiltradas.filter(escola => escola.regiao === regiaoSelecionada);
        }
        
        if (grupoSelecionado) {
            escolasFiltradas = escolasFiltradas.filter(escola => escola.grupo === grupoSelecionado);
        }
        
        // Adicionar as escolas filtradas ao select
        escolasFiltradas.forEach(escola => {
            const option = document.createElement('option');
            option.value = escola.id;
            option.textContent = escola.nome;
            filtroEscola.appendChild(option);
        });
    }
    
    function aplicarFiltros() {
        // Capturar valores dos filtros
        const filtros = {
            regiao: filtroRegiao.value,
            grupo: filtroGrupo.value,
            escola: filtroEscola.value,
            anoEscolar: filtroAnoEscolar.value,
            evento: filtroEvento.value
        };
        
        // Exibir os filtros aplicados no console (para fins de desenvolvimento)
        console.log('Filtros aplicados:', filtros);
        
        // Atualizar os gráficos com base nos filtros
        updateCharts(filtros);
    }
    
    function limparFiltros() {
        // Resetar todos os filtros para seus valores padrão
        filtroRegiao.value = '';
        filtroGrupo.value = '';
        filtroEscola.value = '';
        filtroAnoEscolar.value = '';
        filtroEvento.value = '';
        
        // Recarregar as opções de escolas
        atualizarFiltroEscolas();
        
        // Atualizar os gráficos com todos os dados
        updateCharts({});
    }
});

function initCharts() {
    // Gráfico de pizza - Distribuição por nível de leitura
    const ctxNiveis = document.getElementById('chart-niveis');
    if (ctxNiveis) {
        new Chart(ctxNiveis, {
            type: 'pie',
            data: {
                labels: [
                    'Nível 1 - Não Leitor',
                    'Nível 2 - Leitor de Sílabas',
                    'Nível 3 - Leitor de Palavras',
                    'Nível 4 - Leitor de Frases',
                    'Nível 5 - Leitor de Texto sem Fluência',
                    'Nível 6 - Leitor de Texto com Fluência'
                ],
                datasets: [{
                    data: [5, 15, 20, 25, 15, 20],
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF',
                        '#FF9F40'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            boxWidth: 15,
                            font: {
                                size: 10
                            }
                        }
                    }
                }
            }
        });
    }

    // Gráfico de barras - Desempenho por série
    const ctxSeries = document.getElementById('chart-series');
    if (ctxSeries) {
        new Chart(ctxSeries, {
            type: 'bar',
            data: {
                labels: ['1º Ano', '2º Ano', '3º Ano', '4º Ano', '5º Ano', '6º Ano', '7º Ano', '8º Ano', '9º Ano'],
                datasets: [
                    {
                        label: 'Não Leitor',
                        data: [40, 25, 15, 10, 5, 4, 3, 2, 1],
                        backgroundColor: '#FF6384'
                    },
                    {
                        label: 'Leitor de Sílabas',
                        data: [30, 35, 25, 20, 15, 12, 10, 8, 5],
                        backgroundColor: '#36A2EB'
                    },
                    {
                        label: 'Leitor de Palavras',
                        data: [20, 25, 30, 20, 15, 14, 12, 10, 8],
                        backgroundColor: '#FFCE56'
                    },
                    {
                        label: 'Leitor de Frases',
                        data: [10, 10, 20, 25, 20, 18, 16, 15, 14],
                        backgroundColor: '#4BC0C0'
                    },
                    {
                        label: 'Leitor de Texto sem Fluência',
                        data: [0, 5, 5, 15, 20, 22, 24, 25, 27],
                        backgroundColor: '#9966FF'
                    },
                    {
                        label: 'Leitor de Texto com Fluência',
                        data: [0, 0, 5, 10, 25, 30, 35, 40, 45],
                        backgroundColor: '#FF9F40'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        stacked: true,
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            boxWidth: 12,
                            font: {
                                size: 10
                            }
                        }
                    }
                }
            }
        });
    }

    // Gráfico de linha - Evolução temporal
    const ctxEvolucao = document.getElementById('chart-evolucao');
    if (ctxEvolucao) {
        new Chart(ctxEvolucao, {
            type: 'line',
            data: {
                labels: ['Avaliação Diagnóstica', 'Avaliação Formativa 1', 'Avaliação Formativa 2', 'Avaliação Final'],
                datasets: [
                    {
                        label: 'Nível 1 - Não Leitor',
                        data: [30, 25, 20, 15],
                        borderColor: '#FF6384',
                        backgroundColor: 'rgba(255, 99, 132, 0.1)',
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Nível 2 - Leitor de Sílabas',
                        data: [25, 22, 20, 18],
                        borderColor: '#36A2EB',
                        backgroundColor: 'rgba(54, 162, 235, 0.1)',
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Nível 3 - Leitor de Palavras',
                        data: [20, 20, 18, 17],
                        borderColor: '#FFCE56',
                        backgroundColor: 'rgba(255, 206, 86, 0.1)',
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Nível 4 - Leitor de Frases',
                        data: [15, 18, 20, 20],
                        borderColor: '#4BC0C0',
                        backgroundColor: 'rgba(75, 192, 192, 0.1)',
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Nível 5 - Leitor de Texto sem Fluência',
                        data: [7, 10, 12, 15],
                        borderColor: '#9966FF',
                        backgroundColor: 'rgba(153, 102, 255, 0.1)',
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Nível 6 - Leitor de Texto com Fluência',
                        data: [3, 5, 10, 15],
                        borderColor: '#FF9F40',
                        backgroundColor: 'rgba(255, 159, 64, 0.1)',
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            boxWidth: 12,
                            font: {
                                size: 10
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            title: function(tooltipItem) {
                                return 'Evento: ' + tooltipItem[0].label;
                            },
                            label: function(context) {
                                return context.dataset.label + ': ' + context.raw + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    // Gráfico de barras - Progressão de níveis
    const ctxProgressao = document.getElementById('chart-progressao');
    if (ctxProgressao) {
        new Chart(ctxProgressao, {
            type: 'bar',
            data: {
                labels: ['2022', '2023'],
                datasets: [
                    {
                        label: 'Alunos que Subiram de Nível',
                        data: [35, 45],
                        backgroundColor: '#4CAF50'
                    },
                    {
                        label: 'Alunos que Mantiveram o Nível',
                        data: [55, 40],
                        backgroundColor: '#FFC107'
                    },
                    {
                        label: 'Alunos que Regrediram',
                        data: [10, 15],
                        backgroundColor: '#F44336'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        stacked: true,
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

function updateCharts(filtros = {}) {
    // Em uma implementação real, isso seria substituído por uma chamada à API
    // para buscar os dados filtrados e atualizar os gráficos.
    // Por enquanto, simularemos uma atualização com valores aleatórios.
    
    // Atualizar os cards com base nos filtros
    let multiplicador = 1;
    
    // Aplicar diferentes multiplicadores com base nos filtros selecionados
    // Isso é apenas para simular diferentes resultados com base nos filtros
    if (filtros.regiao === 'Norte') multiplicador = 0.8;
    if (filtros.regiao === 'Sul') multiplicador = 1.2;
    if (filtros.grupo === 'Municipal') multiplicador *= 0.9;
    if (filtros.grupo === 'Particular') multiplicador *= 1.3;
    if (filtros.anoEscolar === '1' || filtros.anoEscolar === '2') multiplicador *= 0.7;
    if (filtros.anoEscolar === '8' || filtros.anoEscolar === '9') multiplicador *= 1.4;
    
    const totalAvaliados = Math.floor((Math.random() * 200 + 150) * multiplicador);
    const wpmMedio = Math.floor((Math.random() * 40 + 50) * multiplicador);
    const taxaParticipacao = Math.min(100, Math.floor((Math.random() * 25 + 70) * multiplicador));
    const taxaCompreensao = Math.min(100, Math.floor((Math.random() * 35 + 50) * multiplicador));
    
    // Atualizar os valores dos cards na interface
    document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.xl\\:grid-cols-4 > div:nth-child(1) .text-2xl').textContent = totalAvaliados;
    document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.xl\\:grid-cols-4 > div:nth-child(2) .text-2xl').textContent = wpmMedio;
    document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.xl\\:grid-cols-4 > div:nth-child(3) .text-2xl').textContent = taxaParticipacao + '%';
    document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.xl\\:grid-cols-4 > div:nth-child(4) .text-2xl').textContent = taxaCompreensao + '%';
    
    // Atualizar o gráfico de evolução temporal com base no evento selecionado
    if (filtros.evento) {
        // Em uma implementação real, aqui seria uma chamada à API para obter os dados por evento de avaliação
        // Por enquanto, apenas simulamos uma atualização do gráfico
        
        // Encontrar o gráfico de evolução
        const chartEvolucao = Chart.getChart(document.getElementById('chart-evolucao'));
        
        if (chartEvolucao) {
            // Simulando diferentes configurações para diferentes eventos de avaliação
            if (filtros.evento === '1') {
                // Dados para o primeiro semestre
                chartEvolucao.data.labels = ['Diagnóstica 1º Sem', 'Formativa 1', 'Formativa 2', 'Final 1º Sem'];
                
                // Atualizar os dados para cada nível de leitura
                chartEvolucao.data.datasets[0].data = [35, 30, 25, 20];
                chartEvolucao.data.datasets[1].data = [30, 28, 25, 22];
                chartEvolucao.data.datasets[2].data = [20, 20, 19, 18];
                chartEvolucao.data.datasets[3].data = [10, 12, 15, 18];
                chartEvolucao.data.datasets[4].data = [3, 5, 8, 12];
                chartEvolucao.data.datasets[5].data = [2, 5, 8, 10];
            } else if (filtros.evento === '2') {
                // Dados para o segundo semestre
                chartEvolucao.data.labels = ['Diagnóstica 2º Sem', 'Formativa 3', 'Formativa 4', 'Final 2º Sem'];
                
                // Atualizar os dados para cada nível de leitura
                chartEvolucao.data.datasets[0].data = [20, 18, 15, 12];
                chartEvolucao.data.datasets[1].data = [22, 20, 18, 15];
                chartEvolucao.data.datasets[2].data = [18, 17, 16, 15];
                chartEvolucao.data.datasets[3].data = [18, 19, 21, 23];
                chartEvolucao.data.datasets[4].data = [12, 14, 16, 18];
                chartEvolucao.data.datasets[5].data = [10, 12, 14, 17];
            } else {
                // Dados padrão para todos os eventos
                chartEvolucao.data.labels = ['Avaliação Diagnóstica', 'Avaliação Formativa 1', 'Avaliação Formativa 2', 'Avaliação Final'];
                
                // Atualizar os dados para cada nível de leitura
                chartEvolucao.data.datasets[0].data = [30, 25, 20, 15];
                chartEvolucao.data.datasets[1].data = [25, 22, 20, 18];
                chartEvolucao.data.datasets[2].data = [20, 20, 18, 17];
                chartEvolucao.data.datasets[3].data = [15, 18, 20, 20];
                chartEvolucao.data.datasets[4].data = [7, 10, 12, 15];
                chartEvolucao.data.datasets[5].data = [3, 5, 10, 15];
            }
            
            // Atualizar o gráfico
            chartEvolucao.update();
        }
    }
    
    // Exibir mensagem de sucesso
    alert('Filtros aplicados com sucesso!');
} 