/**
 * @author e991f665b7e62df5a54fdef19053a4e75117b89 <c@catgir.ls>
 */

// Types
// deno-lint-ignore no-explicit-any
export type Ret = any;
export  type Obj = Record<Ret, Ret>;

export type EventOpts = {
  name: string,
  events: EventType[]
}

export type PartialSender = {
  login: string,
  avatar_url: string
}

export type PartialCommit = {
  id: string,
  message: string

  added: string[],
  removed: string[]
  modified: string[]
}

// Enums
export enum EventType {
  PING = "ping", META = "meta",
  PUSH = "push"
}

export enum Color {
  TEXT_COLOR = "\x1b[38;2;160;129;226m",
  SUCCESS = "\x1b[38;2;159;234;121m",
  WARN = "\x1b[38;2;242;223;104m",
  ERROR = "\x1b[38;2;242;106;104m",
  RESET = "\x1b[0m"
}

// Classes
export abstract class Event {
  public name: string;
  public events: EventType[];

  constructor({ name, events }: EventOpts) {
    this.name = name;
    this.events = events;
  }

  abstract execute(data: Obj): Promise<void>;
}