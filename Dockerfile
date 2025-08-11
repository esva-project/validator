FROM node:alpine
WORKDIR /app

COPY ./package.json ./

ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache \
    python3 \
    py3-pip \
    openssl \
    make \
    g++

# Upgrade pip inside the system environment safely (with override)
RUN pip3 install --no-cache --upgrade pip setuptools --break-system-packages

RUN apk update && apk add make g++

RUN npm i

COPY ./ ./

EXPOSE 6060
EXPOSE 4000

CMD ["npm", "run", "start"]