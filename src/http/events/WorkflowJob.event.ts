/**
 * @author e991f665b7e62df5a54fdef19053a4e75117b89 <c@catgir.ls>
 */

/** Dependencies */
import { Event } from "@src/decorators";

/** Utils */
import { Logger } from "../../utils/Logger.ts";

/** Config */
import Config from "@src/config";

/** Types */
import {
  type Obj,

  EventType
} from "@src/types";
import { Kubernetes } from "../../utils/Kubernetes.ts";

/** WorkflowJob Event */
@Event([ EventType.WORKFLOW_JOB ])
class WorkflowJobEvent {
  public execute = async ({ action, workflow_job, repository }: Obj) => {
    if(action !== "completed") return;

    Logger.log(`Workflow in ${repository.full_name} has ${workflow_job.conclusion === "success" ? "completed" : "failed"}`);

    if(!await Kubernetes.update(
      Config.get<string>("kubernetes", "namespace"),
      repository.name
    )) return Logger.error(`Unable to push update for ${repository.full_name}`);

    Logger.log(`Succesfully pushed update for ${repository.full_name}`);
  }
}

export { WorkflowJobEvent }