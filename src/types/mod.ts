/**
 * @author e991f665b7e62df5a54fdef19053a4e75117b89 <c@catgir.ls>
 */

// deno-lint-ignore-file no-explicit-any

/** Types */
export type Ret = any;
export type Obj = Record<Ret, Ret>;

/** Enums */
export enum EventType {
  PING = "ping", WORKFLOW_JOB = "workflow_job"
}