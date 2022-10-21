import React from "react";
import Book, { BookProps } from "./Book";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

const SearchBookListing = () => {
  const { searchedBooks } = useSelector((state: RootState) => state.book);

  return (
    <div>
      <div className="bookshelf-books">
        <ul className="books-grid">
          {searchedBooks.map((book: BookProps) => (
            <li key={book.id}>
              <Book book={book} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchBookListing;
