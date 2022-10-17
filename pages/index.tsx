import HomeBookListing from "../components/HomeBookListing";
import React, { useEffect } from "react";
import {
  getAll as getAllBooks,
  update as updateBook,
  get as getBook,
} from "./api/BooksAPI";
import { trackPromise } from "react-promise-tracker";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store/store";
import { moveBooks, switchMode } from "../store/book/bookSlice";

const HomePage = () => {
  const router = useRouter();
  const { firstTimeLoad } = useSelector((state: RootState) => state.book);
  const titlesArray = ["Currently Reading", "Read", "Want To Read"];

  const dispatch = useDispatch();
  useEffect(() => {
    function displayBooks(response: Array<any>) {
      const action = {
        response: response,
      };
      dispatch(moveBooks(action));
    }

    async function fetchBooks() {
      try {
        const response = await getAllBooks();
        console.log(response);
        // response = await updateBook(response[0], "wantToRead");
        // // response = await getAllBooks();
        // console.log(response.currentlyReading);
        // let book = await getBook(response.currentlyReading[0]);
        // console.log(book);
        displayBooks(response);
      } catch (err) {
        console.log(err);
      }
    }

    if (firstTimeLoad) {
      trackPromise(fetchBooks());
    }

    dispatch(switchMode());
  });

  return (
    <div className="app">
      <div className="list-books">
        <div className="list-books-title">
          <h1>MyReads</h1>
        </div>
        <div className="list-books-content">
          <HomeBookListing titlesArray={titlesArray} />
        </div>
        <div className="open-search">
          <button onClick={() => router.push("/search")}>Add a book</button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
