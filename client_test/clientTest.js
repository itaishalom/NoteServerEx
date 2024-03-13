const axios = require('axios');
const assert = require("assert");

// Define the base URL of the gateway service
const baseURL = 'http://localhost:4000';

const NoteVisibility = {
    PUBLIC: 'public',
    PRIVATE: 'private'
};

// Function to create a new user
async function createUser() {
    try {
        const response = await axios.post(`${baseURL}/users`, {
            username: 'exampleUser',
            email: 'user@example.com',
            password: 'password123'
        });
        console.log('User created:', response.data);
        return response.data.user.id; // Return the ID of the created user
    } catch (error) {
        console.error('Error creating user:', error.message);
//    throw error; // Throw the error for handling
    }
}

// Function to login as a user
async function loginUser() {
    try {
        const response = await axios.post(`${baseURL}/users/login`, {
            email: 'user@example.com',
            password: 'password123'
        });
        console.log('User logged in:', response.data);
        return response.data.accessToken; // Return the access token
    } catch (error) {
        console.error('Error logging in:', error.message);
        throw error; // Throw the error for handling
    }
}

// Function to add a note
async function addNote(accessToken) {
    try {
        const response = await axios.post(`${baseURL}/notes`, {
            title: 'Example Note',
            body: 'This is an example note content.',
            tags: ['hello', 'world'],
            visibility: NoteVisibility.PRIVATE
        }, {
            headers: {
                Authorization: accessToken // Include the access token in the request headers
            }
        });
        console.log('Note added:', response.data);
        return response.data.id; // Return the ID of the added note
    } catch (error) {
        console.error('Error adding note:', error.message);
        throw error; // Throw the error for handling
    }
}

// Function to get a note
async function getNote(noteId) {
    try {
        const response = await axios.get(`${baseURL}/notes/${noteId}`);
        console.log('Note retrieved:', response.data);
    } catch (error) {
        console.error('Error getting note:', error.message);
        throw error; // Throw the error for handling
    }
}

async function getAllNote(accessToken, tags, searchText) {
    try {
        const response = await axios.get(`${baseURL}/notes`, {
            headers: {
                Authorization: accessToken // Include the access token in the request headers
            },
            params: {
                tags: tags,
                searchText: searchText
            }
        });
        console.log('Note retrieved:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error getting note:', error.message);
        throw error; // Throw the error for handling
    }
}

async function deleteNote(accessToken, noteId) {
    try {
        const response = await axios.delete(`${baseURL}/notes/${noteId}`, {
            headers: {
                Authorization: accessToken // Include the access token in the request headers
            }
        });
        console.log('Note delete');
    } catch (error) {
        console.error('Error getting note:', error.message);
        throw error; // Throw the error for handling
    }
}


// Main function to orchestrate the process
async function main() {
    try {
        // Create a user
        await createUser();
        let result = await getAllNote();
        //print(result)
        // Login as the created user
        const accessToken = await loginUser();

        // Add a note
        const noteId = await addNote(accessToken);
        result = await getAllNote(accessToken,  undefined, 'example');

        assert(result.length === 1)
        result = await getAllNote(accessToken, 'hello', 'example');
        assert(result.length === 1)
        result = await getAllNote(accessToken, 'hello1');
        assert(result.length === 0)
        result = await getAllNote(accessToken, undefined, 'sdfsf');
        assert(result.length === 0)
        // Get the added note
        result = await getAllNote(accessToken);
        await deleteNote(accessToken, result[0]._id);
    } catch (error) {
        console.error('An error occurred:', error.message);
    }
}

// Invoke the main function to start the process
main();
