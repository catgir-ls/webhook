/**
 * @author e991f665b7e62df5a54fdef19053a4e75117b89 <c@catgir.ls>
 */

/** Dependencies */
import { Router } from "@src/http";

/** Utils */
import { Logger, Kubernetes } from "@src/utils";

/** Config */
import Config from "@src/config";

const config = Deno.env.get("CONFIG") ?? (
  Deno.env.get("ENVIRONMENT") === "development"
    ? "config.dev.toml"
    : "config.toml"
);

await Config.load(config);

Logger.log(`Loaded ${Object.keys(Config.get()).length} item(s) into the config!`);

if(!Kubernetes.init()) {
  Logger.error("This needs to be ran inside a Kubernetes environment");

  Deno.exit(1);
}

Logger.log("Succesfully initialized Kubernetes client");

/** Constants */
const APP_PORT = Config.get<number>("app", "port");

new Router(Config.get<string>("github", "secret")).listen(APP_PORT, (error) => {
  if(!error)
    return Logger.log(`Succesfully bound to ${APP_PORT} - http://127.0.0.1:${APP_PORT}`);

  if(error instanceof Deno.errors.AddrInUse)
    return Logger.error(`Unable to bind to port: ${APP_PORT} - is something already bound?`);

  Logger.error(error.message ?? error.toString());
  Deno.exit(1);
});