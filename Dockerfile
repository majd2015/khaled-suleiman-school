FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --no-fund

FROM node:22-alpine AS build
WORKDIR /app
ENV NODE_ENV=production
# لا قاعدة بيانات وقت البناء: الصفحات تُبنى بالمحتوى التجريبي، وتتحدّث من القاعدة خلال دقيقة من التشغيل.
# (إذا مرّر Coolify DATABASE_URL كـ Build Variable يُلغى هنا حتى لا يفشل البناء.)
ARG DATABASE_URL=
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN DATABASE_URL= npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3200
ENV UPLOAD_DIR=/app/uploads
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./prisma.config.ts
COPY --from=build /app/generated ./generated
COPY --from=build /app/scripts ./scripts
COPY --from=build /app/content ./content
COPY --from=build /app/tsconfig.json ./tsconfig.json
COPY --from=build /app/next.config.ts ./next.config.ts
RUN mkdir -p /app/uploads
VOLUME ["/app/uploads"]
EXPOSE 3200
CMD ["sh", "-c", "npx prisma db push && npm run db:seed && npm run start"]
