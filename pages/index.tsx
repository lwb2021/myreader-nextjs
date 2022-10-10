import Shelf from "../components/Shelf";
import React, { useEffect, useRef } from "react";
import { getAll } from "./api/BooksAPI";
import { trackPromise } from "react-promise-tracker";
import { RESPONSE_KEY_MAP, CATEGORIES } from "./constants";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import {} from "../store/book/bookSlice";
import type { RootState } from "../store/store";
import { moveTo, removeFrom } from "../store/book/bookSlice";

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
  setCurrentlyReadBooks,
  setReadBooks,
  setWantToReadBooks,
}: Props) => {
  const router = useRouter();
  let currentlyReadBooks = useSelector(
    (state: RootState) => state.book.currentlyReadBooks
  );

  let readBooks = useSelector((state: RootState) => state.book.readBooks);
  let wantToReadBooks = useSelector(
    (state: RootState) => state.book.wantToReadBooks
  );
  // const currentlyReadBooks = useRef<Array<object>>([]);
  // const readBooks = useRef<Array<object>>([]);
  // const wantToReadBooks = useRef<Array<object>>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    function displayBooks(response: Array<any>) {
      for (const bookObject of response) {
        const action = {
          category: bookObject.shelf,
          book: bookObject,
        };
        dispatch(moveTo(action));
      }
    }

    async function fetchBooks() {
      console.log("fetchbooks");
      try {
        const response = await getAll();
        console.log("getAll");
        // localStorage.setItem(
        //   RESPONSE_KEY_MAP.fetchResponse,
        //   JSON.stringify(response)
        // );

        // Add all book IDs to the set
        // response.map((book: any) => addBook(book));
        displayBooks(response);
      } catch (err) {
        console.log(err);
      }
    }

    // Retrieve the shelves' information from the local storage if it exists
    // if (localStorage.getItem(RESPONSE_KEY_MAP.fetchResponse)) {
    // const response = localStorage.getItem(RESPONSE_KEY_MAP.fetchResponse);
    // if (response) {
    //   displayBooks(JSON.parse(response));
    // }

    // console.log(
    //   currentlyReadBooks.current.length,
    //   readBooks.current.length,
    //   wantToReadBooks.current.length
    // );
    // if (
    //   currentlyReadBooks.current.length ||
    //   readBooks.current.length ||
    //   wantToReadBooks.current.length
    // ) {
    //   console.log("here");
    //   console.log(currentlyReadBooks.current);
    // } else {
    //   // trackPromise(fetchBooks());
    //   // fetchBooks();
    //   console.log(123);
    // }
    trackPromise(fetchBooks());
  }, []);

  return (
    <div className="app">
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
              addBook={addBook}
              // TODO: fit
              setSearchResults={function () {}}
              onSearchPage={false}
            />
            <Shelf
              title="Read"
              books={readBooks}
              shelfIndex={CATEGORIES.indexOf("read")}
              moveBook={moveBook}
              addBook={addBook}
              // TODO: fit
              setSearchResults={function () {}}
              onSearchPage={false}
            />
            <Shelf
              title="Want To Read"
              books={wantToReadBooks}
              shelfIndex={CATEGORIES.indexOf("wantToRead")}
              moveBook={moveBook}
              addBook={addBook}
              // TODO: fit
              setSearchResults={function () {}}
              onSearchPage={false}
            />
          </div>
        </div>
        <div className="open-search">
          <button onClick={() => router.push("/search")}>Add a book</button>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
