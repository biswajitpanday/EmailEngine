import { EmailSyncModel } from '../../infrastructure/persistence/documents/EmailSyncModel';
import { IElasticsearchRepository } from './IElasticSearchRepository';

export interface IEmailSyncRepository
  extends IElasticsearchRepository<EmailSyncModel> {
  /**
   * Creates a new email document or updates an existing one.
   * @param emailDocument - The email document to create or update.
   * @returns A promise that resolves when the operation is complete.
   */
  createOrUpdate(emailDocument: EmailSyncModel): Promise<void>;

  /**
   * Finds an email document by the provided email ID.
   * @param query - The query containing the email ID.
   * @returns A promise that resolves to the email document or null if not found.
   */
  findByEmailId(query: any): Promise<EmailSyncModel | null>;
}
