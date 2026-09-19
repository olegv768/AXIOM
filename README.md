# Antigravity Venture Audit — Startup Idea Validator

> Пространственный AI-валидатор стартап-идей в эстетике **Linear / Apple Pro Hardware** с живым анализом через **Google Gemini**.

## 🚀 Возможности

- **Реальные примеры сайтов**: Автоматический поиск существующих аналогов, их доменов, моделей монетизации, оценки трафика и слепых зон.
- **Стресс-тест юнит-экономики**: Оценка CAC, LTV, срока окупаемости (Payback) и рисков сгорания капитала.
- **Оценка емкости рынка (Market Sizing)**: Расчет TAM, SAM, SOM и среднего чека.
- **Go-To-Market Playbook**: 3 фазы привлечения первых 1000 пользователей.
- **Uniqueness Dial**: Калиброванная шкала уникальности 0–100%.
- **Беспристрастная критика (Ruthless Critique)**: Анализ когнитивных искажений фаундера и барьеров переключения.
- **Blue Ocean Pivots**: 3–4 конкретных инженерно-продуктовых вектора переупаковки идеи до 90%+ уникальности.

---

## 🛠 Стек технологий

- **Фреймворк**: React 18 + Vite + TypeScript
- **Стилизация**: Tailwind CSS + Custom 3D CSS
- **Анимации & 3D Физика**: Framer Motion
- **Иконки**: Lucide React
- **Семантическое ядро**: Google Gemini API (`gemini-flash-latest`)

---

## 💻 Установка и запуск

1. Клонируйте репозиторий:
```bash
git clone https://github.com/olegv768/antigravity-validator.git
cd antigravity-validator
```

2. Установите зависимости:
```bash
npm install
```

3. Настройте файл окружения:
Создайте `.env` на основе `.env.example`:
```bash
VITE_GEMINI_API_KEY=ваш_ключ_gemini
```
*(Получить ключ бесплатно: [Google AI Studio](https://aistudio.google.com/app/apikey))*

4. Запустите dev-сервер:
```bash
npm run dev
```
Откройте в браузере: `http://localhost:5173/`
