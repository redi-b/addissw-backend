FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:24-alpine AS runner

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

RUN npm install --omit=dev

ENV DATABASE_URL=file:./prisma/dev.db
ENV NODE_ENV=production

RUN npx prisma migrate deploy
RUN npx prisma generate

EXPOSE 3030

CMD ["node", "dist/server.js"]
