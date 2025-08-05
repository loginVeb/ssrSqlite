import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import styles from "./page.module.css";
import MapUser from "./userComponents/mapUser/mapUser"; 

const SECRET_KEY = "your_secret_key"; // В реальном проекте хранить в env

export default async function User() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/");
  }

  try {
    jwt.verify(token, SECRET_KEY);
  } catch (err) {
    redirect("/");
  }

  return (
    <section className={styles.section}>
  <MapUser/>
    </section>
  );
}
