# Fullstack Kanban Board

Ein interaktives Kanban-Board, entwickelt im Rahmen des Studiums **Medieninformatik** als eigenes Projekt. Dieses Projekt demonstriert das Zusammenspiel zwischen einem modernen Frontend (Vue.js) und einem persistenten Cloud-Backend (Node.js/Express + MongoDB).

## Features
- **Persistente Datenhaltung:** Aufgaben werden sicher in einer MongoDB Atlas Cloud-Datenbank gespeichert.
- **REST-API:** Vollständige CRUD-Operationen (Create, Read, Update, Delete) über ein Express-Backend.
- **Validierung:** Server-seitige Prüfung von Eingaben zur Gewährleistung der Datenintegrität.
- **Tag-System:** Dynamische Kategorisierung von Aufgaben mit farbigen Badges.
- **Modernes UI:** Responsives Design mit Vue.js 3, Tailwind CSS und Bootstrap-Elementen.

## Technologien
- **Frontend:** Vue.js 3 (Composition API), Vite, Tailwind CSS / Bootstrap
- **Backend:** Node.js, Express.js, Mongoose (ODM)
- **Datenbank:** MongoDB Atlas (NoSQL)
- **Sicherheit:** Dotenv für Umgebungsvariablen und CORS-Management via Vite-Proxy

## Installation & Setup

1. **Repository klonen:**
   ```bash
   git clone [https://github.com/SimonPede/kanban-board-fullstack.git](https://github.com/SimonPede/kanban-board-fullstack.git)

2. **Backend konfigurieren**
   ```bash
   cd server
   npm install
   ```
   Erstelle eine .env Datei im server-Ordner und füge deinen MongoDB-Connection-String hinzu:
   ```bash
   MONGO_URI=mongodb+srv://<USER>:<PASSWORD>@cluster.mongodb.net/kanban
   ```

3. **Frontend bauen:**
   ```bash
      cd ../frontend
      npm install
      npm run build
   ```

4. **Anwendung starten:**
   ```bash
      cd ../server
      node index.js
   ```

Öffne http://localhost:3000 im Browser.
