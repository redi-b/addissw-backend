FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:24-alpine AS runner

WORKDIR /app

COPY --from=builder /app/package*.json ./

RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

ARG DATABASE_URL=mongodb://127.0.0.1:27017/song-mananger
ENV DATABASE_URL=${DATABASE_URL}
ENV NODE_ENV=production

EXPOSE 3030

CMD ["./docker-entrypoint.sh"]
