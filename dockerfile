FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine AS production

WORKDIR /app

# Instalar netcat para verificar conectividade com bancos
RUN apk add --no-cache netcat-openbsd dos2unix

COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
COPY --from=build /app/src ./src
COPY --from=build /app/tsconfig*.json ./
COPY --from=build /app/docker/scripts/setup-db.sh ./setup-db.sh

RUN npm install && \
    dos2unix ./setup-db.sh && \
    chmod +x ./setup-db.sh && \
    ls -la ./setup-db.sh

EXPOSE 3000

# Script de inicialização que configura o banco e inicia a aplicação
CMD ["sh", "-c", "ls -la && ./setup-db.sh && npm run start:prod"]
