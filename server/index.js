const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const taskRoutes = require('./routes/taskRoutes');

require('dotenv').config();
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
    .then(() => console.log("Verbindung zu MongoDB Atlas steht!"))
    .catch(err => console.error("MongoDB Verbindungsfehler:", err));

//Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend/dist")));

//DB Verbindung
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Verbindung zu MongoDB Atlas steht!"))
    .catch(err => console.error("MongoDB Verbindungsfehler:", err));

//--- ROUTEN EINBINDEN ---
//hier wird definiert: "Alle Anfragen, die mit /api anfangen, übergibst du an taskRoutes"
app.use('/api', taskRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Kanban-Server läuft auf http://localhost:${PORT}`);
});

































// const express = require('express');
// const path = require('path');
// const fs = require('fs');
// const mongoose = require('mongoose');

// require('dotenv').config();
// const mongoURI = process.env.MONGO_URI;

// mongoose.connect(mongoURI)
//     .then(() => console.log("Verbindung zu MongoDB Atlas steht!"))
//     .catch(err => console.error("MongoDB Verbindungsfehler:", err));
// ///////////////////////////
// // Data initialization
// ///////////////////////////

// //hier eine in-memory Kopie
// const tags = require('./data/tags.json');
// const columns = require('./data/columns.json');
// const counterData = require('./data/counter.json');
// const mongoose = require('./models/Task.js');

// // let allTasks = [];
// // columns.forEach(col => {
// //     allTasks = allTasks.concat(col.tasks);
// // });
// // let taskIdCounter = (allTasks.length > 0 ? Math.max(...allTasks.map(e => parseInt(e.id.replace("t", "")))): 0) + 1;

// //die Counter-Berechnung funktioniert zwar, aber es geht ein bisschen simpler für den momentanen Use Case
// let taskIdCounter = counterData.taskIdCounter;

// ///////////////////////////
// // Server setup
// ///////////////////////////

// const app = express();

// app.use(express.json());

// //nun wollen wir Backend mit Frontend verknüpfen (damit wir nicht Vite und Express Server haben, die nicht kommunizieren)
// //Statische Dateien aus dem dist-Ordner ausliefern
// //__dirname: globale Variable in Node.js. sagt immer: "In welchem Ordner auf der Festplatte liegt diese index.js gerade?
// //express.static ist eingebaute Middleware: macht Server zu Dateiverwalter: "Bevor du nach einer API-Route suchst, schau erst mal in diesem Ordner nach. Wenn der User index.html oder style.css verlangt und die Datei dort liegt: Schick sie ihm einfach direkt!""
// //--> Ohne diese Zeile würde  Server zwar die Daten (/api/tasks) liefern, aber man hätte keine Webseite, auf der man diese Daten sehen kann.
// app.use(express.static(path.join(__dirname, '../frontend/dist')));

// function saveData() {
//     //Logik: columns-Array aus RAM in JSON umwandeln und dann in data/colums.json schreiben
//     const filePath = path.join(__dirname, 'data', 'columns.json');
//     //Bonus: JSON.stringify kann die Datei auch schön formatieren!
//     //Die '2' am Ende sorgt für Einrückungen (2 Leerzeichen)
//     const dataString = JSON.stringify(columns, null, 2);
//     fs.writeFileSync(filePath, dataString);

//     counterData.taskIdCounter = taskIdCounter;
//     fs.writeFileSync("./data/counter.json", JSON.stringify(counterData, null, 2));
// }

// function validateTask(task) {
//     const errors = [];

//     if (!task.title || typeof task.title !== 'string' || task.title.trim().length === 0) {
//         errors.push("Titel ist erforderlich und darf nicht leer sein.");
//     } else if (task.title.length > 50) {
//         errors.push("Titel darf maximal 50 Zeichen lang sein.");
//     }

//     const validColumnsIds = columns.map(c => c.id);
//     if (!validColumnsIds.includes(task.column)) {
//         errors.push("Ungültige Spalten-ID.");
//     }

//     if (task.taskTags && !Array.isArray(task.taskTags)) {
//         errors.push("Tags müssen als Liste (Array) gesendet werden.");
//     }

//     return errors;
// }

// ///////////////////////////
// // CRUD operations
// ///////////////////////////

// app.get("/api/counter", (req, res) => {
//     res.status(200).json({"taskIdCounter": taskIdCounter});
// });

// app.get("/api/tags", (req, res) => {
//     res.status(200).json(tags);
// });

// app.get("/api/columns", (req, res) => {
//     res.status(200).json(columns);
// });

// app.post("/api/tasks", (req, res) => {
//     console.log("BACKEND EMPFÄNGT:", req.body);
//     const errors = validateTask(req.body);

//     if (errors.length > 0) {
//         return res.status(400).json({ 
//             error: "Validierung fehlgeschlagen", 
//             details: errors 
//         });
//     }

//     let {column, title, text, taskTags} = req.body;

//     let newId = "t" + taskIdCounter;
//     let newTask = {
//         id: newId,
//         title: title,
//         text: text,
//         tags: taskTags
//     };

//     const targetColumn = columns.find(c => c.id === column);

//     if (targetColumn) {
//         targetColumn.tasks.push(newTask);
//         taskIdCounter++;
//         saveData();

//         res.status(201).json({"id": newId});
//     }

//     return res.status(404).json({error: "Spalte nicht gefunden!"});
// });

// app.put("/api/tasks/:id", (req, res) => {

//     const id = req.params.id; //funtkioniert wegen "/api/tasks/:id"
//     let {title, text, taskTags} = req.body;

//     //nun müssen wir richtige Task finden
//     let foundTask = null;
//     columns.forEach((col) => {
//         let task = col.tasks.find(e => e.id === id);
//         if (task) {
//             foundTask = task;
//         }
//     });

//     if (foundTask) {
//         foundTask.title = title;
//         foundTask.text = text;
//         foundTask.tags = taskTags;
//         saveData();
//         return res.status(200).send("Task aktualisiert");
//     }

//     return res.status(404).json({error: "Task nicht gefunden!"});
// });

// app.delete("/api/tasks/:id", (req, res) => {

//     const id = req.params.id; //funtkioniert wegen "/api/tasks/:id"
//     let deleted = false;

//     columns.forEach(col => {
//         const index = col.tasks.findIndex(t => t.id === id);
//         if (index !== -1) {
//             col.tasks.splice(index, 1);
//             deleted = true;
//         }
//     });

//     if (deleted) {
//         saveData();
//         return res.status(200).send("Task gelöscht");
//     }

//     return res.status(404).json({error: "Task nicht gefunden!"});
// });

// app.put("/api/move-task/:id", (req, res) => {

//     const id = req.params.id; //funtkioniert wegen "/api/tasks/:id"
//     const { newColumnId } = req.body;
    
//     let taskToMove = null;

//     columns.forEach(col => {
//         const index = col.tasks.findIndex(t => t.id === id);
//         if (index !== -1) {
//             taskToMove = col.tasks.splice(index, 1)[0];
//         }
//     });

//     const targetColumn = columns.find(c => c.id === newColumnId);

//     if (taskToMove && targetColumn) {
//         targetColumn.tasks.push(taskToMove);
//         saveData();
//         return res.status(200).send("Task verschoben");
//     }

//     return res.status(404).json({error: "Task nicht gefunden!"});
// });

// //Server starten
// app.listen(3000, () => {
//     console.log('Kanban-Server läuft auf http://localhost:3000');
// });