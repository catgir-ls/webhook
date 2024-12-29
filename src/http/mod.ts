/**
 * @author e991f665b7e62df5a54fdef19053a4e75117b89 <c@catgir.ls>
 */

/** Managers */
import { EventManager } from "@src/managers";

/** Errors */
import { HttpError } from "@src/errors";

/** Types */
import {
  type Ret,

  EventType
} from "@src/types";

/** Router Class */
class Router {
  private readonly encoder = new TextEncoder();

  private server: Deno.HttpServer | null = null;

  constructor(
    private readonly secret: string,
    private readonly _events: Ret[] /** This is only used to trigger decorator */
  ) { }

  private isValidSecret = async (
    signature: string,
    payload: string
  ): Promise<boolean> => {
    const key = await crypto.subtle.importKey(
      "raw", this.encoder.encode(this.secret),
      { name: "HMAC", hash: { name: "SHA-256" } },
      false, [ "sign", "verify" ]
    );

    const bytes = new Uint8Array(
      signature.split("=")[1]
        .match(/.{1,2}/g)!
        .map(byte => parseInt(byte, 16))
    );

    return await crypto.subtle.verify(
      "HMAC", key, bytes,
      this.encoder.encode(payload)
    );
  }

  private handler = async (req: Request): Promise<Response> => {
    const event = req.headers.get("X-Github-Event"),
          content_type = req.headers.get("Content-Type");

    if(!event || content_type !== "application/json")
      throw new HttpError(401, "401 Unauthorized");

    const body = await req.json();

    if(
      !req.headers.get("X-Hub-Signature-256") ||
      !await this.isValidSecret(req.headers.get("X-Hub-Signature-256")!, JSON.stringify(body))
    ) throw new HttpError(500, "Internal Server Error");

    console.log(`Handling: ${event}`);
    EventManager.emit(event as EventType, body);

    return new Response("OK", {
      status: 200
    });
  }

  public listen = (
    port = 3000,
    callback: (e?: Error) => void
  ) => {
    if(this.server) return;

    try {
      this.server = Deno.serve({
        port: port,

        onListen: () => callback(undefined),

        onError: (e: unknown) => {
          if(e instanceof HttpError)
            return new Response(e.message, {
              status: e.status
            })

          if(e instanceof Error)
            callback(e);

          throw new HttpError(500, "Internal Server Error")
        }
      }, this.handler);
    } catch(e) {
      callback(e as Error);
    }
  }
}

export { Router }