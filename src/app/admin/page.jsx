import styles from "./page.module.css";
import MapAdmin from "./adminComponents/mapAdmin/mapAdmin"; 
export default function Admin() {

  return (
    <section className={styles.section}>
     <MapAdmin/>  
    </section>
  );
}