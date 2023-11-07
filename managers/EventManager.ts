/**
 * @author e991f665b7e62df5a54fdef19053a4e75117b89 <c@catgir.ls>
 */

// Types
import {
  type Obj,

  EventType,
  Event
} from "@types";

// EventManager Class
class EventManager {
  static #events: Set<Event> = new Set<Event>();

  public static register = (
    ...events: (Event | Event[])[] /** Fucky TypeScript fix */
  ): void => {
    for(const event of events.flat()) {
      if(this.#events.has(event)) continue;

      this.#events.add(event);
    }
  }

  public static emit = async (event: EventType, data: Obj) => {
    for(const _event of this.#events) {
      if(_event.events.indexOf(event) === -1) continue;

      await _event.execute(data);
    }
  }
}

export default EventManager;