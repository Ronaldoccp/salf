// Inicialização do Prisma Client com tratamento para ambiente Vercel
const { PrismaClient } = require('@prisma/client');

// Configuração com tratamento de erro melhorado para o Vercel
const prismaClientSingleton = () => {
  try {
    console.log('🔌 Inicializando conexão com o banco de dados...');
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      errorFormat: 'pretty'
    });
  } catch (error) {
    console.error('❌ Erro ao inicializar PrismaClient:', error);
    // Criar um cliente falso para evitar que a aplicação quebre completamente
    // quando não for possível conectar ao banco de dados
    return {
      $connect: () => Promise.resolve(),
      $disconnect: () => Promise.resolve(),
      // Este objeto simulará qualquer modelo do Prisma e retornará arrays vazios ou erros
      $on: () => {},
      $transaction: (cb) => Promise.resolve([]),
      __fake: true,
      // Adicionar um proxy para simular modelos Prisma ausentes
      ...new Proxy({}, {
        get: (target, prop) => {
          if (typeof prop === 'string' && !prop.startsWith('$') && !['connect', 'disconnect', 'on', 'transaction'].includes(prop)) {
            console.warn(`⚠️ Tentativa de acessar modelo Prisma '${prop}' com cliente simulado`);
            // Retornar um objeto que simula os métodos do modelo
            return {
              findMany: () => Promise.resolve([]),
              findUnique: () => Promise.resolve(null),
              findFirst: () => Promise.resolve(null),
              create: () => Promise.reject(new Error('Banco de dados não disponível')),
              update: () => Promise.reject(new Error('Banco de dados não disponível')),
              delete: () => Promise.reject(new Error('Banco de dados não disponível')),
              count: () => Promise.resolve(0),
              // adicione outros métodos conforme necessário
            };
          }
          return target[prop];
        }
      })
    };
  }
};

// Uso de global para manter uma única instância do PrismaClient
const globalForPrisma = global;
const prisma = globalForPrisma.prisma || prismaClientSingleton();

// Registrar eventos de conexão
prisma.$on('connect', () => {
  console.log('✅ Conectado ao banco de dados');
});

prisma.$on('error', (e) => {
  console.error('❌ Erro na conexão do banco de dados:', e);
});

// Verificar se estamos em desenvolvimento
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

module.exports = prisma; 