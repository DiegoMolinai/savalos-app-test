import styles from "@/styles/layout/Footer.module.css";
import { FaShieldAlt, FaMapMarkerAlt } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <h2>Savalos SPA</h2>
          <p><FaShieldAlt className={styles.icon} /> Seguridad y tecnología a tu alcance</p>
          <p><FaMapMarkerAlt className={styles.icon} /> Santiago, Chile</p>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <p>© {new Date().getFullYear()} Savalos SPA. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
