/**
 * @author e991f665b7e62df5a54fdef19053a4e75117b89 <c@catgir.ls>
 */

// Utils
import { Config, Logger } from "@utils";

// Watchtower Class
class Watchtower {
  public static update = async (): Promise<boolean> => {
    try {
      const response = await fetch(`${Config.get<string>("watchtower", "base_url")}/v1/update`, {
        headers: { "Authorization": `Bearer ${Config.get<string>("watchtower", "authorization")}` }
      });
      
      return response.status === 200;
    } catch(e) {
      if(Config.get<boolean>("app", "debug"))
        Logger.error(`Watchtower - ${e.message ?? e.toString()}`);

      return false;
    }
  }
}

export default Watchtower;