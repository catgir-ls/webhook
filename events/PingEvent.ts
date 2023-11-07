/**
 * @author e991f665b7e62df5a54fdef19053a4e75117b89 <c@catgir.ls>
 */

// Types
import {
  type Obj,
  
  Event,
  EventType
} from "@types";

// Webhook
import Webhook from "@webhook";

// PingEvent Class
class PingEvent extends Event {
  constructor() {
    super({
      name: "PingEvent",
      events: [ EventType.PING ]
    });
  }

  public execute = ({ repository, sender }: Obj) => {
    console.log(`[x] Added to ${repository.full_name} by ${sender.login}`);

    Webhook.send({
      description: `> Added to [\`${repository.full_name}\`](https://github.com/${repository.full_name})`,
      ...Webhook.getDefaults(sender)
    });
  }
}

export default PingEvent;