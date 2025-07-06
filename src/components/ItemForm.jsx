"use client";

import { useState } from "react";
import styles from "@/styles/components/ItemForm.module.css";
import {
  CATEGORY_OPTIONS,
  TAG_OPTIONS,
} from "@/dictionaries/constants/itemOptions";

export default function ItemForm({ onSubmit, defaultValues = {} }) {
  const [title, setTitle] = useState(defaultValues.title || "");
  const [description, setDescription] = useState(
    defaultValues.description || ""
  );
  const [price, setPrice] = useState(defaultValues.price || 0);
  const [stock, setStock] = useState(defaultValues.stock || 0);
  const [categoryCode, setCategoryCode] = useState(
    defaultValues.category?.code || ""
  );
  const [tags, setTags] = useState(defaultValues.tags || []);
  const [specifications, setSpecifications] = useState(
    defaultValues.specifications || []
  );
  const [specKey, setSpecKey] = useState("");
  const [specValue, setSpecValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddSpecification = () => {
    if (specKey && specValue) {
      setSpecifications([
        ...specifications,
        { key: specKey, value: specValue },
      ]);
      setSpecKey("");
      setSpecValue("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const categoryName =
      CATEGORY_OPTIONS.find((c) => c.value === categoryCode)?.label || "";

    const itemData = {
      title,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      category: { name: categoryName, code: categoryCode },
      tags,
      specifications,
    };

    try {
      const res = await onSubmit(itemData);
      if (res?.ok === false) throw new Error("Error al guardar");
    } catch (err) {
      setError(
        err.message || "No se pudo guardar el ítem. Revisa la conexión."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTagToggle = (value) => {
    setTags((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]
    );
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
            <h2>Crear nuevo ítem</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <label>
        Título *
        <input
          placeholder="Nombre del ítem"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </label>

      <label>
        Descripción
        <textarea
          placeholder="Breve descripción del ítem"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>

      <label>
        Precio
        <input
          type="number"
          placeholder="Ej: 99.99"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </label>

      <label>
        Stock
        <input
          type="number"
          placeholder="Unidades disponibles"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
      </label>

      <label>
        Categoría
        <select
          value={categoryCode}
          onChange={(e) => setCategoryCode(e.target.value)}
        >
          <option value="">Selecciona una categoría</option>
          {CATEGORY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      <fieldset className={styles.tagsFieldset}>
        <legend>Tags</legend>
        <div className={styles.tagGrid}>
          {TAG_OPTIONS.map((opt) => (
            <label key={opt.value} className={styles.tagOption}>
              <input
                type="checkbox"
                value={opt.value}
                checked={tags.includes(opt.value)}
                onChange={() => handleTagToggle(opt.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className={styles.specBlock}>
        <label>
          Especificación (clave)
          <input value={specKey} onChange={(e) => setSpecKey(e.target.value)} />
        </label>
        <label>
          Valor
          <input
            value={specValue}
            onChange={(e) => setSpecValue(e.target.value)}
          />
        </label>
        <button type="button" onClick={handleAddSpecification}>
          Agregar especificación
        </button>
      </div>

      <ul>
        {specifications.map((s, index) => (
          <li key={index}>
            {s.key}: {s.value}
          </li>
        ))}
      </ul>

      <button type="submit" disabled={loading}>
        {loading ? "Guardando..." : "Guardar"}
      </button>
    </form>
  );
}
