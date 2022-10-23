import React, { useEffect, useRef } from "react";
import { CATEGORIES } from "../utils/constants";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { displayHomePageBooks, move } from "../store/book/bookSlice";
import { getAll as getAllBooks } from "../pages/api/BooksAPI";

export interface BookProps {
  id: string;
  shelf: string;
  imageLinks: {
    thumbnail: string;
  };
  title: string;
  authors: string[];
}

const Book = ({ book }: { book: BookProps }) => {
  const CATEGORIES_LENGTH = CATEGORIES.length;
  const dispatch = useDispatch<any>();
  const router = useRouter();
  const currentlySelectedIndex = useRef(-1);

  async function onSelect(event: React.ChangeEvent<HTMLSelectElement>) {
    // Update the book
    const shelf = event.currentTarget.value;
    const moveAction = {
      book,
      shelf,
    };
    await dispatch(move(moveAction));

    // Mark the book as selected
    if (router.pathname === "/search") {
      setBookVisibility();
    }
    // Update home book listing information
    const response = await getAllBooks();
    const action = {
      response: response,
    };
    dispatch(displayHomePageBooks(action));
  }

  function setBookVisibility() {
    const checkElement = document.getElementById(
      `checkmark_${book.id}`
    ) as HTMLImageElement;
    checkElement.style.visibility = "visible";
  }

  useEffect(() => {
    // Set the default selected option of all the dropdown menus
    function setDefaultBookStatus() {
      // Set it as CATEGORIES_LENGTH so all choices are unselected
      const elem = document.getElementById(book.id) as HTMLSelectElement;
      currentlySelectedIndex.current = book.shelf
        ? CATEGORIES.indexOf(book.shelf) + 1
        : CATEGORIES_LENGTH;
      elem.options.selectedIndex = currentlySelectedIndex.current;

      // ? does not work
      // elem.options.selectedIndex = CATEGORIES_LENGTH;

      if (
        router.pathname === "/search" &&
        currentlySelectedIndex.current !== CATEGORIES_LENGTH
      ) {
        setBookVisibility();
      }
    }
    setDefaultBookStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="book">
      <div className="book-top">
        <div
          className="book-cover"
          style={{
            width: 128,
            height: 193,
            backgroundImage:
              `${book.imageLinks}` !== "undefined"
                ? `url("${book.imageLinks.thumbnail}")`
                : `url(undefined)`,
          }}
        ></div>
        <Image
          id={`checkmark_${book.id}`}
          className="checkmark"
          alt="checkmark"
          src="/checkmark.jpeg"
          layout="fill"
        />
        <div className="book-shelf-changer">
          <select onChange={onSelect} id={book.id}>
            <option value="move" disabled>
              Move to...
            </option>
            <option value="currentlyReading">Currently Reading</option>
            <option value="read">Read</option>
            <option value="wantToRead">Want to Read</option>

            {router.pathname === "/search" ? null : (
              <option value="delete">Delete</option>
            )}
          </select>
        </div>
      </div>
      <div className="book-title">{book.title}</div>
      <div className="book-authors">{book.authors}</div>
    </div>
  );
};

export default Book;
