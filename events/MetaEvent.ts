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
import { Config, Webhook, Logger } from "@utils";

// MetaEvent Class
class MetaEvent extends Event {
  constructor() {
    super({
      name: "MetaEvent",
      events: [ EventType.META ]
    })
  }

  public execute = async ({ action, repository, organization, sender }: Obj) => {
    if(action !== "deleted" && Config.get<boolean>("app", "debug")) {
      Logger.error(`[x] GitHub sent an invalid "meta" event!`);
    }

    const name = organization?.login ?? repository?.full_name; 

    await Webhook.send({
      description: `> Removed from [\`${name}\`](https://github.com/${name})`,
      ...Webhook.getDefaults(sender)
    });
  }
}

export default MetaEvent;