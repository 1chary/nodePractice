const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());

const db_path = path.join(__dirname, "goodreads.db");

let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: db_path,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

// GET ALL BOOKS API
app.get("/books/", async (request, response) => {
  const getBooksQuery = `
        SELECT 
	        *
        FROM 
	        book
       ORDER BY 
        book_id;`;
  const get_details = await db.all(getBooksQuery);
  response.send(get_details);
});

// GET USING ID
app.get("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;
  const getBooksQuery = `
        SELECT 
	        *
        FROM 
	        book
        WHERE 
            book_id = ${bookId};`;
  const get_details = await db.get(getBooksQuery);
  response.send(get_details);
});

initializeDbAndServer();
