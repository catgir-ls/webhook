/**
 * @author e991f665b7e62df5a54fdef19053a4e75117b89 <c@catgir.ls>
 */

/** Generic Error */
const GenericError = (name: string) => class extends Error {
  constructor(message: string) {
    super(message);

    this.name = name;
    this.stack = (<Error>new Error()).stack;
  }
}

/** Http Error */
class HttpError extends Error {
  status: number;

  constructor(
    status?: number,
    message?: string,
  ) {
    super();

    this.status = status ?? 500;

    this.name = "HttpError";
    this.message = message || "Internal Server Error";
    this.stack = (<Error>new Error()).stack;
  }
}

/** Errors */
export const ConfigError = GenericError("ConfigError");
export const ConfigVariableError = GenericError("ConfigVariableError");

export { HttpError }