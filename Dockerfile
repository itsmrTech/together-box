FROM node:13.12.0-alpine


ENV TZ=Asia/Tehran
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /usr/src/app

COPY ./package.json /usr/src/app/package.json
RUN npm install && npm rebuild && npm test

ADD . .
CMD ["npm", "run", "docker"]