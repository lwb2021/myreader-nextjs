import React from "react";
import Book from "./Book";
import { Spinner } from "./Spinner";

interface Props {
  title: string;
  books: any;
  moveBook: Function;
  shelfIndex?: number;
  addBook?: Function;
  setSearchResults?: Function;
  onSearchPage?: boolean;
}

const Shelf = ({
  title,
  books,
  shelfIndex,
  addBook,
  moveBook,
  setSearchResults,
  onSearchPage,
}: Props) => {
  return (
    <div className="bookshelf">
      <h2 className="bookshelf-title">{title}</h2>
      <div className="bookshelf-books">
        <ol className="books-grid">
          {books.map((book: any) => (
            <li key={book.id}>
              <Book
                book={book}
                shelfIndex={shelfIndex}
                addBook={addBook}
                moveBook={moveBook}
                setSearchResults={setSearchResults}
                onSearchPage={onSearchPage}
              />
            </li>
          ))}
        </ol>
        <Spinner />
      </div>
    </div>
  );
};

export default Shelf;
