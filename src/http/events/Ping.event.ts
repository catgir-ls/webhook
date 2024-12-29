/**
 * @author e991f665b7e62df5a54fdef19053a4e75117b89 <c@catgir.ls>
 */

/** Dependencies */
import { Event } from "@src/decorators";

/** Utils */
import { Logger } from "@src/utils";

/** Types */
import {
  type Obj,

  EventType
} from "@src/types";

/** Ping Event */
@Event([ EventType.PING ])
class PingEvent {
  public execute = ({ repository, organization }: Obj) => {
    const name = organization?.login ?? repository?.full_name; 

    Logger.log(`Added to ${name}`);
  }
}

export { PingEvent }