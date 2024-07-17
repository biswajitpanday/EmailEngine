import { EmailModel } from '../../infrastructure/persistence/documents/EmailModel';
import { IElasticsearchRepository } from './IElasticSearchRepository';

export interface IEmailSyncRepository
  extends IElasticsearchRepository<EmailModel> {
  /**
   * Creates a new email document or updates an existing one.
   * @param emailDocument - The email document to create or update.
   * @returns A promise that resolves when the operation is complete.
   */
  createOrUpdate(emailDocument: EmailModel): Promise<void>;

  /**
   * Finds an email document by the provided email ID.
   * @param id - The email ID.
   * @returns A promise that resolves to the email document or null if not found.
   */
  findByEmailId(id: string): Promise<EmailModel | null>;
}
