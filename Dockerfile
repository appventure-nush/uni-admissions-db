FROM node:12-alpine

RUN adduser -S uni-admissions-db
USER uni-admissions-db
RUN mkdir /home/uni-admissions-db/uni-admissions-db
WORKDIR /home/uni-admissions-db/uni-admissions-db
COPY --chown=uni-admissions-db:root . .
WORKDIR backend

RUN npm ci --production
RUN npm build
