/**
 * @author e991f665b7e62df5a54fdef19053a4e75117b89 <c@catgir.ls>
 */

// Types
import { EventType, } from "@types";

// Managers
import { EventManager } from "@managers";

// Events
import { PingEvent, MetaEvent, BranchCreateEvent, PushEvent } from "@events";

// Variables
const Encoder = new TextEncoder();

// Router Classs
class Router {
  #server: Deno.Server | null = null;

  constructor() {}

  public isValidSecret = async (
    signature: string,
    payload: string
  ): Promise<boolean> => {
    const key = await crypto.subtle.importKey(
      "raw", Encoder.encode(Deno.env.get("SECRET")!),
      { name: "HMAC", hash: { name: "SHA-256" } },
      false, [ "sign", "verify" ]
    );

    const bytes = new Uint8Array(signature.split("=")[1].match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));

    return await crypto.subtle.verify(
      "HMAC", key, bytes,
      Encoder.encode(payload)
    );
  }

  public handler = async (req: Request): Promise<Response> => {
    const event = req.headers.get("X-GitHub-Event");
    const content_type = req.headers.get("Content-Type");

    if(!event || content_type !== "application/json")
      return new Response("401 Unauthorized", {
        status: 401
      });

    const body = await req.json();

    if(
      req.headers.get("X-Hub-Signature-256") && 
      !await this.isValidSecret(req.headers.get("X-Hub-Signature-256")!, JSON.stringify(body))
    ) return new Response("500 Internal Server Error", {
      status: 500
    });

    EventManager.emit(<EventType>event, body);

    return new Response(null, {
      status: 202,
    });
  };

  public listen = (port: number) => {
    if (this.#server) return;

    this.#server = Deno.serve({
      port: port ?? 3000,
    }, this.handler);
  };
}

// Register Events
EventManager.register([
  new PingEvent(), new MetaEvent(),
  new BranchCreateEvent(), new PushEvent()
]);

// Initialize Router
new Router().listen(3000);
