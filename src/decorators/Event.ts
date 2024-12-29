/**
 * @author e991f665b7e62df5a54fdef19053a4e75117b89 <c@catgir.ls>
 */

// deno-lint-ignore-file ban-types

/** Managers */
import { EventManager } from "@src/managers";

/** Types */
import {
  type Ret,

  EventType,
} from "@src/types";

/** Event Decorator */
const Event = (events: EventType[]): Function => (
  object: Ret,
) => {
  const instance = new object();

  if(!instance.execute)
    return;

  for(const event of events)
    EventManager.register(event, instance.execute)
}

export { Event }