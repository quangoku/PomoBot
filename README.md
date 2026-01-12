# ⏱️ Pomodoro Bot

## 1. Introduction

**Pomodoro Bot Mezon** is an intelligent time-management chatbot specifically designed for the Mezon platform. It helps users apply the Pomodoro technique (focused work sessions) to maximize productivity through several key features:

- ⏳ **Automated Cycles**: Automatically manages Focus sessions and Break intervals.
- 📊 **Real-time Countdown**: Displays a live countdown timer directly in the chat channel.
- 🥇 **Leaderboard**: Tracks and ranks users based on their total focused hours and completed Pomodoro cycles.
- 💬 **Random Quotes**: Delivers motivational quotes and inspiration at the start of each session or upon request to keep you driven.

---

## 2. Installation & Build

### 2.1. Environment Setup

```bash
# Clone the repository and install dependencies
git clone <repo-url-bot-pomo>
cd PomoBot
yarn install
```

### 2.2. Configuration env

```
BOT_ID=
BOT_TOKEN=
MONGO_URI=
PORT=
```

### 2.3. Run Bot

```bash
yarn start (yarn required)
```

### 2.4.Run with docker

```bash
docker compose up --build
```

### 2.5. Using bot

#### Main command

- 🔎 **Start a pomo**

  ```
  *pomo
  ```

- 📑 **Check your progress**

  ```
  *progress
  ```

  Check your current Pomodoro progress.

- ℹ️ **View leaderboard**

  ```
  *leaderboard
  ```

  View the Pomodoro leaderboard

- 🔍 **Random inpiration quote**

  ```
  *quote
  ```

  Get an inspirational quote to keep you motivated.

- 🤖 **Help**
  ```
  *help
  ```
  Display help menu.
