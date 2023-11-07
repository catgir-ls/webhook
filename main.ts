/**
 * @author e991f665b7e62df5a54fdef19053a4e75117b89 <c@catgir.ls>
 */

// Utils
import { Config, Logger } from "@utils";

// Managers
import { EventManager } from "@managers";

// Events
import { PingEvent, MetaEvent, BranchCreateEvent, PushEvent } from "@events";

// Types
import { EventType } from "@types";

// Config
const config = Deno.env.get("CONFIG") ?? (
  Deno.env.get("ENVIRONMENT") === "development"
    ? "config.dev.toml"
    : "config.toml"
);

await Config.load(config);

Logger.log(`Loaded ${Object.keys(Config.get()).length} item(s) into the config!`);

// Variables
const Encoder = new TextEncoder();

// Constants
const APP_PORT = Config.get<number>("app", "port");

// Router Classs
class Router {
  #server: Deno.Server | null = null;
  
  readonly #secret: string;

  constructor(secret: string) {
    this.#secret = secret;
  }

  public isValidSecret = async (
    signature: string,
    payload: string
  ): Promise<boolean> => {
    const key = await crypto.subtle.importKey(
      "raw", Encoder.encode(this.#secret),
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
      !req.headers.get("X-Hub-Signature-256") ||
      !await this.isValidSecret(req.headers.get("X-Hub-Signature-256")!, JSON.stringify(body))
    ) return new Response("500 Internal Server Error", {
      status: 500
    });

    if(Config.get<boolean>("app", "debug")) Logger.log(`Received ${event}`);
    
    EventManager.emit(<EventType>event, body);

    return new Response(null, {
      status: 202,
    });
  };

  public listen = (port: number) => {
    if(this.#server) return;

    try {
      this.#server = Deno.serve({
        port: port ?? 3000,
  
        onListen: () => Logger.log(`Succesfully bound to ${APP_PORT} - http://localhost:${APP_PORT}`),
  
        onError: (e: unknown) => {
          if(e instanceof Error)
            Logger.error(e.message ?? e.toString());

          return new Response("500 Internal Server Error", {
            status: 500
          });
        }
      }, this.handler);
    } catch(e) {
      if(!(e instanceof Deno.errors.AddrInUse))
        throw e;

      Logger.error(`Unable to bind to port: ${APP_PORT} - is something already running?`);
      Deno.exit(1);
    }
  };
}

// Register Events
EventManager.register([
  new PingEvent(), new MetaEvent(),
  new BranchCreateEvent(), new PushEvent()
]);

Logger.log("Succesfully registered events!");

// Initialize Router
new Router(Config.get<string>("app", "secret")).listen(APP_PORT);