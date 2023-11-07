/**
 * @author e991f665b7e62df5a54fdef19053a4e75117b89 <c@catgir.ls>
 */

// Types
import {
  type Obj,
  type Commit,
  
  Event,
  EventType
} from "@types";

// PushEvent Class
class PushEvent extends Event {
  constructor() {
    super({
      name: "PushEvent",
      events: [ EventType.PUSH ]
    })
  }

  public execute = ({ ref, repository, commits }: Obj) => {
    const { added, removed, modified }: Commit = commits.reduce(
      (acc: Commit, obj: Commit) => ({
        added: [...acc.added, ...obj.added],
        removed: [...acc.removed, ...obj.removed],
        modified: [...acc.modified, ...obj.modified],
      }),
      { added: [], removed: [], modified: [] }
    );

    console.log(`= Repository: ${repository.full_name} (${ref.split("refs/heads/")[1]})`);
    console.log(`= Commits: ${commits.length}`);
    console.log(`= Added: ${added.length} | Removed: ${removed.length} | Modified: ${modified.length}`);
  }
}

export default PushEvent;