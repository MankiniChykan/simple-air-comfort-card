FROM mcr.microsoft.com/devcontainers/javascript-node:1-22-bullseye
RUN apt-get update && apt-get install -y --no-install-recommends \
    zip jq ca-certificates && \
    rm -rf /var/lib/apt/lists/*
WORKDIR /workspaces