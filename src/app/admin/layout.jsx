import styles from "./page.module.css";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import Header from "./adminComponents/header/header";

export const metadata = {
  title: "Admin Panel",
  description: "Административная панель",
};

export default async function AdminLayout({ children }) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/?mode=login");
  }

  try {
    const SECRET_KEY = process.env.SECRET_KEY;
    const decoded = jwt.verify(token, SECRET_KEY);
    const adminNickname = process.env.ADMIN_NICKNAME;

    if (decoded.nickname !== adminNickname) {
      redirect("/?mode=login");
    }
  } catch (error) {
    redirect("/?mode=login");
  }

  return (
    <>
      <Header />
      <main className={styles.adminLayout}>
        {children}
      </main>
    </>
  );
}
