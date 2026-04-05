# MiniModa Studio — витрина одежды для мини-кукол

Одностраничное приложение на **React Router**: главная (лендинг) с блоком о мастерице, каталогом из локальных данных, модалкой товара и заказом на сервер; отдельные маршруты **политики конфиденциальности** и **условий использования**. Заказы дублируются в **Telegram**.

## Стек

| Слой       | Технологии                                                                                |
| ---------- | ----------------------------------------------------------------------------------------- |
| UI         | React 19, TypeScript, Vite 8, CSS Modules, React Router 7                                 |
| Компилятор | React Compiler (`@vitejs/plugin-react` + `@rolldown/plugin-babel`, `reactCompilerPreset`) |
| Хостинг    | [Vercel](https://vercel.com) — статика из `dist/`, API — serverless-функция в `api/`      |

## Структура репозитория

```
src/
  main.tsx              — вход, BrowserRouter
  App.tsx               — маршруты: /, /privacy, /terms
  layouts/SiteLayout.tsx — шапка, Outlet, подвал; скролл по hash на главной
  pages/
    HomePage.tsx        — главная: секции каталога, модалка заказа
    PrivacyPolicyPage.tsx, TermsOfUsePage.tsx — юридические страницы
  components/           — Header, Footer, SocialNetworkLinks, AboutSection, Catalog,
                          ProductCard, ProductModal, ProductOrderForm, ProductCheckoutForm
  data/products.ts      — каталог (данные в коде), у каждой позиции поле article
  types/                — типы товара и пропсов
  utils/                — валидация форм, цены, артикул для UI, скролл, siteMeta, useDocumentTitle, соцсети
scripts/
  check-articles.ts     — проверка уникальности и непустоты article (`npm run check:articles`)
api/
  send-order.ts         — обработчик POST заказа (Vercel Function)
  lib/telegram.ts       — вызов Telegram Bot API (sendMessage)
public/
  favicon.svg, robots.txt, sitemap.xml, assets/icon/
```

## Раздел для фронтенд-разработчика

- **Стили:** преимущественно `*.module.css` рядом с компонентами, глобально — `src/index.css`.
- **Алиас `@/`** указывает на `src/` (см. `vite.config.ts`).
- **Данные каталога:** правки ассортимента — в `src/data/products.ts` и при необходимости в `src/types/product.ts`. У каждого товара обязательное поле **`article`** (уникальная строка, например `014w` / `002m` / `001c` — суффикс по категории: женское **w**, мужское **m**, парное **c**). После правок каталога желательно выполнить **`npm run check:articles`** (дубликаты и пустые артикулы завершат скрипт с ошибкой).
- **Отображение артикула на сайте:** подпись вида «арт. 014w» формируется утилитой **`formatArticleDisplay`** (`src/utils/formatArticle.ts`) в карточке каталога, модалке и таблице оформления заказа.
- **Форма заказа:** логика отправки — `ProductModal.tsx` (`resolveOrderApiUrl`, `fetch`), валидация — `src/utils/formValidation.ts`.
- **Соцсети и иконки:** `src/utils/socialLinks.ts`, спрайт — `public/assets/icon/symbol-defs.svg`.

## Команды для работы локально

| Команда                  | Назначение                                                                                                                                                                                                                    |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm install`            | Установка зависимостей                                                                                                                                                                                                        |
| `npm run dev`            | Разработка (Vite, обычно порт 5173)                                                                                                                                                                                           |
| `npm run dev:vercel`     | Тот же фронт + локальные **Vercel Functions** (`/api/*`), нужен [Vercel CLI](https://vercel.com/docs/cli) и привязка проекта                                                                                                  |
| `npm run build`          | `tsc -b` + production-сборка в `dist/`                                                                                                                                                                                        |
| `npm run check:articles` | Проверка: у всех товаров непустой **article** и все артикулы уникальны (скрипт `scripts/check-articles.ts`, нужен пакет **tsx** из devDependencies — после `git pull` при изменении зависимостей выполните **`npm install`**) |
| `npm run preview`        | Просмотр собранного `dist/`                                                                                                                                                                                                   |
| `npm run lint`           | ESLint                                                                                                                                                                                                                        |

**Заказ с `npm run dev`:** Vite проксирует **`/api`** на URL из **`vite.config.ts`** (по умолчанию продакшен `https://clothes-for-mini-dolls.vercel.app`). Если прокси недоступен, задайте **`VITE_ORDER_API_URL`** с полным URL к `…/api/send-order` или используйте **`npm run dev:vercel`** (см. `src/vite-env.d.ts` и `ProductModal.tsx`).

## Деплой

1. Репозиторий подключён к **Vercel** (или деплой через CLI: `vercel`, прод: `vercel --prod`).
2. В **Project → Settings** заданы **Build Command** `npm run build` и **Output Directory** `dist` (дублируется в `vercel.json`).
3. После добавления/смены переменных окружения выполните **Redeploy**.
4. После изменений в **`api/send-order.ts`** (например текст уведомления в Telegram) без нового деплоя в чат уйдёт **старая** версия функции — сделайте **Redeploy**, иначе клиент может слать новые поля JSON, а сервер их не отразит в сообщении.

В **`vercel.json`** задан **rewrite** SPA на `index.html` с исключением **`/api/*`**, чтобы прямые заходы на `/privacy` и `/terms` не отдавали 404.

## Работа с Telegram

1. Создайте бота у [@BotFather](https://t.me/BotFather), получите **токен** (`TELEGRAM_TOKEN`).
2. Узнайте **chat_id** чата (личка с ботом, группа или канал, куда бот может писать):
   - для лички: напишите боту, затем `https://api.telegram.org/bot<TOKEN>/getUpdates` и найдите `chat.id`;
   - для группы: добавьте бота, дайте право писать, id обычно отрицательный.
3. В **Vercel → Settings → Environment Variables** добавьте:
   - `TELEGRAM_TOKEN` — токен бота;
   - `TELEGRAM_CHAT_ID` — id чата (строка или число, без лишних кавычек в значении).
4. Для **`vercel dev`** те же переменные можно положить в `.env` / `.env.local` в корне (не коммитить).

Без обеих переменных функция отвечает **503** с пояснением (см. `api/send-order.ts`).

## Продакшен

- **Публичный URL:** [https://clothes-for-mini-dolls.vercel.app/](https://clothes-for-mini-dolls.vercel.app/)
- **API в проде:** `POST /api/send-order` на **том же origin**, что и сайт (относительный путь `/api/send-order` в бандле).
- **Статика:** `robots.txt` и `sitemap.xml` в `public/`; при смене домена обновите абсолютные URL там и в `vite.config.ts` (`DEFAULT_DEV_API_PROXY`).
- **SPA:** в `vercel.json` настроен rewrite на `index.html`, чтобы пути из sitemap (`/privacy`, `/terms`) не отдавали 404 при прямом заходе.

## Как передаётся заказ

1. Пользователь в модалке товара проходит шаги (детали → количество → контакты и согласие) и отправляет форму.
2. Браузер делает **`fetch`** на URL из `resolveOrderApiUrl()` (по умолчанию **`/api/send-order`**), метод **POST**, тело **JSON**: `productId`, **`article`**, `productTitle`, `priceLabel`, `quantity`, `lineTotalFormatted`, имя, телефон, e-mail (см. `ProductModal.tsx` и тип `OrderPayload` в `api/send-order.ts`).
3. **Vercel** направляет запрос в **`api/send-order.ts`**: парсинг тела (в т.ч. Buffer/строка), валидация полей.
4. Если заданы `TELEGRAM_TOKEN` и `TELEGRAM_CHAT_ID`, сервер вызывает **`sendToTelegram`**: HTTP POST к `https://api.telegram.org/bot<TOKEN>/sendMessage` с текстом заказа (в тексте есть **название товара**, строка **«Артикул: …»**, **ID** из каталога, цена, количество, сумма, контакты).
5. Клиент получает JSON `{ success: true }` или сообщение об ошибке (400 / 502 / 503 и т.д.).

Цепочка: **браузер → Vercel Function → Telegram Bot API → ваш чат**.

## Что можно доработать и зачем

| Направление                        | Зачем                                                                                                                   |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Прокси `/api` в `vite.config.ts`   | Уже включён (цель по умолчанию — продакшен Vercel); при необходимости измените константу или логику в `vite.config.ts`. |
| FAQ, доставка, отдельные лендинги  | Расширить контент и SEO поверх текущих `/privacy` и `/terms`.                                                           |
| Бэкенд: письма, CRM, таблицы       | Дублирование заказов, резерв, если Telegram недоступен.                                                                 |
| Кэш Vite / `vercel dev` на Windows | При `EPERM` на `node_modules/.vite` вынести `cacheDir` в отдельную папку или чистить кэш.                               |
| Тесты e2e/API                      | Регрессии на форме заказа и контракт `/api/send-order`.                                                                 |

## Лицензия

Проект помечен как приватный (`"private": true` в `package.json`).

## Как ставить водяные знаки на фото

Алгоритм (Конвейер)
ЭТАП 1: Подготовка инструментов (Делаем 1 раз за всё время)

В терминале: npm install sharp (библиотеку sharp и скачиваем в проект.( обновится папка node_modules.В файле package.json появится строчка "sharp": "...").

В терминале: npm install (это команда «Сделай всё по списку из package.json».).

Результат: У тебя в проекте появилась папка node_modules. Теперь всё готово к работе.

ЭТАП 2: Очистка и запуск (Делаем каждый раз, когда обновляем фото)

Действие А: Удали всё из папки проекта public/images/products (не бойся, у тебя же есть оригиналы в другом месте!).

Действие Б : Скопируй новые (чистые) фото из своего внешнего архива(папка с исходными фото) в эту папку public/images/products.

ЭТАП 3: Штамповка

В терминале: npm run watermark:products.

Результат: Скрипт видит в папке только те фото, которые ты туда только что положил (и новые, и старые оригиналы), и ставит на каждое один свежий водяной знак.

ЭТАП 4: Публикация

Теперь, когда в папке лежат красивые фото с защитой, ты отправляешь сайт в интернет (деплоишь).

Совет: В настройках скрипта (в коде) убедись, что параметр quality (качество) стоит достаточно высокий (например, 80 или 85), чтобы после наложения знака картинка не стала «мыльной».
Скрипт должен быть настроен так, чтобы на выходе он выдавал тоже .webp
Проверь фйл в скрипте:
watermark.js
.webp({ quality: 80 }) // Это говорит шарпу сохранять в WebP с хорошим качеством
