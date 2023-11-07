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

// BranchCreateEvent Class
class BranchCreateEvent extends Event {
  constructor() {
    super({
      name: "BranchCreateEvent",
      events: [ EventType.PUSH ]
    })
  }

  public execute = async ({ ref, repository, created, sender }: Obj) => {
    if(!created) return;

    console.log(`[x] Branch ${ref.split("heads/")[1]} in ${repository.full_name} created by ${sender.login}`);

    await Webhook.send({
      description: `> Branch [\`${ref.split("heads/")[1]}\`](https://github.com/${repository.full_name}/tree/${ref.split("heads/")[1]}) has been created in [\`${repository.full_name}\`](https://github.com/${repository.full_name})`,
      ...Webhook.getDefaults(sender)
    });
  }
}

export default BranchCreateEvent;