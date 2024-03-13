// users-service/config.js

module.exports = {
  PORT: process.env.PORT || 3003,
  DATABASE_URL: process.env.DATABASE_URL || 'mongodb://localhost:27017/NoteServcer',
  JWT_SECRET: process.env.JWT_SECRET || 'JWT_SECRET'
};
