import { useState } from 'react';
import { deleteProduct } from '../services/productService';

/**
 * DeleteConfirmModal Component
 * Modal for confirming product deletion
 */
function DeleteConfirmModal({ isOpen, onClose, product, onProductDeleted }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConfirmDelete = async () => {
    setError('');
    setLoading(true);

    try {
      await deleteProduct(product._id);

      // Show success and refresh products
      onProductDeleted();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-confirm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Confirm Delete</h2>
        </div>

        <div className="modal-body">
          {error && <div className="error-message">{error}</div>}

          <p className="delete-message">
            Are you sure you want to delete <strong>{product.name}</strong>?
          </p>
          <p className="delete-warning">This action cannot be undone.</p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleConfirmDelete}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete Product'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;
