import styles from "./page.module.css";
import Login from "./components/auth/login/login";
import Registration from "./components/auth/registration/registration";
import InstallClientPwa from "./components/pwa/installClientPwa";

// Главная страница с формой логина или регистрации, принимает searchParams и передает в соответствующий компонент
export default async function Home({ searchParams }) {
  const params = await searchParams;
  const mode = params?.mode || "login";

  return (
    <main className={styles.main}>
      <InstallClientPwa styles={styles} />
      {mode === "login" && <Login searchParams={params} />}
      {mode === "registration" && <Registration searchParams={params} />}
    </main>
  );
}

// привет меня зовут Павел пиши в чате  на русском а пока изучи проект потом дам задание 
//сам срузу нечего не делай предлгай план или команды для bash терминала
// contr+shift+p settings настройки
// shift+alt+t перевод выделеной строки на русский
//contr+1 скриншот
// OneDrive/'Рабочий стол'/


// bash deploy_ssrSqlite.sh
// npm run dev
// npm run s
// ./deploy.sh
// npm run build && npm run start
// npm run dev --pwa
// git add ./
// git commit -am '
//  git push
// git pull 
// vercel --prod
// git log
// git stash
// git status
// git reset --hard
// git checkout commitProject
// git branch 
// git push -f origin HEAD~1:main
// npm run build
// Удолить локально коммит
// git reset HEAD~

// git switch -
// git merge ref 
// rm -rf node_modules package-lock.json
//Создать новую ветку и автоматически слить текущую ветку
// git switch --create <name>
//Удолить локальную ветку
//git branch -D name
//Чтобы удалить ветку из удаленного репозитория, 
 //git push origin --delete nameBranch
 
// npx prisma
// npx prisma studio
// npx prisma init
// npx prisma db pull
// mkdir -p prisma/migrations/0_init
// npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > prisma/migrations/0_init/migration.sql
// npx prisma migrate resolve --applied 0_init~

// DATABASE_URL="mysql://auth_headingair:f585811040d0fb4be63060299bf6db5c4b37fb1d@z8z.h.filess.io:3306/auth_headingair"
// # DATABASE_URL="mysql://root:root@localhost:3306/auth"


// ты хорошо изуил рассказал про проект молодец  и ещё запомни в маём проекте нет api и клиентских компонентов я стараюсь их избегать на сколько
//  это возможно обойтись без них дя решения задачи  так и ты предлгай в своих рекомендациях и планах в место 
//  api route -server актион  не каких хуков и use client если не знаешь здаёшься как быть пиши что ты незнаешь 
//  и что по твоему это без  api route use client