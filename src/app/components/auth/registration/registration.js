import styles from "./registration.module.css";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { redirect } from "next/navigation";
import Link from "next/link";

const SECRET_KEY = "your_secret_key"; // В реальном проекте хранить в env
const dbPath = path.resolve("./src/server/db.json");

async function registerUser(formData) {
  "use server";
  const { nickname, password, confirmPassword } = Object.fromEntries(formData);

  if (password !== confirmPassword) {
    redirect("/?mode=registration&error=password_mismatch");
  }

  const db = JSON.parse(readFileSync(dbPath, "utf-8"));
  const existingUser = db.users.find((u) => u.nickname === nickname);

  if (existingUser) {
    redirect("/?mode=registration&error=nickname_exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: Date.now().toString(),
    nickname,
    password: hashedPassword,
  };

  db.users.push(newUser);
  writeFileSync(dbPath, JSON.stringify(db, null, 2));

  const token = jwt.sign({ id: newUser.id, nickname: newUser.nickname }, SECRET_KEY, {
    expiresIn: "1h",
  });

  redirect("/user");
}

export default async function Registration({ searchParams }) {
  const params = await searchParams;
  const error = params?.error;
  const mode = params?.mode;

  return (
    <div className={styles.container}>
      {mode === "registration" && (
        <>
          <form action={registerUser} className={styles.form}>
            {error === "password_mismatch" && (
              <div className={styles.errorMessage}>Пароли не совпадают</div>
            )}
            {error === "nickname_exists" && (
              <div className={styles.errorMessage}>Такой ник уже есть</div>
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
            <input
              type="password"
              placeholder="confirm password"
              required
              name="confirmPassword"
              autoComplete="current-password"
              className={styles.inputPassword}
            />
            <button type="submit" className={styles.button}>
              Зарегистрироваться
            </button>
          <Link href="/?mode=login" className={styles.link}>
            Вход
          </Link>
        </form>
        </>
      )}
    </div>
  );
}
