FROM node:4-onbuild

#TODO fill email below
LABEL maintainer "your.email.here@domain.com"

COPY dist/ /

ENV NODE_ENV=production

EXPOSE 8080

CMD node /server.js
