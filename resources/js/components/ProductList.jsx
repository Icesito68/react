import React, { useState, useEffect } from 'react';
import styles from '../../css/ProductList.module.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Añadir estado para la página actual
  const [totalPages, setTotalPages] = useState(0); // Añadir estado para el total de páginas

  useEffect(() => {
    const fetchProducts = async (page) => {
      try {
        const response = await fetch(`http://localhost/api/products?page=${page}`, {
          credentials: "include",
          });        if (response.redirected) {
          window.location.href = response.url;
          return;
        }
        const data = await response.json();
        setProducts(data.data);
        setCurrentPage(data.meta.current_page); // Actualizar página actual
        setTotalPages(data.meta.last_page); // Actualizar total de páginas
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts(currentPage);
  }, [currentPage]); // Ejecutar el efecto cuando currentPage cambie

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  // Función para cambiar de página
  const handlePageChange = (page) => {
    setCurrentPage(page);
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
