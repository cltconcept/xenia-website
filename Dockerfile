# Site 100 % statique : on compile, puis on ne sert que des fichiers.
# Aucune variable d'environnement, aucun secret — rien à injecter au run.

FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable
# Les manifestes d'abord : la couche d'install est mise en cache
# tant que les dépendances ne bougent pas
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
