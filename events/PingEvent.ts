/**
 * @author e991f665b7e62df5a54fdef19053a4e75117b89 <c@catgir.ls>
 */

// Types
import {
  type Obj,
  
  Event,
  EventType
} from "@types";

// Utils
import { Webhook } from "@utils";

// PingEvent Class
class PingEvent extends Event {
  constructor() {
    super({
      name: "PingEvent",
      events: [ EventType.PING ]
    });
  }

  public execute = async ({ repository, organization, sender }: Obj) => {
    const name = organization?.login ?? repository?.full_name; 

    console.log(`[x] Added to ${name} by ${sender.login}`);

    await Webhook.send({
      description: `> Added to [\`${name}\`](https://github.com/${name})`,
      ...Webhook.getDefaults(sender)
    });
  }
}

export default PingEvent;