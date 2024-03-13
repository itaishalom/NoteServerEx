const {Note} = require("../models/note");


const pageNumber = 1;
const limitResults = 10;

class NoteController {
    constructor(noteRepository, appLoger) {
        this.noteRepository = noteRepository
        this.logger = appLoger
    }

    addNote = (req, res) => {
        const {title, body, tags, visibility} = req.body;
        const userId = req.headers['user-id']
        const newNote = new Note(
            '',
            title,
            body,
            tags,
            userId,
            visibility
        );
        try {
            this.noteRepository.create(newNote, (err, savedNote) => {
                if (err) {
                    res.status(500).json({message: 'Failed to add note'});
                } else {
                    res.status(201).json(savedNote);
                }
            });
        } catch (e) {
            this.logger.error(e);
            throw new e;
        }
    };


    async handlePrivateNotes(page, limit, userId, tags, searchText, res) {
        try {
        const userNotes = await this.noteRepository.findByUserId(userId, page, limit, tags, searchText)
           res.json(userNotes);
        } catch (error) {
            res.status(500).json({message: 'Failed to get notes'});
        }
    }



    async handlePublicNotes(page, limit, tags, searchText, res) {
        try {
            const userNotes = await this.noteRepository.findPublic(page, limit, tags, searchText);
            res.json(userNotes);
        } catch (error) {
            res.status(500).json({message: 'Failed to get notes'});
        }
    }


     getAllNotes = async (req, res) => {
        const userId = req.headers['user-id']

        const page = parseInt(req.query.page) || pageNumber;
        const limit = parseInt(req.query.limit) || limitResults;


        const {tags, searchText} = req.query;
        const tagArray = tags ? tags.split(',') : [];
        try {
            if (userId === undefined) {
                await this.handlePublicNotes(page, limit, tagArray, searchText, res);
            } else {
               await this.handlePrivateNotes(page, limit, userId, tagArray, searchText, res);
            }
        } catch (e) {
            this.logger.error(e);
            throw new e;
        }
    };


    removeNote = async (req, res) => {
        const noteId = req.params.id;
        try {
           await this.noteRepository.deleteById(noteId, (err, deletedNote) => {
                if (err) {
                    res.status(500).json({message: 'Failed to delete note'});
                } else if (!deletedNote) {
                    res.status(404).json({message: 'Note not found'});
                } else {
                    res.status(204).end();
                }
            });
        } catch (e) {
            this.logger.error(e);
            throw new e;
        }
    };

    updateNote = async (req, res) => {
        const noteId = req.params.id;
        const {title, body, tags} = req.body;
        try {

           await this.noteRepository.updateById(noteId, {title, body, tags}, (err, updatedNote) => {
                if (err) {
                    res.status(500).json({message: 'Failed to update note'});
                } else if (!updatedNote) {
                    res.status(404).json({message: 'Note not found'});
                } else {
                    res.json(updatedNote);
                }
            });
        } catch (e) {
            this.logger.error(e);
            res.status(500).json({message: 'Failed to update note'});
        }
    };
}

module.exports = NoteController;