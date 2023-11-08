FROM denoland/deno:1.38.0

EXPOSE 3000

WORKDIR /app
USER deno
COPY deps.ts .
RUN deno cache deps.ts

COPY . .
RUN deno cache main.ts

CMD ["run", "-A", "main.ts"]