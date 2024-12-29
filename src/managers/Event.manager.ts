/**
 * @author e991f665b7e62df5a54fdef19053a4e75117b89 <c@catgir.ls>
 */

/** Types */
import {
  type Obj,

  EventType
} from "@src/types";

/** Event Manager */
class EventManager {
  private static events = new Map<EventType, Array<(data: Obj) => Promise<void>>>();

  public static register = (
    event: EventType,
    handler: (data: Obj) => Promise<void>
  ) => {
    const handlers = this.events.get(event) ?? [ ];
    handlers.push(handler);

    this.events.set(event, handlers);
  }

  public static emit = async (
    event: EventType,
    data: Obj
  ) => {
    const handlers = this.events.get(event) ?? [ ];

    for(const handler of handlers)
      await handler(data);
  }
}

export { EventManager }