# ---- Base Node ----
FROM public.ecr.aws/docker/library/node:20-slim AS base

RUN apt-get update && apt-get install -y \
   git gettext python3 \
   && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

WORKDIR /app
RUN mkdir -p src templates && chown -R node:node /app
USER node

# ---- Dependencies ----
FROM base AS dependencies
COPY --chown=node:node ./package*.json ./
RUN npm ci

# ---- Build ----
FROM dependencies AS build
WORKDIR /app
COPY ./src /app/src
COPY ./ts*.json ./
COPY nest-cli.json ./
COPY ormconfig.ts ./
RUN npm run build
RUN ls -la /app/dist  # Verify the contents of the dist directory

# ---- Polishing ----
FROM base AS polishing
COPY --chown=node:node ./package*.json ./
RUN npm ci

# --- Release with Alpine ----
FROM base AS release

ARG SWAGGER_VERSION
ENV SWAGGER_VERSION $SWAGGER_VERSION

WORKDIR /app
RUN echo "SWAGGER_VERSION=$SWAGGER_VERSION" >> .buildenv
RUN mkdir -p dist templates node_modules && chown -R node:node /app
RUN echo "Build with version:" ${SWAGGER_VERSION}

USER node
COPY --from=polishing /app/node_modules node_modules/
COPY --from=build /app/dist dist/
COPY --from=build /app/templates templates/
COPY --from=build /app/ormconfig.ts ./
COPY ./package*.json ./

COPY ./docker/entrypoint.sh ./entrypoint.sh
COPY .env.sample ./.env.sample

CMD ["/bin/sh", "/app/entrypoint.sh"]
EXPOSE 3000
EXPOSE 5432