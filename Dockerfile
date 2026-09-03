FROM node:latest

WORKDIR /project
RUN npm init -y --init-type=module
RUN npm install --save-dev \
  @types/node \
  typescript \
  oxfmt \
  oxlint \
  vite

WORKDIR /project/src

EXPOSE 5173

CMD ["npx", "vite", "--host"]
