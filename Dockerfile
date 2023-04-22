FROM node:18-alpine

WORKDIR /app

VOLUME /app

#COPY package.json yarn.lock ./

#RUN yarn install

EXPOSE 3000

 CMD ["yarn", "dev"]