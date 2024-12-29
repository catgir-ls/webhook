/**
 * @author e991f665b7e62df5a54fdef19053a4e75117b89 <c@catgir.ls>
 */

/** Dependencies */
import { Event } from "@src/decorators";

/** Utils */
import { Logger } from "../../utils/Logger.ts";

/** Types */
import {
  type Obj,

  EventType
} from "@src/types";

/** WorkflowJob Event */
@Event([ EventType.WORKFLOW_JOB ])
class WorkflowJobEvent {
  public execute = ({ action, workflow_job, repository, organization }: Obj) => {
    if(action !== "completed") return;

    const name = organization?.login ?? repository?.full_name; 

    Logger.log(`Workflow in ${name} has ${workflow_job.conclusion === "success" ? "completed" : "failed"}`);
  }
}

export { WorkflowJobEvent }