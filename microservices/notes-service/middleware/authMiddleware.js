const getRepositoryInstance = require("../data/repositories/noteRepository");

class AuthMiddleware {
    constructor(noteRepository) {
        this.noteRepository = noteRepository
    }

    authorizeNoteAccess = (req, res, next) => {
        const noteId = req.params.id;
        const userId = req.headers['user-id'];

        this.noteRepository.findById(noteId, userId, (err, note) => {
            if (err) {
                res.status(500).json({message: 'Failed to find note'});
            } else if (!note) {
                res.status(404).json({message: 'Note not found'});
            }  else {
                next();
            }
        });
    };
}

module.exports = AuthMiddleware