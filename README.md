**# ⭐CRUD Note Backend App⭐**

**⭐Introduction:**

* This Node.js application, built with Express, offers a robust backend for a CRUD (Create, Read, Update, Delete) Note application. It leverages a microservice architecture for user authentication, note management, and API routing.

**⭐Features:**

* ✅ User Authentication:
    * Users can register for new accounts. 
    * Login with existing credentials grants a secure password. 
* ✅ Note Management:
    * Create new notes. 
    * Search for notes based on criteria (implementation details can be specified here). 
      * (Optional) Implement advanced search capabilities (e.g., full-text search, filtering by tags).  
    * Update existing notes. 
    * Delete notes. 
    * Secured access:
        * Logged-in users can only see their private notes. 
        * Public notes are visible to everyone. 
* ✅ Microservices Architecture:
    * Gateway: Handles user authentication and API routing. 
    * User Microservice: Manages user creation and login functionalities. 
    * Note Microservice: Handles all note-related operations (CRUD). 
* ✅ Domain and Data Layers:
    * Each microservice implements a clean separation between domain logic (business rules) and data access (interaction with MongoDB). 
* ✅ Fully test:
    * The app is tested to make sure it is robust. 
  
**⭐Technology Stack:**

* ✅ Node.js
* ✅ Express.js
* ✅ MongoDB

**⭐Installation:**

1. Clone this repository:

   ```bash
   git clone https://github.com/itaishalom/NoteServerEx
   ```

2. Install dependencies:

   ```bash
   cd crud-note-backend
   npm install
   ```

**Configuration:**

1. Create a `.env` file in the project root directory.
2. Add environment variables for database connection details and any other necessary configurations.

**Running the Application:**

**Important:** You need to run all three microservices for the application to function properly. However, the User and Note services should be run with unexposed ports for security reasons.

1. **Gateway Service:**

   ```bash
   node index.js
   ```

2. **User Microservice (Unexposed Port):**

   ```bash
   node index.js
   ```

3. **Note Microservice (Unexposed Port):**

   ```bash
   node index.js
   ```


**Usage:**

* Refer to API documentation (consider using tools like Swagger for a more interactive experience).  ⭐
* Implement client-side applications (web or mobile) to interact with the backend API.  ⭐
