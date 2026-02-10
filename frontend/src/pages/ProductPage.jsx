import { useState, useEffect } from 'react';
import { getProducts } from '../services/productService';
import AddProductModal from '../components/AddProductModal';
import EditProductModal from '../components/EditProductModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import Sidebar from '../components/Sidebar';
import '../styles/ProductPage.css';

/**
 * ProductPage Component
 * Admin product management page
 */
function ProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Selected product for edit/delete
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Toast notification
  const [toast, setToast] = useState(null);

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Auto-close toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleAddProduct = async () => {
    showToast('Product added successfully!', 'success');
    fetchProducts();
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleEditProduct = async () => {
    showToast('Product updated successfully!', 'success');
    fetchProducts();
  };

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const handleDeleteProduct = async () => {
    showToast('Product deleted successfully!', 'success');
    fetchProducts();
  };

  return (
    <div className="page-container">
      <Sidebar />

      <div className="main-content">
        <div className="page-header">
          <div>
            <h1>Product Management</h1>
            <p className="page-subtitle">Manage and organize your product inventory</p>
          </div>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => setShowAddModal(true)}
          >
            + Add Product
          </button>
        </div>

        {/* Toast Notification */}
        {toast && (
          <div className={`toast toast-${toast.type}`}>
            {toast.message}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="error-banner">
            <p>{error}</p>
            <button onClick={fetchProducts} className="btn btn-small">
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading products...</p>
          </div>
        ) : (
          <>
            {/* Products Table */}
            {products.length > 0 ? (
              <div className="table-container">
                <table className="products-table">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id}>
                        <td>
                          <div className="product-name">
                            {product.imageUrl && (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="product-thumb"
                                onError={(e) => (e.target.style.display = 'none')}
                              />
                            )}
                            <div>
                              <strong>{product.name}</strong>
                              {product.description && (
                                <p className="description-preview">
                                  {product.description.substring(0, 50)}
                                  {product.description.length > 50 ? '...' : ''}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>{product.category}</td>
                        <td className="price">
                          ${parseFloat(product.price).toFixed(2)}
                        </td>
                        <td>
                          <div className="stock-badge">
                            <span className={product.stock > 10 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out-of-stock'}>
                              {product.stock} units
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className={`status-badge status-${product.status}`}>
                            {product.status}
                          </span>
                        </td>
                        <td className="actions">
                          <button
                            className="btn btn-icon btn-edit"
                            onClick={() => handleEditClick(product)}
                            title="Edit product"
                          >
                            ✎
                          </button>
                          <button
                            className="btn btn-icon btn-delete"
                            onClick={() => handleDeleteClick(product)}
                            title="Delete product"
                          >
                            🗑
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <p>📦 No products found</p>
                <p className="empty-subtitle">
                  Click the "Add Product" button to create your first product.
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowAddModal(true)}
                >
                  Add Your First Product
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <AddProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onProductAdded={handleAddProduct}
      />

      <EditProductModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        onProductUpdated={handleEditProduct}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        onProductDeleted={handleDeleteProduct}
      />
    </div>
  );
}

export default ProductPage;
