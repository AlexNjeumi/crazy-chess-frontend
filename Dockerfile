ARG NODE_VERSION=24.19.0

FROM node:${NODE_VERSION}-alpine

ENV NODE_ENV=development

WORKDIR /usr/src/app

# Download dependencies
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --legacy-peer-deps

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]