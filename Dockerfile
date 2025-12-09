# Stage 1: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build  # build ra /dist

# Stage 2: Production - Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: custom nginx.conf nếu cần
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]