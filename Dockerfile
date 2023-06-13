FROM node:18-alpine

WORKDIR /app

COPY package.json ./

RUN yarn global add esbuild && yarn global add vite

RUN yarn install

#COPY . .

VOLUME /app

EXPOSE 3000

CMD ["yarn", "dev"]
