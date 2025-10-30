FROM oven/bun:1

WORKDIR /usr/src/app

COPY package.json ./

RUN bun install

COPY . .

EXPOSE 3001

CMD ["bun", "run", "dev"]
