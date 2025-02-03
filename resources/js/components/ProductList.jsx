import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../css/ProductList.module.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchProducts = async (page) => {
      try {
        const response = await fetch(`http://localhost/api/products?page=${page}`, {
          credentials: "include",
        });        
        if (response.redirected) {
          window.location.href = response.url;
          return;
        }
        const data = await response.json();
        setProducts(data.data);
        setCurrentPage(data.meta.current_page);
        setTotalPages(data.meta.last_page);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts(currentPage);
  }, [currentPage]);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este producto?")) return;
    
    try {
      await axios.get("/sanctum/csrf-cookie");
      await axios.delete(`/api/products/${productId}`, { withCredentials: true });
      alert("Producto eliminado correctamente");
      setProducts(products.filter(product => product.id !== productId));
    } catch (error) {
      if (error.response) {
        alert("Debes iniciar sesión para eliminar un producto");
        if (error.response.status === 403) {
          alert("No tienes permiso para eliminar este producto");
        } else {
          alert(`Error eliminando el producto: ${error.message}`);
        }
      } else {
        alert("Error eliminando el producto");
      }
    }
  };

  return (
    <div className={styles.productList}>
      <h1 className={styles.title}>Product List</h1>
      <ul className={styles.list}>
        {products.map(product => (
          <li key={product.id} className={styles.product}>
            <h2 className={styles.productName}>{product.name}</h2>
            <p className={styles.productDescription}>{product.description}</p>
            <p className={styles.productPrice}>Price: ${product.price}</p>
            <p className={styles.productPrice}>Id usuario: {product.user_id}</p>
            <button className={styles.deleteButton} onClick={() => deleteProduct(product.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
      <div className={styles.pagination}>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            disabled={currentPage === index + 1}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductList;