import { ElasticSearchDocument } from './ElasticSearchDocument';

export class FolderModel extends ElasticSearchDocument {
  public userId: string;
  public provider: string;
  public name?: string;
  public displayName?: string;
  public parentFolderId?: string;

  /**
   * FolderModel constructor
   * @param id - The unique identifier of the folder.
   * @param userId - The ID of the user who owns the folder.
   * @param provider - The email provider (e.g., Outlook, Gmail).
   * @param name - The internal name of the folder.
   * @param displayName - The display name of the folder.
   * @param parentFolderId - The ID of the parent folder, if applicable.
   */
  constructor(
    id: string,
    userId: string,
    provider: string,
    name?: string,
    displayName?: string,
    parentFolderId?: string,
  ) {
    super();
    this.id = id;
    this.userId = userId;
    this.provider = provider;
    this.name = name;
    this.displayName = displayName;
    this.parentFolderId = parentFolderId;
  }
}
