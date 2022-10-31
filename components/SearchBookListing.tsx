import React from "react";
import Book, { BookProps } from "./Book";
import { Spinner } from "./Spinner";

interface SearchBookListingProps {
  books: BookProps[];
  getAllBooksLoading: boolean;
}

const SearchBookListing = ({
  books,
  getAllBooksLoading,
}: SearchBookListingProps) => {
  return (
    <div>
      <div className="bookshelf-books">
        {getAllBooksLoading ? (
          <Spinner isVisible={getAllBooksLoading} />
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
