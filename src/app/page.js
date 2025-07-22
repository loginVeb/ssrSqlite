import styles from "./page.module.css";
import Login from "./components/auth/login/login";
import Registration from "./components/auth/registration/registration";
import InstallClientPwa from "./components/pwa/installClientPwa";

// Главная страница с формой логина или регистрации, принимает searchParams и передает в соответствующий компонент
export default async function Home({ searchParams }) {
  const params = await searchParams;
  const mode = params?.mode || "login";

  return (
    <main className={`${styles.main}`}>
      <InstallClientPwa styles={styles} />
      {mode === "login" && <Login searchParams={params} />}
      {mode === "registration" && <Registration searchParams={params} />}
    </main>
  );
}

// привет меня зовут Павел пиши в чате  на русском а пока изучи проект потом дам задание 
// срузу код в файлах не изменяй без разрешения  предлгай план напиши код в чат или команды для bash терминала
// contr+shift+p settings настройки
// я просто буду делать твои команды в своём терминали 
// сравни и скажи отличия не меняй код просто скажи

// ты дурак что ли злюсь на тебя сколько тебе говорить  срузу нечего не делай предлгай план 

// shift+alt+t перевод выделеной строки на русский
//contr+1 скриншот
// OneDrive/'Рабочий стол'/


// bash deploy_ssrSqlite.sh
// npm run dev


// git add ./
// git commit -am '
//  git push
// git pull 

// git stash
// git reset --hard

// git log
// git status

//удалить коммит удалённо
// git push -f origin HEAD~1:main
// Удолить локально коммит
// git reset HEAD~

// git checkout commitProject
// git branch 

//Создать новую ветку и автоматически слить текущую ветку
// git switch --create <name>

//вернутся на предыдущюю ветку
// git switch -


//Удолить локальную ветку
//git branch -D name
//Чтобы удалить ветку из удаленного репозитория, 
 //git push origin --delete nameBranch

 // удолить зависимости
// rm -rf node_modules package-lock.json
 
// npx prisma studio
//подключение
// ssh root@109.172.37.134
// запуск prisma studio на сервере
// ssh -L 5555:localhost:5555 root@109.172.37.134
// ssh root@109.172.37.134 'cd ../var/www/html && npx prisma studio --port 5555'

// убить процес prisma studio на сервере
// ssh root@109.172.37.134 'sudo lsof -i :5555'
// вставить номер который будетт   ode 69583 root 
// ssh root@109.172.37.134 'sudo kill 70227'

// посмотреть логи на сервере
// pm2 logs pwaArcope --lines 100

// ты хорошо изуил рассказал про проект молодец  и ещё запомни в маём проекте нет api и клиентских компонентов я стараюсь их избегать на сколько
//  это возможно обойтись без них дя решения задачи  так и ты предлгай в своих рекомендациях и планах в место 
//  api route -server актион  не каких хуков и use client если не знаешь здаёшься как быть пиши что ты незнаешь 
//  и что по твоему это без  api route use client