import React from "react";
import Book, { BookProps } from "./Book";
import { Spinner } from "./Spinner";

interface SearchBookListingProps {
  books: BookProps[];
  spinnerVisible: boolean;
}

const SearchBookListing = ({
  books,
  spinnerVisible,
}: SearchBookListingProps) => {
  return (
    <div>
      <div className="bookshelf-books">
        {spinnerVisible ? (
          <Spinner spinnerVisible={spinnerVisible} />
        ) : (
          <ul className="books-grid">
            {books.map((book: BookProps) => (
              <li key={book.id}>
                <Book book={book} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchBookListing;
