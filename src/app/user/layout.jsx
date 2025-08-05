import styles from "./page.module.css";
import Header from "./userComponents/header/header";

export const metadata = {
  title: "map user",
  description: "карта пользователя ",
};

export default async function UserLayout({ children }) {

  return (
    <>
      <Header />
      <main className={styles.userLayout}>
        {children}
      </main>
    </>
  );
}
