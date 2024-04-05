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

// ADD A NEW BOOK

app.post("/books/", async (request, response) => {
  const bookDetails = request.body;
  const {
    title,
    authorId,
    rating,
    ratingCount,
    reviewCount,
    description,
    pages,
    dateOfPublication,
    editionLanguage,
    price,
    onlineStores,
  } = bookDetails;
  const add_a_book = `
  INSERT INTO
      book (title,author_id,rating,rating_count,review_count,description,pages,date_of_publication,edition_language,price,online_stores)
    VALUES
      (
        '${title}',
         ${authorId},
         ${rating},
         ${ratingCount},
         ${reviewCount},
        '${description}',
         ${pages},
        '${dateOfPublication}',
        '${editionLanguage}',
         ${price},
        '${onlineStores}'
      );
  `;
  const get_result = await db.run(add_a_book);
  const bookId = get_result.lastID;

  response.send({ book_id: bookId });
});

// TO UPDATE A BOOK
app.put("/books/:bookId", async (request, response) => {
  const { bookId } = request.params;
  const bookUpdateDetails = request.body;
  const { title } = bookUpdateDetails;
  const updateBook = `
    UPDATE 
        book
    SET 
        title = '${title}'
    WHERE 
        book_id = ${bookId};
  `;
  await db.run(updateBook);
  response.send("Book Updated Successfully");
});

// DELETING A BOOK
app.delete("/books/:bookId", async (request, response) => {
  const { bookId } = request.params;
  const delete_book = `
    DELETE FROM
        book
    WHERE 
        book_id = ${bookId};
    `;
  await db.run(delete_book);
  response.send("Book deleted successfully");
});

initializeDbAndServer();
