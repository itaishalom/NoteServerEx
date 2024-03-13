module.exports = {
  PORT: process.env.PORT || 4000,
  NOTE_SERVICE_URL: process.env.NOTE_SERVICE_URL || 'http://localhost:3003',
  USER_SERVICE_URL: process.env.USER_SERVICE_URL || 'http://localhost:3002',
  JWT_SECRET: process.env.JWT_SECRET || 'JWT_SECRET'
};