/**
 * @author e991f665b7e62df5a54fdef19053a4e75117b89 <c@catgir.ls>
 */

/** Dependencies */
import { parse, existsSync } from "@deps";

/** Errors */
import { ConfigError, ConfigVariableError } from "@src/errors";

/** Types */
import type { Obj, Ret } from "@src/types";

/** Config Class */
class Config {
  static #config: Obj | null = null;

  public static load = async (
    path: string
  ): Promise<void> => {
    if(!path.endsWith(".toml"))
      throw new ConfigError("Config files must end with `.toml`");

    const examplePath = path.replace(".toml", ".example.toml");

    if(!existsSync(path) || !existsSync(examplePath))
      throw new ConfigError(`Unable to find ${existsSync(path) ? examplePath : path}`);

    const config = parse(await Deno.readTextFile(path));
    const example = parse(await Deno.readTextFile(path.replace(".toml", ".example.toml")));

    this.#compare(config, example);

    this.#config = config;
  }

  static #compare = (
    config: Obj,
    example: Obj
  ) => {
    const configKeys = Object.keys(config),
          exampleKeys = Object.keys(example);

    /**
     * TODO: Improve error messages, allow for error message
     *       to show one.two.three - instead of just key
     */

    for(const key of exampleKeys) {
      if(configKeys.indexOf(key) === -1)
        throw new ConfigVariableError(`Unable to find key "${key}" in config!`);

      if(typeof example[key] === "object") this.#compare(config[key], example[key]);
    }
  }

  public static count = (): number =>
    Object.keys(this.#config || { }).length;

  public static get = <T = Ret>(key?: string, value?: string): T => {
    if(!this.#config || !key || (!key && !value))
      return <T>this.#config;

    let keys: string[] = key.split("."),
        _value: Ret = this.#config[keys[0]];

    if(!value)
      return _value;

    if(keys.length === 1)
      return _value[value];

    keys = keys.slice(1);

    for(const entry of keys) {
      if(!_value[entry])
        throw new ConfigVariableError(`Unable to find "${key}"`);

      _value = _value[entry];
    }

    return <T>_value[value];
  }
}

export default Config;