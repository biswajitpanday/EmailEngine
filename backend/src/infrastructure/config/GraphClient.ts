import { Client } from '@microsoft/microsoft-graph-client';

export class GraphClient {
  private static client: Client | null = null;

  public static getClient(accessToken: string): Client {
    if (!this.client) {
      this.client = Client.init({
        authProvider: (done) => {
          done(null, accessToken);
        },
      });
    }
    return this.client;
  }
}
