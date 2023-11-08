FROM denoland/deno:1.36.4 as base

WORKDIR /x

COPY . .

RUN deno cache main.ts

CMD ["task", "start"]