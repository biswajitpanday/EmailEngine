export interface ElasticSearchDocument {
  id?: string; // Optional for new documents
  [key: string]: any; // Allow for any other properties
}
