import React from "react";
import Book from "./Book";
import { Spinner } from "./Spinner";
import { BookType } from "../store/book/bookSlice";
import { usePromiseTracker } from "react-promise-tracker";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

interface SearchBookListingProps {
  books: BookType[];
}

const SearchBookListing = ({ books }: SearchBookListingProps) => {
  const { promiseInProgress } = usePromiseTracker();
  const BLANK_MSG = "No result found.";
  const { prevSearchWord } = useSelector((state: RootState) => state.book);

  return books.length === 0 ? (
    <div>
      <h3
        style={{
          visibility: promiseInProgress
            ? "hidden"
            : prevSearchWord
            ? "visible"
            : "hidden",
        }}
      >
        {BLANK_MSG}
      </h3>
      <Spinner />
    </div>
  ) : (
    <div>
      <div className="bookshelf-books">
        <ul className="books-grid">
          {books.map((book: BookType) => (
            <li key={book.id}>
              <Book book={book} />
            </li>
          ))}
        </ul>
      </div>
      <Spinner />
    </div>
  );
};

export default SearchBookListing;
