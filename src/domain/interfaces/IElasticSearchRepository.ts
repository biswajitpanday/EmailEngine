import { ElasticSearchDocument } from "../../infrastructure/persistence/documents/ElasticSearchDocument";

export interface IElasticsearchRepository<T extends ElasticSearchDocument> {
  create(document: T): Promise<T>;
  getById(id: string): Promise<T | null>;
  update(id: string, document: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<void>;
  search(query: any): Promise<T[]>;
}
