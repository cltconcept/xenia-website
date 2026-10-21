# Aperçu statique (nginx). Versions d'images à pinner à la livraison.
# Node 24 : Astro 7.3 exige >= 22.12 ; package.json demande Node >= 22.18 (suppression des types).
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Contrôle de sortie : « livraison » par défaut (bloque les pages encore provisoires).
# L'aperçu passe VERIFICATION=preview en variable de build (noindex exigé, pages provisoires en avertissement).
ARG VERIFICATION=livraison
RUN npm run check && npm run build && node scripts/verifier.mjs --mode "$VERIFICATION"

FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
