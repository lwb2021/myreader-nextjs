import React, { useEffect, useState } from "react";
import { CATEGORIES } from "../pages/constants";
import Image from "next/image";
import { moveTo, removeFrom, removeDownload } from "../store/book/bookSlice";
import { useDispatch } from "react-redux";

interface Props {
  title?: string;
  book: any;
  shelfIndex: number;
  addBook: Function;
  onSearchPage: boolean;
}

const Book = ({ book, onSearchPage }: Props) => {
  const WIDTH = 128;
  const HEIGHT = 193;
  const DELETE = "delete";
  const NONE_OPTION_INDEX = 4;
  const CHECKMARK_ID = `checkmark_${book.id}`;
  const [optionStatus, setOptionStatus] = useState(false);
  const dispatch = useDispatch();

  function moveBook(
    book: any,
    prevCategory: string | undefined,
    currCategory: string
  ) {
    const moveAction = {
      category: currCategory,
      book: book,
    };
    dispatch(moveTo(moveAction));

    // Remove from the previous shelf
    const removeAction = {
      category: prevCategory,
      book: book,
    };
    dispatch(removeFrom(removeAction));
  }

  function deleteBook(book: any, prevCategory: string | undefined) {
    const answer = window.confirm("Do you want to delete it?");
    if (answer) {
      const deleteAction = {
        category: prevCategory,
        book: book,
      };
      dispatch(removeDownload(deleteAction));
    }
  }

  function onSelect(event: any) {
    // undefined means this book is from the search result
    const prevCategory: string | undefined =
      book.shelf === undefined ? undefined : book.shelf;
    const currCategory: string = event.currentTarget.value;

    if (CATEGORIES.includes(event.target.value)) {
      moveBook(book, prevCategory, currCategory);
    } else if (currCategory === DELETE) {
      deleteBook(book, prevCategory);
    }
  }

  useEffect(() => {
    // Set the default visibility of all checkmarks
    function setBookVisibility() {
      const checkElement = document.getElementById(
        CHECKMARK_ID
      ) as HTMLImageElement;
      checkElement.style.visibility = "visible";
    }

    // Set the default selected option of all the dropdown menus
    function setDefaultBookStatus() {
      const elem = document.getElementById(book.id) as HTMLSelectElement;
      const index = book.shelf
        ? CATEGORIES.indexOf(book.shelf) + 1
        : NONE_OPTION_INDEX;
      elem.options.selectedIndex = index;

      if (onSearchPage && index !== NONE_OPTION_INDEX) {
        setOptionStatus(true);
        setBookVisibility();
      }
    }
    setDefaultBookStatus();
  }, [book.shelf]);

  return (
    <div className="book">
      <div className="book-top">
        <div
          className="book-cover"
          style={{
            width: WIDTH,
            height: HEIGHT,
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
          <select
            onChange={onSelect}
            id={book.id}
            data-isdownloaded={book.isDownloaded}
          >
            <option value="move" disabled>
              Move to...
            </option>
            <option value="currentlyReading" disabled={optionStatus}>
              Currently Reading
            </option>
            <option value="read" disabled={optionStatus}>
              Read
            </option>
            <option value="wantToRead" disabled={optionStatus}>
              Want to Read
            </option>

            {onSearchPage ? (
              <option value="none" disabled>
                None
              </option>
            ) : (
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
