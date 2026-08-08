# ------------------------------------
# First stage: install dependencies
# ------------------------------------
FROM node:24-alpine AS builder

WORKDIR /usr/app

RUN corepack enable

COPY package.json yarn.lock .yarnrc.yml ./

# Install production dependencies
RUN yarn install --immutable
RUN yarn workspaces focus --all --production

# ------------------------------------
# Final stage: runtime image
# ------------------------------------
FROM node:24-alpine

WORKDIR /usr/app

# Copy only node_modules from builder
COPY --from=builder /usr/app/node_modules ./node_modules

# Copy the rest of the app source
COPY . .

# Clean up unnecessary files (npm cache, apk cache, etc.)
RUN rm -rf /tmp/* /var/cache/apk/* /root/.npm /root/.node-gyp || true \
    && npm cache clean --force \
    && rm -rf node_modules/.cache

# Use non-root user
USER node