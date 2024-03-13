const axios = require('axios');

const baseURL = 'http://localhost:4000';

async function createUser() {
  try {
    const response = await axios.post(`${baseURL}/users`, {
      username: 'exampleUser',
      email: 'user@example.com',
      password: 'password123'
    });
    console.log('User created:', response.data);
    return response.data.userId;
  } catch (error) {
    console.error('Error creating user:', error.message);
    throw error;
  }
}

async function loginUser() {
  try {
    const response = await axios.post(`${baseURL}/login`, {
      email: 'user@example.com',
      password: 'password123'
    });
    console.log('User logged in:', response.data);
    return response.data.accessToken;
  } catch (error) {
    console.error('Error logging in:', error.message);
    throw error;
  }
}

async function addNote(accessToken) {
  try {
    const response = await axios.post(`${baseURL}/notes`, {
      title: 'Example Note',
      content: 'This is an example note content.'
    }, {
      headers: {
        Authorization: accessToken
      }
    });
    console.log('Note added:', response.data);
    return response.data.noteId;
  } catch (error) {
    console.error('Error adding note:', error.message);
    throw error;
  }
}

async function getNote(noteId) {
  try {
    const response = await axios.get(`${baseURL}/notes/${noteId}`);
    console.log('Note retrieved:', response.data);
  } catch (error) {
    console.error('Error getting note:', error.message);
    throw error;
  }
}

async function main() {
  try {
    await createUser();

    const accessToken = await loginUser();

    const noteId = await addNote(accessToken);

    await getNote(noteId);
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
}

main();
