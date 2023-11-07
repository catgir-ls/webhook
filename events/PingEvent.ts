/**
 * @author e991f665b7e62df5a54fdef19053a4e75117b89 <c@catgir.ls>
 */

// Types
import {
  type Obj,
  
  Event,
  EventType
} from "@types";

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
  }
}

export default PingEvent;