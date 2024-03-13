const { Note, NoteVisibility } = require('../models/Note');

describe('Note Model', () => {
    test('Create Note', () => {
        const id = 'testId';
        const title = 'Test Title';
        const body = 'Test Body';
        const tags = ['tag1', 'tag2'];
        const userId = 'testUserId';
        const visibility = NoteVisibility.PUBLIC;

        const note = new Note(id, title, body, tags, userId, visibility);

        expect(note).toEqual({
            id,
            title,
            body,
            tags,
            userId,
            visibility
        });
    });

    test('Note Visibility', () => {
        expect(NoteVisibility.PUBLIC).toBe('public');
        expect(NoteVisibility.PRIVATE).toBe('private');
    });
});
