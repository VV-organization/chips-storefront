# Chips
- По умолчанию все изменения и проверки только локальные. Коммит, push и публикация/deploy — только по отдельной явной просьбе пользователя для текущих изменений. Прошлое разрешение не распространяется на последующие правки. Push запускает GitHub Pages, поэтому без новой просьбы его не выполнять.
- Выполнять project-prompts.md по порядку, с письменным планом и проверкой каждого этапа.
- Только тёмная тема. Структура Gems/Shards/Drops. Визуальные источники OffPossible и State of AI Design; Enerblock только цвет.
- Gems, Shards, Drops и Frags — только функциональные ориентиры. Нельзя повторять их композиции ни в одном блоке или внутренней странице; смена цвета не считается новым дизайном. Перед завершением сравнить все блоки с ними.
- Не использовать системные select-меню. Выбор оружия/предметов/сортировки — собственная тёмная панель с доступной клавиатурой, поиском при длинном наборе и превью предметов. Короткие наборы — явные кнопки.
- Акцент должен восприниматься красным, отчётливо отличаться от оранжевого Drops и розового Frags. Проверять на реальном экране, а не только по HEX.
- Курс 1 ₽ = 1,7 Chips; расчёты в целых сотых, half-up, отношение 17/10.
- Новые GitHub-репозитории public в VV-organization, если пользователь не запросил иное.
- Не менять соседние проекты и не переносить секреты/исторические документы.
- После добавления товара/набора — нижнее подтверждение, cart link, close, aria-live; в quick view внутри dialog top layer. Плашка целиком внутри границ диалога с нижним отступом; прокрутка контента не должна её обрезать или перекрывать.
- Добавленный товар везде получает ссылку «Перейти в корзину», без повторного add и дублей.
- Проверять add → confirmation → cart → item, reload, modal dismissal, клавиатуру и mobile по наблюдаемым результатам.
- Реальные платежи, выдачу и авторизацию нельзя имитировать.
- Изображения предметов должны целиком помещаться в своей области, включая hover и анимацию, и не пересекать подписи/линии. Не исправлять выход через overflow:clip: резервировать место и проверять все типы изображений на мобильном, планшете и desktop.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
