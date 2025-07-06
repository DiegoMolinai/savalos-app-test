import ItemList from "@/components/ItemList";

export default function ItemsPage() {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Listado de Ítems</h1>
      <a href="/new">Agregar nuevo ítem</a>
      <ItemList />
    </main>
  );
}
