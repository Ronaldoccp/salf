FROM node:18-alpine

WORKDIR /app

# Instalar dependências necessárias para o Prisma e OpenSSL
RUN apk add --no-cache openssl openssl-dev libc6-compat

COPY package*.json ./

RUN npm install

COPY . .

# Reconstruir o cliente Prisma com a versão correta do OpenSSL
RUN npm install --ignore-scripts && \
    npm rebuild && \
    npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "dev"] 