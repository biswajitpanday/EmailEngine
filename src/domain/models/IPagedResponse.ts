/**
 * Interface representing a paginated response
 * @template T - The type of the items in the paginated list
 */
export interface IPagedResponse<T> {
    /**
     * The list of items in the current page
     */
    list: T[];
  
    /**
     * The total count of items available
     */
    count: number;
  }
  