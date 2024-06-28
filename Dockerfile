FROM node:20-alpine
RUN apk add -U tzdata
ENV TZ Asia/Ho_Chi_Minh
ARG PORT
ENV PORT=${PORT}
WORKDIR /usr/src/app
COPY . ./
RUN yarn install \
    && yarn cache clean
RUN yarn build
ENV NODE_ENV=production
EXPOSE $PORT
CMD ["yarn", "start"]
