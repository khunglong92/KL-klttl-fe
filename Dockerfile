# =========================
# Stage 1: Builder
# =========================
FROM node:20-alpine AS builder

WORKDIR /app

# -------- BUILD ARGS --------
ARG VITE_API_URL
ARG VITE_PHONE_NUMBER
ARG VITE_ZALO_PHONE_NUMBER
ARG VITE_EMAIL_CONTACT
ARG VITE_COMPANY_ADDRESS
ARG VITE_COMPANY_WORKING_HOURS

# -------- EXPORT ENV FOR VITE --------
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_PHONE_NUMBER=$VITE_PHONE_NUMBER
ENV VITE_ZALO_PHONE_NUMBER=$VITE_ZALO_PHONE_NUMBER
ENV VITE_EMAIL_CONTACT=$VITE_EMAIL_CONTACT
ENV VITE_COMPANY_ADDRESS=$VITE_COMPANY_ADDRESS
ENV VITE_COMPANY_WORKING_HOURS=$VITE_COMPANY_WORKING_HOURS

# -------- INSTALL --------
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# -------- BUILD --------
COPY . .
RUN yarn build

# =========================
# Stage 2: Production
# =========================
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]