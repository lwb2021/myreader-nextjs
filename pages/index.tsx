import HomeBookListing from "../components/HomeBookListing";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  getHomePageBooks,
  switchReloadOn,
  switchReloadOff,
  switchFirstTimeLoad,
} from "../store/book/bookSlice";

const HomePage = () => {
  const router = useRouter();
  const { firstTimeLoad, isPageReloaded } = useAppSelector(
    (state) => state.book
  );
  const [getAllBooksLoading, setGetAllBooksLoading] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    // Switch on isPageReloaded so that next refresh will trigger get-all-books API
    window.addEventListener("beforeunload", () => {
      dispatch(switchReloadOn());
    });

    console.log(firstTimeLoad, isPageReloaded);
    if (firstTimeLoad || isPageReloaded) {
      if (firstTimeLoad) {
        // Show spinner at first time load
        setGetAllBooksLoading(true);
      }

      // switch reload off
      dispatch(switchReloadOff());

      // Get all home page books
      dispatch(getHomePageBooks())
        .unwrap()
        .then(() => {
          if (firstTimeLoad) {
            // hide spinner
            setGetAllBooksLoading(false);

            // switch firstTimeLoad off
            dispatch(switchFirstTimeLoad());
          }
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
            getAllBooksLoading={getAllBooksLoading}
          />
          <HomeBookListing
            title="Read"
            getAllBooksLoading={getAllBooksLoading}
          />
          <HomeBookListing
            title="Want To Read"
            getAllBooksLoading={getAllBooksLoading}
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
