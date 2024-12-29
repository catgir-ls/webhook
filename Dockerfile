FROM denoland/deno:2.1.4

EXPOSE 3000

WORKDIR /app
USER deno
COPY deps.ts .
RUN deno cache deps.ts

COPY . .
RUN deno cache main.ts

CMD ["run", "-A", "main.ts"]