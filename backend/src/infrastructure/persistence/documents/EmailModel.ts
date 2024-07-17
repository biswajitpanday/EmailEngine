import { ElasticSearchDocument } from './ElasticSearchDocument';

export class EmailModel extends ElasticSearchDocument {
  public userId: string;
  public createdDateTime: string;
  public lastModifiedDateTime?: string;
  public receivedDateTime: string;
  public sentDateTime: string;
  public subject: string;
  public from: { name: string; email: string };
  public to: { name: string; email: string }[];
  public cc: { name: string; email: string }[];
  public bcc: { name: string; email: string }[];
  public replyTo: { name: string; email: string }[];
  public body: string;
  public attachments: { filename: string; url: string; type: string }[];
  public isRead: boolean;
  public isFlagged: boolean;
  public categories: string[];
  public importance: string;
  public parentFolderId: string;
  public conversationId: string;
  public conversationIndex: string;
  public internetMessageId: string;
  public isDeliveryReceiptRequested: boolean;
  public isReadReceiptRequested: boolean;
  public isDraft: boolean;
  public webLink: string;
  public inferenceClassification: string;
  public changeKey: string;
  public flag: { flagStatus: string };
  public provider: string; // Additional field to identify the email provider
  public etag: string; // @odata.etag

  /**
   * EmailModel constructor
   * @param userId - ID of the user owning the email
   * @param createdDateTime - Date and time the email was created
   * @param receivedDateTime - Date and time the email was received
   * @param sentDateTime - Date and time the email was sent
   * @param subject - Email subject
   * @param from - Sender information
   * @param to - Recipients information
   * @param body - Email body content
   * @param isRead - Flag indicating if the email has been read
   * @param isFlagged - Flag indicating if the email has been flagged
   * @param categories - Categories assigned to the email
   * @param importance - Importance level of the email
   * @param parentFolderId - ID of the parent folder containing the email
   * @param conversationId - ID of the conversation the email belongs to
   * @param conversationIndex - Index of the email within the conversation
   * @param internetMessageId - Internet message ID of the email
   * @param isDeliveryReceiptRequested - Flag indicating if delivery receipt is requested
   * @param isReadReceiptRequested - Flag indicating if read receipt is requested
   * @param isDraft - Flag indicating if the email is a draft
   * @param webLink - Web link to the email
   * @param inferenceClassification - Inference classification of the email
   * @param changeKey - Change key of the email
   * @param flag - Flag status of the email
   * @param provider - Email provider (e.g., Outlook, Gmail)
   * @param etag - ETag for the email
   */
  constructor(
    userId: string,
    createdDateTime: string,
    receivedDateTime: string,
    sentDateTime: string,
    subject: string,
    from: { name: string; email: string },
    to: { name: string; email: string }[],
    body: string,
    isRead: boolean,
    isFlagged: boolean,
    categories: string[],
    importance: string,
    parentFolderId: string,
    conversationId: string,
    conversationIndex: string,
    internetMessageId: string,
    isDeliveryReceiptRequested: boolean,
    isReadReceiptRequested: boolean,
    isDraft: boolean,
    webLink: string,
    inferenceClassification: string,
    changeKey: string,
    flag: { flagStatus: string },
    provider: string,
    etag: string,
    lastModifiedDateTime?: string,
    cc: { name: string; email: string }[] = [],
    bcc: { name: string; email: string }[] = [],
    replyTo: { name: string; email: string }[] = [],
    attachments: { filename: string; url: string; type: string }[] = [],
  ) {
    super();
    this.userId = userId;
    this.createdDateTime = createdDateTime;
    this.receivedDateTime = receivedDateTime;
    this.sentDateTime = sentDateTime;
    this.subject = subject;
    this.from = from;
    this.to = to;
    this.body = body;
    this.isRead = isRead;
    this.isFlagged = isFlagged;
    this.categories = categories;
    this.importance = importance;
    this.parentFolderId = parentFolderId;
    this.conversationId = conversationId;
    this.conversationIndex = conversationIndex;
    this.internetMessageId = internetMessageId;
    this.isDeliveryReceiptRequested = isDeliveryReceiptRequested;
    this.isReadReceiptRequested = isReadReceiptRequested;
    this.isDraft = isDraft;
    this.webLink = webLink;
    this.inferenceClassification = inferenceClassification;
    this.changeKey = changeKey;
    this.flag = flag;
    this.provider = provider;
    this.etag = etag;
    this.lastModifiedDateTime = lastModifiedDateTime;
    this.cc = cc;
    this.bcc = bcc;
    this.replyTo = replyTo;
    this.attachments = attachments;
  }
}
