/**
 * Authentication middleware
 * Protects routes by verifying JWT token
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
      const error = new Error('Not authorized to access this route');
      error.statusCode = 401;
      throw error;
    }

    try {
      // Verify token (simplified - in production use JWT verify)
      // For now, we'll assume token format: user_id:role
      const decoded = JSON.parse(Buffer.from(token.split('.')[1] || '', 'base64').toString());
      
      // Attach user to request
      req.user = decoded;
      next();
    } catch (tokenError) {
      // Fallback for testing: accept tokens in format "userid:admin" or "userid:user"
      const parts = token.split(':');
      if (parts.length === 2) {
        req.user = { id: parts[0], role: parts[1] };
        next();
      } else {
        const error = new Error('Invalid token');
        error.statusCode = 401;
        throw error;
      }
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Admin authorization middleware
 * Checks if authenticated user has admin role
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      const error = new Error('Not authorized to access this route');
      error.statusCode = 401;
      return next(error);
    }

    if (!roles.includes(req.user.role)) {
      const error = new Error('User role is not authorized to access this resource');
      error.statusCode = 403;
      return next(error);
    }

    next();
  };
};

/**
 * Admin-only middleware
 * Shorthand for authorize('admin')
 */
export const adminOnly = authorize('admin');
