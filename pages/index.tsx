import Shelf from "../components/Shelf";
import React, { useEffect, useRef } from "react";
import { getAll } from "./api/BooksAPI";
import { trackPromise } from "react-promise-tracker";
import { CATEGORIES } from "./constants";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store/store";
import { moveTo, switchMode } from "../store/book/bookSlice";

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
  let firstTimeLoad = useSelector(
    (state: RootState) => state.book.firstTimeLoad
  );

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

        displayBooks(response);
      } catch (err) {
        console.log(err);
      }
    }

    if (firstTimeLoad) {
      trackPromise(fetchBooks());
      dispatch(switchMode());
    }
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
              addBook={addBook}
              // TODO: fit
              setSearchResults={function () {}}
              onSearchPage={false}
            />
            <Shelf
              title="Read"
              books={readBooks}
              shelfIndex={CATEGORIES.indexOf("read")}
              addBook={addBook}
              // TODO: fit
              setSearchResults={function () {}}
              onSearchPage={false}
            />
            <Shelf
              title="Want To Read"
              books={wantToReadBooks}
              shelfIndex={CATEGORIES.indexOf("wantToRead")}
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
