/**
 * Class representing a paging request
 */
export class PagingRequest {
  public limit: number;
  public skip: number;

  /**
   * Creates an instance of PagingRequest
   * @param pageNumber - The current page number (starting from 1)
   * @param perPage - The number of items per page (default is 100)
   */
  constructor(pageNumber: number, perPage: number = 100) {
    if (pageNumber < 1) {
      throw new Error('Page number must be greater than or equal to 1');
    }
    if (perPage < 1) {
      throw new Error('Items per page must be greater than or equal to 1');
    }
    this.skip = (pageNumber - 1) * perPage;
    this.limit = perPage;
  }
}
