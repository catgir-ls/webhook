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

// MetaEvent Class
class MetaEvent extends Event {
  constructor() {
    super({
      name: "MetaEvent",
      events: [ EventType.META ]
    })
  }

  public execute = ({ action, repository, sender }: Obj) => {
    if(action !== "deleted") {
      console.log(`[x] GitHub sent an invalid "meta" event!`);
    }

    console.log(`[x] Removed from ${repository.full_name} by ${sender.login}`);

    Webhook.send({
      description: `> Removed from [\`${repository.full_name}\`](https://github.com/${repository.full_name})`,
      ...Webhook.getDefaults(sender)
    });
  }
}

export default MetaEvent;