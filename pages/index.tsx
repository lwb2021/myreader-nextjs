import HomeBookListing from "../components/HomeBookListing";
import React, { useEffect } from "react";
import { getAll as getAllBooks } from "./api/BooksAPI";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import {
  displayHomePageBooks,
  switchFirstTimeLoad,
  switchHomeSpinnerVisible,
} from "../store/book/bookSlice";
import type { RootState } from "../store/store";

const HomePage = () => {
  const router = useRouter();
  const { firstTimeLoad, homeSpinnerVisible } = useSelector(
    (state: RootState) => state.book
  );

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
    if (firstTimeLoad) {
      // show spinner
      dispatch(switchHomeSpinnerVisible());
      // switch firstTimeLoad
      dispatch(switchFirstTimeLoad());
      fetchBooks().then(() => {
        // hide spinner
        dispatch(switchHomeSpinnerVisible());
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="app">
      <div className="list-books">
        <div className="list-books-title">
          <h1>MyReads</h1>
        </div>
        <div className="list-books-content">
          <HomeBookListing
            title="Currently Reading"
            spinnerVisible={homeSpinnerVisible}
          />
          <HomeBookListing title="Read" spinnerVisible={homeSpinnerVisible} />
          <HomeBookListing
            title="Want To Read"
            spinnerVisible={homeSpinnerVisible}
          />
        </div>
        <div className="open-search">
          <button onClick={() => router.push("/search")}>Add a book</button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
