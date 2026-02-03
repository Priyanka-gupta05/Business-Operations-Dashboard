/**
 * API Features class for handling filtering, sorting, and pagination
 * Used to build dynamic MongoDB queries
 */
class APIFeatures {
  constructor(query, queryParams) {
    this.query = query;
    this.queryParams = queryParams;
  }

  /**
   * Filter products based on query parameters
   * Supported filters: category, minPrice, maxPrice, isActive
   */
  filter() {
    const queryObj = { ...this.queryParams };

    // Fields to exclude from filtering
    const excludeFields = ['sort', 'order', 'page', 'limit'];
    excludeFields.forEach((el) => delete queryObj[el]);

    // Build filter query
    let filterQuery = {};

    // Category filter
    if (queryObj.category) {
      filterQuery.category = queryObj.category;
    }

    // Price range filter
    if (queryObj.minPrice || queryObj.maxPrice) {
      filterQuery.price = {};
      if (queryObj.minPrice) {
        filterQuery.price.$gte = parseFloat(queryObj.minPrice);
      }
      if (queryObj.maxPrice) {
        filterQuery.price.$lte = parseFloat(queryObj.maxPrice);
      }
    }

    // Active status filter
    if (queryObj.isActive !== undefined) {
      filterQuery.isActive = queryObj.isActive === 'true';
    }

    // Apply filter to query
    this.query = this.query.find(filterQuery);
    return this;
  }

  /**
   * Sort products based on query parameters
   * Default sort: createdAt (newest first)
   */
  sort() {
    let sortField = 'createdAt';
    let sortOrder = -1; // descending (newest first)

    if (this.queryParams.sort) {
      // Validate sort field
      const validSortFields = ['price', 'name', 'createdAt', 'stock'];
      if (validSortFields.includes(this.queryParams.sort)) {
        sortField = this.queryParams.sort;
      }
    }

    if (this.queryParams.order) {
      if (this.queryParams.order.toLowerCase() === 'asc') {
        sortOrder = 1;
      } else if (this.queryParams.order.toLowerCase() === 'desc') {
        sortOrder = -1;
      }
    }

    this.query = this.query.sort({ [sortField]: sortOrder });
    return this;
  }

  /**
   * Pagination support
   * Returns: page (default: 1), limit (default: 10)
   */
  paginate() {
    const page = parseInt(this.queryParams.page, 10) || 1;
    const limit = parseInt(this.queryParams.limit, 10) || 10;

    // Validate pagination values
    if (page < 1) {
      throw new Error('Page number must be greater than 0');
    }
    if (limit < 1 || limit > 100) {
      throw new Error('Limit must be between 1 and 100');
    }

    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

export default APIFeatures;
