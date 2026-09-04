FROM node:22-bookworm-slim AS node

FROM ghcr.io/charmbracelet/vhs:v0.11.0

USER root

# Reuse Node.js + npm from the official Node image
COPY --from=node /usr/local /usr/local

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        git \
        make \
    && rm -rf /var/lib/apt/lists/*

# Explicit Corepack version
RUN npm install --global corepack@0.35.0 \
    && corepack enable

WORKDIR /app

# Install dependencies first to maximize Docker layer caching
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

RUN yarn install --immutable

# Copy application sources
COPY . .

# Expose the CLI globally for VHS tapes
RUN printf '%s\n' \
        '#!/bin/bash' \
        'exec node /app/bin/cli.js "$@"' \
        > /usr/local/bin/moleculer-gen \
    && chmod +x /usr/local/bin/moleculer-gen \
    && command -v moleculer-gen \
    && moleculer-gen --version

WORKDIR /app