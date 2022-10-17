import React, { useEffect, useState } from "react";
import { CATEGORIES } from "../utils/constants";
import Image from "next/image";
import { moveTo, removeFrom, removeDownload } from "../store/book/bookSlice";
import { useDispatch } from "react-redux";
import { BookType } from "../store/book/bookSlice";
import { useRouter } from "next/router";

export interface BookProps {
  book: BookType;
}

const Book = ({ book }: BookProps) => {
  const CATEGORIES_LENGTH = CATEGORIES.length;
  const dispatch = useDispatch();
  const router = useRouter();

  function moveBook(
    book: BookType,
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
    } else if (currCategory === "delete") {
      deleteBook(book, prevCategory);
    }
  }

  useEffect(() => {
    // Set the default visibility of all checkmarks
    function setBookVisibility() {
      const checkElement = document.getElementById(
        `checkmark_${book.id}`
      ) as HTMLImageElement;
      checkElement.style.visibility = "visible";
    }

    // Set the default selected option of all the dropdown menus
    function setDefaultBookStatus() {
      const elem = document.getElementById(book.id) as HTMLSelectElement;

      // Set it as CATEGORIES_LENGTH so all choices are unselected
      const index = book.shelf
        ? CATEGORIES.indexOf(book.shelf) + 1
        : CATEGORIES_LENGTH;
      elem.options.selectedIndex = index;

      if (router.pathname === "/search" && index !== CATEGORIES_LENGTH) {
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
          <select
            onChange={onSelect}
            id={book.id}
            data-isdownloaded={book.isDownloaded}
          >
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
