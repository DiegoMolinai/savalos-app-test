'use client';

import { useRouter } from "next/navigation";
import ItemForm from "@/components/ItemForm";

export default function NewItemPage() {
  const router = useRouter();

  const handleCreate = async (data) => {
    await fetch("/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    router.push("/");
  };

  return (
    <main>
      <ItemForm onSubmit={handleCreate} />
    </main>
  );
}
