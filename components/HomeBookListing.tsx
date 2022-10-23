import React from "react";
import Book from "./Book";
import { BookProps } from "./Book";
import { useSelector } from "react-redux";
import { Spinner } from "./Spinner";
import type { RootState } from "../store/store";

interface HomeBookListingProps {
  title: string;
  spinnerVisible: boolean;
}

const HomeBookListing = ({ title, spinnerVisible }: HomeBookListingProps) => {
  const { currentlyReadBooks, readBooks, wantToReadBooks } = useSelector(
    (state: RootState) => state.book
  );

  // Prepare the books to be displayed
  let books: BookProps[] = [];
  switch (title) {
    case "Currently Reading":
      books = currentlyReadBooks;
      break;
    case "Read":
      books = readBooks;
      break;
    case "Want To Read":
      books = wantToReadBooks;
      break;
  }

  return (
    <div className="bookshelf">
      <h2 className="bookshelf-title">{title}</h2>
      <div className="bookshelf-books">
        {spinnerVisible ? (
          <Spinner spinnerVisible={spinnerVisible} />
        ) : (
          <ol className="books-grid">
            {books.map((book: BookProps) => (
              <li key={book.id}>
                <Book book={book} />
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
};

export default HomeBookListing;
