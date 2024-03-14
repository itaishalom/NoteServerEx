const NoteController = require('../controllers/noteController');
const NoteRepository = require('../data/repositories/noteRepository');

const mockRepository = {
    create: jest.fn(),
    findByUserId: jest.fn(),
    deleteById: jest.fn(),
    updateById: jest.fn()
};

const noteController = new NoteController(mockRepository);

describe('Note Controller', () => {
    test('Add Note', () => {
        const req = {
            body: {
                title: 'Test Title',
                body: 'Test Body',
                tags: ['tag1', 'tag2'],
                visibility: 'private'
            },
            headers: { 'user-id': 'testUserId' }
        };
        const res = {
            status: jest.fn(),
            json: jest.fn()
        };

        noteController.addNote(req, res);

        expect(mockRepository.create).toHaveBeenCalledTimes(1);
    });

     test('Get All Notes', () => {
        const req = {
            headers: { 'user-id': 'testUserId' },
            query: {}
        };
        const res = {
            status: jest.fn(),
            json: jest.fn()
        };

        noteController.getAllNotes(req, res);

        expect(mockRepository.findByUserId).toHaveBeenCalledTimes(1);
    });

    test('Remove Note', () => {
        const req = {
            params: { id: 'testNoteId' }
        };
        const res = {
            status: jest.fn(),
            json: jest.fn()
        };

        noteController.removeNote(req, res);

        expect(mockRepository.deleteById).toHaveBeenCalledTimes(1);
    });

    test('Update Note', () => {
        const req = {
            params: { id: 'testNoteId' },
            body: { title: 'Updated Title', body: 'Updated Body', tags: ['updatedTag'], visibility: 'private' }
        };
        const res = {
            status: jest.fn(),
            json: jest.fn()
        };

        noteController.updateNote(req, res);

        expect(mockRepository.updateById).toHaveBeenCalledTimes(1);
    });
});
