const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Iniciando seed do banco de dados...');

    // 1. Regiões
    console.log('Criando regiões...');
    const regioes = await Promise.all([
      prisma.regiao.upsert({
        where: { id: 1 },
        update: {},
        create: { nome: 'Norte' }
      }),
      prisma.regiao.upsert({
        where: { id: 2 },
        update: {},
        create: { nome: 'Sul' }
      }),
      prisma.regiao.upsert({
        where: { id: 3 },
        update: {},
        create: { nome: 'Leste' }
      }),
      prisma.regiao.upsert({
        where: { id: 4 },
        update: {},
        create: { nome: 'Oeste' }
      }),
      prisma.regiao.upsert({
        where: { id: 5 },
        update: {},
        create: { nome: 'Centro' }
      })
    ]);
    console.log(`${regioes.length} regiões criadas`);

    // 2. Grupos
    console.log('Criando grupos...');
    const grupos = await Promise.all([
      prisma.grupo.upsert({
        where: { id: 1 },
        update: {},
        create: { nome: 'Grupo Municipal' }
      }),
      prisma.grupo.upsert({
        where: { id: 2 },
        update: {},
        create: { nome: 'Grupo Estadual' }
      }),
      prisma.grupo.upsert({
        where: { id: 3 },
        update: {},
        create: { nome: 'Grupo Particular' }
      })
    ]);
    console.log(`${grupos.length} grupos criados`);

    // 3. Anos escolares
    console.log('Criando anos escolares...');
    const anosEscolares = await Promise.all([
      prisma.anoEscolar.upsert({
        where: { id: 1 },
        update: {},
        create: { nome: '1º Ano' }
      }),
      prisma.anoEscolar.upsert({
        where: { id: 2 },
        update: {},
        create: { nome: '2º Ano' }
      }),
      prisma.anoEscolar.upsert({
        where: { id: 3 },
        update: {},
        create: { nome: '3º Ano' }
      }),
      prisma.anoEscolar.upsert({
        where: { id: 4 },
        update: {},
        create: { nome: '4º Ano' }
      }),
      prisma.anoEscolar.upsert({
        where: { id: 5 },
        update: {},
        create: { nome: '5º Ano' }
      }),
      prisma.anoEscolar.upsert({
        where: { id: 6 },
        update: {},
        create: { nome: '6º Ano' }
      }),
      prisma.anoEscolar.upsert({
        where: { id: 7 },
        update: {},
        create: { nome: '7º Ano' }
      }),
      prisma.anoEscolar.upsert({
        where: { id: 8 },
        update: {},
        create: { nome: '8º Ano' }
      }),
      prisma.anoEscolar.upsert({
        where: { id: 9 },
        update: {},
        create: { nome: '9º Ano' }
      })
    ]);
    console.log(`${anosEscolares.length} anos escolares criados`);

    // 4. Usuários padrão
    console.log('Criando usuários...');
    const senhaPadrao = await bcrypt.hash('senha123', 10);
    
    const usuarios = await Promise.all([
      prisma.usuario.upsert({
        where: { email: 'admin@salf.edu.br' },
        update: {},
        create: {
          nome: 'Admin Sistema',
          email: 'admin@salf.edu.br',
          senha: senhaPadrao,
          tipo: 'admin',
          ativo: true
        }
      }),
      prisma.usuario.upsert({
        where: { email: 'coordenador@salf.edu.br' },
        update: {},
        create: {
          nome: 'Maria Coordenadora',
          email: 'coordenador@salf.edu.br',
          senha: senhaPadrao,
          tipo: 'coordenador',
          ativo: true
        }
      }),
      prisma.usuario.upsert({
        where: { email: 'aplicador@salf.edu.br' },
        update: {},
        create: {
          nome: 'João Aplicador',
          email: 'aplicador@salf.edu.br',
          senha: senhaPadrao,
          tipo: 'aplicador',
          ativo: true
        }
      }),
      prisma.usuario.upsert({
        where: { email: 'gestor@salf.edu.br' },
        update: {},
        create: {
          nome: 'Pedro Gestor',
          email: 'gestor@salf.edu.br',
          senha: senhaPadrao,
          tipo: 'gestor',
          ativo: true
        }
      })
    ]);
    console.log(`${usuarios.length} usuários criados`);

    // 5. Escolas
    console.log('Criando escolas...');
    const escolas = await Promise.all([
      prisma.escola.upsert({
        where: { id: 1 },
        update: {},
        create: {
          nome: 'Escola Municipal João da Silva',
          regiaoId: 1,
          grupoId: 1
        }
      }),
      prisma.escola.upsert({
        where: { id: 2 },
        update: {},
        create: {
          nome: 'Escola Estadual Maria José',
          regiaoId: 2,
          grupoId: 2
        }
      }),
      prisma.escola.upsert({
        where: { id: 3 },
        update: {},
        create: {
          nome: 'Colégio Particular São José',
          regiaoId: 5,
          grupoId: 3
        }
      })
    ]);
    console.log(`${escolas.length} escolas criadas`);

    // 6. Associar usuários a escolas
    console.log('Associando usuários às escolas...');
    await Promise.all([
      prisma.escolaUsuario.upsert({
        where: { id: 1 },
        update: {},
        create: {
          escolaId: 1,
          usuarioId: 1
        }
      }),
      prisma.escolaUsuario.upsert({
        where: { id: 2 },
        update: {},
        create: {
          escolaId: 2,
          usuarioId: 1
        }
      }),
      prisma.escolaUsuario.upsert({
        where: { id: 3 },
        update: {},
        create: {
          escolaId: 3,
          usuarioId: 1
        }
      }),
      prisma.escolaUsuario.upsert({
        where: { id: 4 },
        update: {},
        create: {
          escolaId: 1,
          usuarioId: 2
        }
      }),
      prisma.escolaUsuario.upsert({
        where: { id: 5 },
        update: {},
        create: {
          escolaId: 2,
          usuarioId: 3
        }
      }),
      prisma.escolaUsuario.upsert({
        where: { id: 6 },
        update: {},
        create: {
          escolaId: 3,
          usuarioId: 4
        }
      })
    ]);
    console.log('Usuários associados às escolas com sucesso');

    // 7. Turmas
    console.log('Criando turmas...');
    const turmas = await Promise.all([
      prisma.turma.upsert({
        where: { id: 1 },
        update: {},
        create: {
          nome: '1º Ano A',
          escolaId: 1,
          anoEscolarId: 1
        }
      }),
      prisma.turma.upsert({
        where: { id: 2 },
        update: {},
        create: {
          nome: '2º Ano A',
          escolaId: 1,
          anoEscolarId: 2
        }
      }),
      prisma.turma.upsert({
        where: { id: 3 },
        update: {},
        create: {
          nome: '3º Ano A',
          escolaId: 2,
          anoEscolarId: 3
        }
      }),
      prisma.turma.upsert({
        where: { id: 4 },
        update: {},
        create: {
          nome: '4º Ano A',
          escolaId: 3,
          anoEscolarId: 4
        }
      })
    ]);
    console.log(`${turmas.length} turmas criadas`);

    // 8. Alunos
    console.log('Criando alunos...');
    const alunos = [];
    
    // 5 alunos para cada turma
    for (let turmaId = 1; turmaId <= 4; turmaId++) {
      for (let i = 1; i <= 5; i++) {
        const id = (turmaId - 1) * 5 + i;
        alunos.push(
          await prisma.aluno.upsert({
            where: { id },
            update: {},
            create: {
              nome: `Aluno ${id}`,
              turmaId,
              dataNascimento: new Date(2015 - turmaId, 0, Math.floor(Math.random() * 28) + 1)
            }
          })
        );
      }
    }
    console.log(`${alunos.length} alunos criados`);

    // 9. Eventos de avaliação
    console.log('Criando eventos de avaliação...');
    const dataAtual = new Date();
    const eventos = await Promise.all([
      prisma.eventoAvaliacao.upsert({
        where: { id: 1 },
        update: {},
        create: {
          nome: 'Avaliação 1º Semestre 2023',
          dataInicio: new Date(dataAtual.getFullYear(), 3, 1), // Abril
          dataFim: new Date(dataAtual.getFullYear(), 5, 30), // Junho
          ativo: false
        }
      }),
      prisma.eventoAvaliacao.upsert({
        where: { id: 2 },
        update: {},
        create: {
          nome: 'Avaliação 2º Semestre 2023',
          dataInicio: new Date(dataAtual.getFullYear(), 9, 1), // Outubro
          dataFim: new Date(dataAtual.getFullYear(), 11, 15), // Dezembro
          ativo: true
        }
      })
    ]);
    console.log(`${eventos.length} eventos de avaliação criados`);

    // 10. Avaliações
    console.log('Criando avaliações...');
    const avaliacoes = [];
    
    // 2 avaliações por aluno (uma para cada evento)
    for (let alunoId = 1; alunoId <= 20; alunoId++) {
      for (let eventoId = 1; eventoId <= 2; eventoId++) {
        const id = (alunoId - 1) * 2 + eventoId;
        const palavrasPorMinuto = Math.floor(Math.random() * 80) + 20;
        const precisao = Math.random() * 30 + 70;
        const fluencia = Math.random() * 30 + 70;
        const compreensao = Math.random() * 30 + 70;
        
        let nivelLeitura;
        if (compreensao > 85 && precisao > 85 && fluencia > 85) {
          nivelLeitura = 'Avançado';
        } else if (compreensao > 70 && precisao > 70 && fluencia > 70) {
          nivelLeitura = 'Proficiente';
        } else if (compreensao > 50 && precisao > 50 && fluencia > 50) {
          nivelLeitura = 'Básico';
        } else {
          nivelLeitura = 'Insuficiente';
        }
        
        const dataAvaliacao = new Date();
        dataAvaliacao.setMonth(eventoId === 1 ? 4 : 10); // Maio ou Novembro
        dataAvaliacao.setDate(Math.floor(Math.random() * 28) + 1);
        
        avaliacoes.push(
          await prisma.avaliacao.upsert({
            where: { id },
            update: {},
            create: {
              alunoId,
              eventoId,
              aplicadorId: Math.floor(Math.random() * 2) + 3, // IDs 3 ou 4 (aplicador ou gestor)
              palavrasPorMinuto,
              precisao,
              fluencia,
              compreensao,
              nivelLeitura,
              observacoes: `Avaliação ${eventoId} do aluno ${alunoId}`,
              dataAvaliacao
            }
          })
        );
      }
    }
    console.log(`${avaliacoes.length} avaliações criadas`);

    console.log('Seed concluído com sucesso!');
  } catch (error) {
    console.error('Erro durante o seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 