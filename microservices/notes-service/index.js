
const express = require('express');
const bodyParser = require('body-parser');
const { PORT } = require('./config');
const NoteRepository = require("./data/repositories/noteRepository");
const NoteController = require("./controllers/noteController");
const AuthMiddleware = require("./middleware/authMiddleware");
const AppLogger = require("./utils/appLogger");
const app = express();
const noteRepository = new NoteRepository()
const noteController = new NoteController(noteRepository, new AppLogger());

const authMiddleware = new AuthMiddleware(noteRepository)

app.use(bodyParser.json());

app.get('/notes',  noteController.getAllNotes);

app.delete('/notes/:id', authMiddleware.authorizeNoteAccess, noteController.removeNote);

app.put('/notes/:id', authMiddleware.authorizeNoteAccess, noteController.updateNote);


app.post('/notes', noteController.addNote);

app.listen(PORT, () => {
  console.log(`User service listening at http://localhost:${PORT}`);
});
