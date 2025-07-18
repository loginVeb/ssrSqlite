import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import styles from "./login.module.css";
import prisma from "@/lib/prismaClient";

const SECRET_KEY = process.env.SECRET_KEY; // В реальном проекте хранить в env

async function login(formData) {
  "use server";
  const { nickname, password } = Object.fromEntries(formData);

  const user = await prisma.user.findUnique({
    where: { nickname },
  });

  if (!user) {
    redirect("/?error=not_found");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    redirect("/?error=not_found");
  }

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
      <form action={login} className={`${styles.form} ${styles.container}`} autoComplete="off">
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
          autoComplete="new-password"
          className={styles.inputPassword}
        />
        <button type="submit" className={styles.button}>
          Войти
        </button>
        <Link href="/?mode=registration" className={styles.link}>
          Регистрация
        </Link>
      </form>
  );
}
