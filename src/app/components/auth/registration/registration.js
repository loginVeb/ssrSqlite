import styles from "./registration.module.css";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import prisma from "@/lib/prismaClient";

const SECRET_KEY = process.env.SECRET_KEY; // В реальном проекте хранить в env

async function registerUser(formData) {
  "use server";
  const { nickname, password, confirmPassword } = Object.fromEntries(formData);

  if (password !== confirmPassword) {
    redirect("/?mode=registration&error=password_mismatch");
  }

  const existingUser = await prisma.user.findUnique({
    where: { nickname },
  });

  if (existingUser) {
    redirect("/?mode=registration&error=nickname_exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      nickname,
      password: hashedPassword,
    },
  });

  const token = jwt.sign({ id: newUser.id, nickname: newUser.nickname }, SECRET_KEY, {
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