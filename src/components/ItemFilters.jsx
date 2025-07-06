"use client";

import styles from "@/styles/components/ItemFilters.module.css";

export default function ItemFilters({ filters, onChange, onSubmit, onReset }) {
  const handleChange = (e) => {
    onChange({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={onSubmit} className={styles.filterForm}>
      <input
        name="title"
        placeholder="Título"
        value={filters.title}
        onChange={handleChange}
        className={styles.filterInput}
      />
      <input
        name="category"
        placeholder="Categoría"
        value={filters.category}
        onChange={handleChange}
        className={styles.filterInput}
      />
      <input
        name="priceMin"
        placeholder="Precio mínimo"
        type="number"
        value={filters.priceMin}
        onChange={handleChange}
        className={styles.filterInput}
      />
      <input
        name="priceMax"
        placeholder="Precio máximo"
        type="number"
        value={filters.priceMax}
        onChange={handleChange}
        className={styles.filterInput}
      />
      <input
        name="tag"
        placeholder="Tag"
        value={filters.tag}
        onChange={handleChange}
        className={styles.filterInput}
      />
      <button type="submit" className={styles.filterButton}>
        Filtrar
      </button>
      <button
        type="button"
        onClick={onReset}
        className={`${styles.filterButton} ${styles.resetButton}`}
      >
        Limpiar
      </button>
    </form>
  );
}
