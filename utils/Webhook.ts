/**
 * @author e991f665b7e62df5a54fdef19053a4e75117b89 <c@catgir.ls>
 */

// Utils
import { Config } from "@utils";

// Types
import type { Obj, PartialSender } from "@types";

// Webhook Class
class Webhook {
  public static send = async (embed: Obj) => await fetch(Config.get<string>("discord", "webhook_url"), { 
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      embeds: [ embed ]
    })
  });

  public static getDefaults = (sender: PartialSender) => ({
    color: 15487934,
    author: {
      name: sender.login,
      url: `https://github.com/${sender.login}`,
      icon_url: sender.avatar_url
    }
  })
}

export default Webhook;