# Use an official Node.js image
FROM node:20.17-alpine AS base

WORKDIR /app

COPY package*.json package-lock.json* ./

RUN npm ci --omit-dev

RUN npm audit fix --force

COPY . .

# Define build arguments
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL
ARG MONGO_URI
ARG NEXT_PUBLIC_ECB_API_URL
ARG DB_NAME
ARG UPDATE_TOKENS_ENDPOINT

ENV GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
ENV GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
ENV MONGO_URI=${MONGO_URI}
ENV NEXT_PUBLIC_ECB_API_URL=${NEXT_PUBLIC_ECB_API_URL}
ENV DB_NAME=${DB_NAME}
ENV UPDATE_TOKENS_ENDPOINT=${UPDATE_TOKENS_ENDPOINT}

RUN npm run build

# Production image, copy all the files and run next
FROM node:20.17-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=base /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=base --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=base --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

#CMD ["npm", "start"]
CMD ["node", "server.js"]