import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import styles from "./page.module.css";

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
    <main className={styles.main}>
      <h1>Добро пожаловать на страницу пользователя</h1>
    </main>
  );
}
