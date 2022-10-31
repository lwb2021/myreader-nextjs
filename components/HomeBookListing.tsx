import React from "react";
import Book from "./Book";
import { BookProps } from "./Book";
import { useAppSelector } from "../app/hooks";
import { Spinner } from "./Spinner";

interface HomeBookListingProps {
  title: string;
  getAllBooksLoading: boolean;
}

const HomeBookListing = ({
  title,
  getAllBooksLoading,
}: HomeBookListingProps) => {
  const { currentlyReading, read, wantToRead } = useAppSelector(
    (state) => state.book
  );
  // Prepare the books to be displayed
  let books: BookProps[] = [];
  switch (title) {
    case "Currently Reading":
      books = currentlyReading;
      break;
    case "Read":
      books = read;
      break;
    case "Want To Read":
      books = wantToRead;
      break;
  }

  return (
    <div className="bookshelf">
      <h2 className="bookshelf-title">{title}</h2>
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

export default HomeBookListing;
