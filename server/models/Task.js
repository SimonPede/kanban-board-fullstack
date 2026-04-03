const mongoose = require('mongoose');
//MongoDB ist im Gegensatz zu SQL dokumentorientiert, nicht Tabellenorientiert!
//ein einzelner Datensatz (z.B. eine Task) ist ist ein Dokument, keine Zeile in einer Tabelle
//ein Field ist dann eine Eigenschaft und keine Spalte
//Ein Dokument in MongoDB sieht fast exakt so aus wie ein JSON-Objekt in JavaScript. Intern nutzt MongoDB aber BSON (Binary JSON).
// Vorteil: Es unterstützt mehr Datentypen als Standard-JSON (z. B. echte Date-Objekte oder Binärdaten).
// Flexibilität: In SQL muss jede Zeile dieselben Spalten haben. In MongoDB könnte ein Task 3 Tags haben und der nächste gar keine – die Datenbank beschwert sich nicht.
// Jedes Dokument in MongoDB bekommt automatisch ein Feld namens _id (12-bit hash)
//Habe die id für eine Task nicht übernommen, da MongoDB sich um IDs kümmert, muss ich nicht merh sleber zusammenbauen

//MongoDB selbst ist "schema-los" (man kann alles reinschmeißen)
//daher nutzen wir mongoose um ein Schema zu definieren (welche Felder ein Task haben darf)
//Model: Aus dem Schema wird ein Model. Das ist wie eine Klasse, mit der man Befehle ausführen kann (z. B. Task.find())

const TaskSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true, 
        maxlength: 50 
    },
    text: { 
        type: String, 
        default: "" 
    },
    columnId: { 
        type: String, 
        required: true 
    },
    tags: [String],
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

//damit ich frontend weiterhin .id nutzen kann und nicht ._id nutzen muss
TaskSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id }
});

module.exports = mongoose.model("Task", TaskSchema);