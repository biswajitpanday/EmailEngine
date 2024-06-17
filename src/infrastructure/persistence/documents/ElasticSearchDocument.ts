/**
 * Interface representing an Elasticsearch document.
 */
export interface ElasticSearchDocument {
  /**
   * Unique identifier for the document. Optional for new documents.
   */
  id?: string;

  /**
   * Any other properties specific to the document.
   */
  [key: string]: any;
}
