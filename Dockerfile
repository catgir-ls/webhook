FROM denoland/deno:2.1.4

EXPOSE 3000

WORKDIR /app
USER deno
COPY . . 

RUN deno cache deps.ts
RUN deno cache main.ts

CMD ["run", "-A", "--unsafely-ignore-certificate-errors", "main.ts"]