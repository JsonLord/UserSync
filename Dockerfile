FROM node:20-slim
WORKDIR /app

# Use the existing node user
USER node
ENV HOME=/home/node \
    PATH=/home/node/.local/bin:$PATH

WORKDIR $HOME/app

COPY --chown=node:node dist ./dist
COPY --chown=node:node package*.json ./
RUN npm install --only=production
COPY --chown=node:node server.cjs ./

EXPOSE 7860
CMD ["node", "server.cjs"]
