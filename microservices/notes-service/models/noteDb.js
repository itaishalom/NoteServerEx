const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  tags: [String],
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'private'
  }
});

const NoteDB = mongoose.model('Note', noteSchema);

module.exports = NoteDB;