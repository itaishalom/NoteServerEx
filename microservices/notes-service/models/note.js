
const NoteVisibility = {
  PUBLIC: 'public',
  PRIVATE: 'private'
};
class Note {
  constructor(id, title, body, tags, userId, visibility) {
    this.id = id;
    this.title = title;
    this.body = body;
    this.tags = tags;
    this.userId = userId;
    this.visibility = visibility;
  }
}

module.exports = {Note, NoteVisibility };
