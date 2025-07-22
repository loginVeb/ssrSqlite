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

// Исправленная версия:
// Привет, пиши в чате на русском. А пока изучи проект, потом дам задание 
// Читай весь проект, не спрашивай разрешения, только спрашивай разрешение на изменение кода
// Не изменяй без разрешения. Предлагай план, напиши код или команды для bash-терминала в чат
// На процессе всей нашей совместной работы с кодом важно помнить:
// В моём проекте пока что нет API и клиентских компонентов. Возможно, будут, но я стараюсь их избегать, насколько это возможно, обойтись без них для решения задачи. Так и ты предлагай в своих рекомендациях и планах вместо API route предлагай server action. Не нужно предлагать никаких хуков и use client 




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
