/**
 * @author e991f665b7e62df5a54fdef19053a4e75117b89 <c@catgir.ls>
 */

// Types
import {
  type Obj,

  type PartialCommit,
  
  Event,
  EventType
} from "@types";

// Webhook
import Webhook from "@webhook";

// PushEvent Class
class PushEvent extends Event {
  constructor() {
    super({
      name: "PushEvent",
      events: [ EventType.PUSH ]
    })
  }

  public execute = async ({ ref, repository, commits, sender }: Obj) => {
    const { added, removed, modified }: PartialCommit = commits.reduce(
      (acc: PartialCommit, obj: PartialCommit) => ({
        added: [...acc.added, ...obj.added],
        removed: [...acc.removed, ...obj.removed],
        modified: [...acc.modified, ...obj.modified],
      }),
      { added: [], removed: [], modified: [] }
    );

    await Webhook.send({
      title: `Commit to ${repository.full_name} (${ref.split("heads/")[1]})`,
      description: [
        `>>> There's been **${commits.length}** ${commits.length === 1 ? "commit" : "commits"} to [\`${repository.full_name}\`](https://github.com/${repository.full_name})`,
        "```diff",
        added.length > 0 ? `+ Added ${added.length} ${added.length === 1 ? "file" : "files"}` : "",
        removed.length > 0 ? `- Deleted ${removed.length} ${removed.length === 1 ? "file" : "files"}` : "",
        modified.length > 0 ? `! Modified ${modified.length} ${modified.length === 1 ? "file" : "files"}` : "",
        "```"
      ].join("\n"),
      fields: commits.map((commit: PartialCommit) => ({
        name: `\`${commit.id.slice(0, 8)}\``,
        value: `\`\`\`fix\n${commit.message}\n\`\`\``,
        inline: true
      })),
      ...Webhook.getDefaults(sender)
    });
  }
}

export default PushEvent;