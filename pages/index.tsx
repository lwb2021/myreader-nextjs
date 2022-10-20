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
import { displayHomePageBooks } from "../store/book/bookSlice";

const HomePage = () => {
  const router = useRouter();

  const dispatch = useDispatch();
  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await getAllBooks();
        const action = {
          response: response,
        };
        dispatch(displayHomePageBooks(action));
      } catch (err) {
        console.log(err);
      }
    }

    fetchBooks();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="app">
      <div className="list-books">
        <div className="list-books-title">
          <h1>MyReads</h1>
        </div>
        <div className="list-books-content">
          <HomeBookListing title="Currently Reading" />
          <HomeBookListing title="Read" />
          <HomeBookListing title="Want To Read" />
        </div>
        <div className="open-search">
          <button onClick={() => router.push("/search")}>Add a book</button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
