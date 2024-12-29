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

  public static init = (): boolean => {
    if(!this.isKubernetesEnvironment()) 
      return false;

    this.base_url = `https://${Deno.env.get("KUBERNETES_SERVICE_HOST")}:${Deno.env.get("KUBERNETES_SERVICE_PORT")}`;
    this.token = Deno.readTextFileSync(TOKEN_PATH);
    
    return true;
  }
}

export { Kubernetes }