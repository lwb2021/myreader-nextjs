import Shelf from "../components/Shelf";
// import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import { getAll } from "../pages/api/BooksAPI";
import { trackPromise } from "react-promise-tracker";
import { RESPONSE_KEY_MAP, CATEGORIES } from "./constants";
// import PropTypes from "prop-types";

interface Props {
  addBook: Function;
  moveBook: Function;
  currentlyReadBooks: string[];
  setCurrentlyReadBooks: Function;
  readBooks: string[];
  setReadBooks: Function;
  wantToReadBooks: string[];
  setWantToReadBooks: Function;
}

const MainPage = ({
  addBook,
  moveBook,
  currentlyReadBooks,
  setCurrentlyReadBooks,
  readBooks,
  setReadBooks,
  wantToReadBooks,
  setWantToReadBooks,
}: Props) => {
  // const navigate = useNavigate();

  useEffect(() => {
    function displayBooks(response: any) {
      const currentlyReading = response.filter(
        (item: any) => item.shelf === CATEGORIES[0]
      );
      setCurrentlyReadBooks(currentlyReading);
      const read = response.filter((item: any) => item.shelf === CATEGORIES[1]);
      setReadBooks(read);
      const wantToRead = response.filter(
        (item: any) => item.shelf === CATEGORIES[2]
      );
      setWantToReadBooks(wantToRead);
    }

    async function fetchBooks() {
      try {
        const response = await getAll();
        localStorage.setItem(
          RESPONSE_KEY_MAP.fetchResponse,
          JSON.stringify(response)
        );

        // Add all book IDs to the set
        response.map((book: any) => addBook(book));
        displayBooks(response);
      } catch (err) {
        console.log(err);
      }
    }

    // Retrieve the shelves' information from the local storage if it exists
    if (localStorage.getItem(RESPONSE_KEY_MAP.fetchResponse)) {
      const response = localStorage.getItem(RESPONSE_KEY_MAP.fetchResponse);
      if (response) {
        displayBooks(JSON.parse(response));
      }
    } else {
      trackPromise(fetchBooks());
    }
  }, []);

  return (
    <div className="list-books">
      <div className="list-books-title">
        <h1>MyReads</h1>
      </div>
      <div className="list-books-content">
        <div>
          <Shelf
            title="Currently Reading"
            books={currentlyReadBooks}
            shelfIndex={CATEGORIES.indexOf("currentlyReading")}
            moveBook={moveBook}
          />
          <Shelf
            title="Read"
            books={readBooks}
            shelfIndex={CATEGORIES.indexOf("read")}
            moveBook={moveBook}
          />
          <Shelf
            title="Want To Read"
            books={wantToReadBooks}
            shelfIndex={CATEGORIES.indexOf("wantToRead")}
            moveBook={moveBook}
          />
        </div>
      </div>
      {/* <div className="open-search">
        <button onClick={() => navigate("/search")}>Add a book</button>
      </div> */}
    </div>
  );
};

export default MainPage;
