'use client';
import { MdOutlineCamera } from "react-icons/md";

export default function Loader({ size = "1.5rem", color = "#000000", text = "Cargando...", textSize="1rem" }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
      <MdOutlineCamera
        style={{
          animation: "spin 1.75s linear infinite",
          fontSize: size,
          color,
          display: "inline-block",
        }}
      />
      {text && (
        <span style={{ fontWeight:"bold", fontSize: textSize, color: "#555" }}>
          {text}
        </span>
      )}
    </div>
  );
}
