FROM node:18-alpine AS base

WORKDIR /usr/src/app

COPY ./package* ./

# RUN npm set progress=false && npm config set depth 0
RUN npm i

COPY nest-cli.json ./
COPY tsconfig* ./
COPY env ./env
COPY .eslintrc.js ./.eslintrc.js
COPY shared ./shared

COPY apps /usr/apps

FROM node:18-alpine AS auth
WORKDIR /usr/src/app
COPY --from=base /usr/src/app/ .
COPY --from=base /usr/apps/auth ./apps/auth
CMD ["npm","run","start:dev","auth"]

FROM node:18-alpine AS film-critic
WORKDIR /usr/src/app
COPY --from=base /usr/src/app/ .
COPY --from=base /usr/apps/film-critic ./apps/film-critic
CMD ["npm","run","start:dev","film-critic"]

FROM node:18-alpine AS notification
WORKDIR /usr/src/app
COPY --from=base /usr/src/app/ .
COPY --from=base /usr/apps/notification ./apps/notification
CMD ["npm","run","start:dev","notification"]

