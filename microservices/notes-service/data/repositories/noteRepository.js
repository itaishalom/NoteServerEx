const db = require("./remote_datasource/db");
const NoteDB = require("../entity/noteDb");

class NoteRepository {
    constructor() {
        db() // TODO should be async..
    }

    async create(note, callback) {
        const newNote = await NoteDB.create(note)
        callback(null, newNote);
    }

    async findById(id, userId, callback) {
        const note = await NoteDB.findOne({_id: id, userId: userId});
        if (!note) {
            return callback(null, null);
        }

        callback(null, note);
    }

    async findPublic(page, limit, tags, searchText) {
        return await this.getPublicFilteredNotes(tags, searchText, 'public', page, limit);
    }

    async getPublicFilteredNotes(tags, searchText, visibility = 'public', page = 1, limit = 10) {
        {
            const skip = (page - 1) * limit;
            const query = {
                visibility
            };

            this.buildQuery(tags, query, searchText);

            try {
                return await NoteDB.find(query).skip(skip)
                    .limit(limit);
            } catch (error) {
                console.error('Error finding notes:', error);
                throw error;
            }
        }
    }

    buildQuery(tags, query, searchText) {
        if (tags && tags.length > 0) {
            query.tags = {$in: tags};
        }
        if (searchText) {
            query.body = {$regex: new RegExp(searchText, 'i')};
        }
    }

    async findByUserId(userId, page, limit, tags, searchText) {
        const skip = (page - 1) * limit;
        const query = {
            userId
        };

        this.buildQuery(tags, query, searchText);

        try {
            return await NoteDB.find(query).skip(skip)
                .limit(limit);
        } catch (error) {
            console.error('Error finding notes:', error);
            throw error;
        }
    }

    async updateById(noteId, updatedData, callback) {
         const updatedNote = await NoteDB.findByIdAndUpdate(noteId, updatedData, {new: true});
        if (!updatedNote) {
            return callback(null, null);
        }
        callback(null, updatedNote);
    }

    async deleteById(noteId, callback) {
        try {
            const deletedNote = await NoteDB.findByIdAndDelete(noteId);
            callback(null, deletedNote)
        } catch
            (error) {
            callback(null, null);
        }
    }
}

module
    .exports = NoteRepository;