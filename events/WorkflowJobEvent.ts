/**
 * @author e991f665b7e62df5a54fdef19053a4e75117b89 <c@catgir.ls>
 */

// Types
import {
  type Obj,
  
  Event,
  EventType
} from "@types";

// Utils
import { Webhook } from "@utils";

// WorkflowJobEvent Class
class WorkflowJobEvent extends Event {
  constructor() {
    super({
      name: "WorkflowJobEvent",
      events: [ EventType.WORKFLOW_JOB ]
    });
  }

  public execute = async ({ action, workflow_job, repository, sender }: Obj) => {
    if(action !== "completed") return;

    const completed_steps = workflow_job.steps.filter((step: Obj) => step.conclusion === "success").length
    let description = `>  Workflow in [\`${repository.full_name}\`](https://github.com/${repository.full_name}) has successfully completed **${completed_steps}/${workflow_job.steps.length}** steps`
    if(completed_steps != workflow_job.steps.length)
    description = `> Workflow in [\`${repository.full_name}\`](https://github.com/${repository.full_name}) has failed to complete successfully`;

    await Webhook.send({
      title: `Pipeline for ${repository.full_name}`,
      description,
      fields: [{
        name: `\`Steps\``,
        value: `\`\`\`fix\n${workflow_job.steps.map((step: Obj) => `${step.name.replace(/\*\*\*/g, "registry")} ${step.conclusion === "success" ? "✅" : "❌"}`).join("\n")}\n\`\`\``
      }],
      ...Webhook.getDefaults(sender)
    });
  } 
}

export default WorkflowJobEvent;