# GW2 Account & Character Checker

A React application that connects to the official [Guild Wars 2 API](https://api.guildwars2.com/) using your personal API key to display your account stats, characters, and equipment.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📸 Overview

- Enter your GW2 API key to authenticate
- Browse your **account stats** (name, world, age, achievements)
- View all your **characters**, their professions, levels, and equipped gear
- API key is persisted in `localStorage` so you stay connected between sessions

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- A Guild Wars 2 account with an API key

### Generate a GW2 API Key

1. Go to [account.arena.net/applications](https://account.arena.net/applications)
2. Click **New Key** and enable at minimum:
   - `account`
   - `characters`
3. Copy the generated key

### Installation

```bash
git clone https://github.com/jrpaulate/gw-account-and-character-checker.git
cd gw-account-and-character-checker
npm install
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser, paste your API key, and connect.

### Building for Production

```bash
npm run build
npm run preview
```

---

## 🛠️ Tech Stack

| Tool | Purpose |
|------|---------|
| [React 19](https://react.dev/) | UI framework |
| [Vite 7](https://vite.dev/) | Build tool & dev server |
| [GW2 REST API v2](https://wiki.guildwars2.com/wiki/API:Main) | Game data source |
| Fetch API | HTTP requests |
| CSS | Styling |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ApiKeyInput.jsx       # API key entry and verification
│   ├── AccountStats.jsx      # Account-level information
│   ├── CharacterStats.jsx    # Character list and details
│   └── CharacterEquipment.jsx# Per-character equipment display
├── services/
│   └── gw2Api.js             # GW2 API client (singleton)
├── App.jsx
└── main.jsx
```

---

## 📡 API Endpoints Used

| Endpoint | Description |
|----------|-------------|
| `GET /v2/account` | Account name, world, age |
| `GET /v2/characters` | List of character names |
| `GET /v2/characters/:name` | Character details & equipment |
| `GET /v2/account/wallet` | Currency balances |
| `GET /v2/account/achievements` | Achievement progress |
| `GET /v2/account/bank` | Bank storage |
| `GET /v2/account/materials` | Material storage |
| `GET /v2/items` | Item details by ID |
| `GET /v2/skins/:id` | Skin details |

Full API documentation: [wiki.guildwars2.com/wiki/API:Main](https://wiki.guildwars2.com/wiki/API:Main)

---

## ⚠️ Disclaimer

This project is an independent fan-made tool and is **not affiliated with or endorsed by ArenaNet**.

Guild Wars 2 and all related assets are © ArenaNet, LLC. All rights reserved.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
