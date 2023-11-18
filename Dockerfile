FROM node:20-alpine

WORKDIR /app

COPY package.json ./

RUN yarn global add esbuild && yarn global add vite

RUN yarn install

#COPY . .

# add dist folder and set permissions for uploads folder
RUN mkdir dist && mkdir dist/uploads \
    && chmod -R 777 /app/dist \
    && chmod -R 777 /app/dist/uploads

VOLUME /app

# inform docker that the app will use the uploads folder
VOLUME /app/dist/uploads

EXPOSE 3000

CMD ["yarn", "dev"]
