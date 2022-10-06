import "../styles/App.css";
import "../styles/spinner.css";
import React, { useState } from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
import { useRouter } from "next/router";
// import Link from "next/link";

import SearchPage from "./search";
import MainPage from "./MainPage";
import { RESPONSE_KEY_MAP, CATEGORIES, BOOKSET } from "./constants";

const BooksApp = () => {
  const router = useRouter();
  let [currentlyReadBooks, setCurrentlyReadBooks] = useState<string[]>([]);
  let [readBooks, setReadBooks] = useState<string[]>([]);
  let [wantToReadBooks, setWantToReadBooks] = useState<string[]>([]);

  // Pass the props to child components in bulk
  const multipleProps = {
    moveBook,
    addBook,
    currentlyReadBooks,
    setCurrentlyReadBooks,
    readBooks,
    setReadBooks,
    wantToReadBooks,
    setWantToReadBooks,
  };

  function moveBook(book: any, prevCategory: string, currCategory: string) {
    /* 
    - Remove the book from the old shelf
    - prevCategory is undefined when it is from the search result
     */

    book.shelf = currCategory;

    if (prevCategory === CATEGORIES[0]) {
      currentlyReadBooks = currentlyReadBooks.filter(
        (item: any) => item.id !== book.id
      );
      setCurrentlyReadBooks(currentlyReadBooks);
    } else if (prevCategory === CATEGORIES[1]) {
      readBooks = readBooks.filter((item: any) => item.id !== book.id);
      setReadBooks(readBooks);
    } else if (prevCategory === CATEGORIES[2]) {
      wantToReadBooks = wantToReadBooks.filter(
        (item: any) => item.id !== book.id
      );
      setWantToReadBooks(wantToReadBooks);
    }

    // Move the book to the new shelf or delete it
    if (currCategory === CATEGORIES[0]) {
      currentlyReadBooks.push(book);
      setCurrentlyReadBooks(currentlyReadBooks);
    } else if (currCategory === CATEGORIES[1]) {
      readBooks.push(book);
      setReadBooks(readBooks);
    } else if (currCategory === CATEGORIES[2]) {
      wantToReadBooks.push(book);
      setWantToReadBooks(wantToReadBooks);
    } else {
      // delete the book and reset its category
      book.shelf = undefined;
    }

    // Save the most updated shelves' information to the local storage
    const booksInfo = Array.prototype.concat(
      currentlyReadBooks,
      readBooks,
      wantToReadBooks
    );

    const responseKey = RESPONSE_KEY_MAP.fetchResponse;
    localStorage.setItem(responseKey, JSON.stringify(booksInfo));
  }

  // Record all the downloaded books
  function addBook(book: any) {
    // initialize the search book result
    if (!localStorage.getItem(BOOKSET)) localStorage.setItem(BOOKSET, "");
    const bookSet = new Set(localStorage.getItem(BOOKSET)!.split(","));
    bookSet.add(book.id);
    const bookSetArr = [...bookSet];
    localStorage.setItem(BOOKSET, bookSetArr.join(","));
  }

  return (
    <div className="app">
      {/* <Link href="/" element={MainPage(multipleProps)} />
      <Link href="/search" element={SearchPage(multipleProps)} /> */}
      {/* <Link path="/*" element={<Navigate to="/" />} /> */}
    </div>
  );
};

export default BooksApp;
