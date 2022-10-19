import React from "react";
import Book from "./Book";
import { BookType } from "../store/book/bookSlice";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

interface HomeBookListingProps {
  title: string;
}

const HomeBookListing = ({ title }: HomeBookListingProps) => {
  const { currentlyReadBooks, readBooks, wantToReadBooks } = useSelector(
    (state: RootState) => state.book
  );

  // Prepare the books to be displayed
  let books: BookType[] = [];
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
        <ol className="books-grid">
          {books.map((book: BookType) => (
            <li key={book.id}>
              <Book book={book} />
            </li>
          ))}
        </ol>
        {/* <Spinner /> */}
      </div>
    </div>
  );
};

export default HomeBookListing;
