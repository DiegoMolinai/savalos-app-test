"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/components/ItemList.module.css";
import Loader from "./Loader";
import ItemFilters from "./ItemFilters";

export default function ItemList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    title: "",
    category: "",
    priceMin: "",
    priceMax: "",
    tag: "",
  });

  const [appliedFilters, setAppliedFilters] = useState({});

  const fetchItems = async () => {
    setLoading(true);
    setError(null);

    try {
      const query = new URLSearchParams();
      if (appliedFilters.title) query.append("title", appliedFilters.title);
      if (appliedFilters.category) query.append("category", appliedFilters.category);
      if (appliedFilters.priceMin) query.append("priceMin", appliedFilters.priceMin);
      if (appliedFilters.priceMax) query.append("priceMax", appliedFilters.priceMax);
      if (appliedFilters.tag) query.append("tag", appliedFilters.tag);

      const res = await fetch(`/api/items?${query.toString()}`);
      if (!res.ok) throw new Error("Error al obtener ítems.");
      const data = await res.json();
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [appliedFilters]);

  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este ítem?")) return;
    setDeletingId(id);
    try {
      await fetch(`/api/items/${id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      alert("No se pudo eliminar.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();
    setAppliedFilters({ ...filters });
  };

  const handleResetFilters = () => {
    const defaultFilters = {
      title: "",
      category: "",
      priceMin: "",
      priceMax: "",
      tag: "",
    };
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
  };

  return (
    <div className={styles.listContainer}>
      <ItemFilters
        filters={filters}
        onChange={setFilters}
        onSubmit={handleApplyFilters}
        onReset={handleResetFilters}
      />

      {loading ? (
        <Loader
          textSize="2rem"
          size="5rem"
          text="Cargando datos..."
          color="black"
        />
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Título</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Categoría</th>
              <th>Tags</th>
              <th>Especificaciones</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td>{item.title}</td>
                <td>{item.description}</td>
                <td>${item.price}</td>
                <td>{item.stock}</td>
                <td>
                  {item.category?.name} ({item.category?.code})
                </td>
                <td>{item.tags?.join(", ")}</td>
                <td>
                  <ul style={{ paddingLeft: "1.2rem" }}>
                    {item.specifications?.map((spec, i) => (
                      <li key={i}>
                        {spec.key}: {spec.value}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(item._id)}
                    disabled={deletingId === item._id}
                  >
                    {deletingId === item._id ? "Eliminando..." : "Eliminar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
