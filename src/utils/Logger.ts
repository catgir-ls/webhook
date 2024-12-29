/**
 * @author e991f665b7e62df5a54fdef19053a4e75117b89 <c@catgir.ls>
 */

/** Logger Util */
class Logger {
  static #colors: Record<string, string> = {
    TEXT_COLOR: "\x1b[38;2;160;129;226m",
    SUCCESS: "\x1b[38;2;159;234;121m",
    WARN: "\x1b[38;2;242;223;104m",
    ERROR: "\x1b[38;2;242;106;104m",
    RESET: "\x1b[0m"
  }

  static #getTime = (): string =>
    new Date().toLocaleTimeString().split(" ")[0];

  static #log = (
    color: string,
    message: string
  ) => console.log(`${this.#colors.TEXT_COLOR}catgir.ls >.< ${this.#colors.RESET}| ${this.#colors[color]}${this.#getTime()} ${this.#colors.RESET}| ${message}`);

  public static log = (message: string) => this.#log("SUCCESS", message);
  public static warn = (message: string) => this.#log("WARN", message);
  public static error = (message: string) => this.#log("ERROR", message);
}

export { Logger };