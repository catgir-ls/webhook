/**
 * @author e991f665b7e62df5a54fdef19053a4e75117b89 <c@catgir.ls>
 */

/** Dependencies */
import { existsSync } from "@deps"

/** Constants */
const TOKEN_PATH = "/var/run/secrets/kubernetes.io/serviceaccount/token";

/** Kubernetes Util */
class Kubernetes {
  private static base_url: string | null = null;
  private static token: string | null = null;

  private static isKubernetesEnvironment = () => (
    Deno.env.get("KUBERNETES_SERVICE_HOST") 
    && Deno.env.get("KUBERNETES_SERVICE_PORT")
    && existsSync(TOKEN_PATH)
  );

  private static getDeployment = async (
    namespace: string,
    repository: string
  ) => {
    const response = await fetch(`${this.base_url}/apis/apps/v1/namespaces/${namespace}/deployments`, {
      headers: {
        "Authorization": `Bearer ${this.token}`,
        "Content-Type": "application/json"
      }
    }), body = await response.json();

    for(const item of body.items) {
      const [ container ] = item.spec.template.spec.containers;
      
      if(!container || container.image.indexOf(repository) === -1)
        continue;

      return item;
    }

    return null;
  }

  public static update = async (
    namespace: string,
    repository: string
  ): Promise<boolean> => {
    const deployment = await this.getDeployment(namespace, repository);

    if(!deployment)
      return false;

    deployment.spec.template.metadata.annotations = {
      ...deployment.spec.template.metadata.annotations,
      date: Date.now().toString()
    };

    const response = await fetch(`${this.base_url}/apis/apps/v1/namespaces/${namespace}/deployments/${deployment.metadata.name}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${this.token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(deployment)
    });

    return response.ok;
  }

  public static init = (): boolean => {
    if(!this.isKubernetesEnvironment()) 
      return false;

    this.base_url = `https://${Deno.env.get("KUBERNETES_SERVICE_HOST")}:${Deno.env.get("KUBERNETES_SERVICE_PORT")}`;
    this.token = Deno.readTextFileSync(TOKEN_PATH);

    return true;
  }
}

export { Kubernetes }