FROM node:22.23.4-slim AS deps
WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl
COPY package*.json ./
RUN npm ci

FROM node:22.23.4-slim AS builder
WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate
RUN npm run build

FROM node:22.23.4-slim AS runner
WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl
ENV NODE_ENV=production
ENV PORT=3000

COPY --chown=node:node --from=builder /app/package*.json ./
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/.next ./.next
COPY --chown=node:node --from=builder /app/public ./public
COPY --chown=node:node --from=builder /app/prisma ./prisma
COPY --chown=node:node --from=builder /app/next.config.mjs ./next.config.mjs

EXPOSE 3000

USER node

CMD ["npm", "run", "start"]