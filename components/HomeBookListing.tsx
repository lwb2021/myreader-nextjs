import React from "react";
import Book from "./Book";
import { BookType } from "../store/book/bookSlice";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

interface HomeBookListingProps {
  titlesArray: string[];
}

const HomeBookListing = ({ titlesArray }: HomeBookListingProps) => {
  const { currentlyReadBooks, readBooks, wantToReadBooks } = useSelector(
    (state: RootState) => state.book
  );
  const listingMap = new Map();
  listingMap.set("Currently Reading", currentlyReadBooks);
  listingMap.set("Read", readBooks);
  listingMap.set("Want To Read", wantToReadBooks);

  return (
    <div className="bookshelf">
      {titlesArray.map((title: string) => (
        <div key={title}>
          <h2 className="bookshelf-title">{title}</h2>
          <div className="bookshelf-books">
            <ul className="books-grid">
              {listingMap.get(title).map((book: BookType) => (
                <li key={book.id}>
                  <Book book={book} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HomeBookListing;
