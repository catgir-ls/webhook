/**
 * @author e991f665b7e62df5a54fdef19053a4e75117b89 <c@catgir.ls>
 */

// Types
import { EventType, } from "@types";

// Managers
import { EventManager } from "@managers";

// Events
import { PingEvent, MetaEvent, PushEvent } from "@events";

// Router Classs
class Router {
  #server: Deno.Server | null = null;

  constructor() {}

  public handler = async (req: Request): Promise<Response> => {
    const event = req.headers.get("X-GitHub-Event");
    const content_type = req.headers.get("Content-Type");

    if (!event || content_type !== "application/json") {
      return new Response("401 Unauthorized", {
        status: 401,
      });
    }

    EventManager.emit(<EventType>event, await req.json());

    return new Response(null, {
      status: 200,
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
  new PingEvent(), new MetaEvent(), new PushEvent()
]);

// Initialize Router
new Router().listen(3000);
