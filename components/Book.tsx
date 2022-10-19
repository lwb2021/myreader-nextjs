import React, { useEffect, useState } from "react";
import { CATEGORIES } from "../utils/constants";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import type { AppDispatch, RootState } from "../store/store";
import { displayBooks, move } from "../store/book/bookSlice";
import { current } from "@reduxjs/toolkit";
import {
  getAll as getAllBooks,
  update as updateBook,
  get as getBook,
} from "../pages/api/BooksAPI";

export interface BookProps {
  id: string;
  isDownloaded: Boolean;
  shelf: string;
  imageLinks: {
    thumbnail: string;
  };
  title: string;
  authors: string[];
}

const Book = (book: BookProps) => {
  const CATEGORIES_LENGTH = CATEGORIES.length;
  const dispatch = useDispatch<any>();
  const router = useRouter();

  async function onSelect(event: any) {
    // Update the book
    const moveAction = {
      book: book,
      shelf: event.currentTarget.value,
    };
    await dispatch(move(moveAction));

    // Get and display the most recent book listing information
    const response = await getAllBooks();
    const action = {
      response: response,
    };
    dispatch(displayBooks(action));
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
