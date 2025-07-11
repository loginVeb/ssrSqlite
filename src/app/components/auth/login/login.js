import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { readFileSync } from "fs";
import path from "path";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import styles from "./login.module.css";

const dbPath = path.resolve("./src/server/db.json");
const SECRET_KEY = process.env.SECRET_KEY; // В реальном проекте хранить в env

async function login(formData) {
  "use server";
  const { nickname, password } = Object.fromEntries(formData);

  const db = JSON.parse(readFileSync(dbPath, "utf-8"));
  const user = db.users.find((u) => u.nickname === nickname);

  if (!user) {
    redirect("/?error=not_found");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    redirect("/?error=not_found");
  }

//   Вы можете изменить значение expiresIn на любое другое, например:
// "30m" — 30 минут
// "2h" — 2 часа
// "1d" — 1 день
  const token = jwt.sign({ id: user.id, nickname: user.nickname }, SECRET_KEY, {
    expiresIn: "1h",
  });

  cookies().set({
    name: "token",
    value: token,
    httpOnly: true,
    path: "/",
  });

  redirect("/user");
}

export default async function Login({ searchParams }) {
  const params = await searchParams;
  const error = params?.error;

  return (
    <div className={styles.container}>
      <form action={login} className={styles.form}>
        {error === "not_found" && (
          <div className={styles.errorMessage}>Таких данных нет</div>
        )}
        <input
          type="text"
          placeholder="nickname"
          required
          name="nickname"
          autoComplete="username"
          className={styles.inputNickname}
        />
        <input
          type="password"
          placeholder="password"
          required
          name="password"
          autoComplete="current-password"
          className={styles.inputPassword}
        />
        <button type="submit" className={styles.button}>
          Войти
        </button>
        <Link href="/?mode=registration" className={styles.link}>
          Регистрация
        </Link>
      </form>
    </div>
  );
}
