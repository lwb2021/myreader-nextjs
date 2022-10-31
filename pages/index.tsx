import HomeBookListing from "../components/HomeBookListing";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getHomePageBooks } from "../store/book/bookSlice";

const HomePage = () => {
  const router = useRouter();
  const { currentlyReading, read, wantToRead } = useAppSelector(
    (state) => state.book
  );
  const [getAllBooksLoading, setGetAllBooksLoading] = useState(false);
  const [hasCache, setHasCache] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    // Retrieve books from Redux Persist
    const persistedBooks = currentlyReading.concat(read, wantToRead);
    if (persistedBooks.length) {
      setHasCache(true);
    }
    // Show spinner
    setGetAllBooksLoading(true);
    // Get all home page books
    dispatch(getHomePageBooks())
      .unwrap()
      .then(() => {
        // Hide spinner
        setGetAllBooksLoading(false);
      });

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
            getAllBooksLoading={getAllBooksLoading && !hasCache}
          />
          <HomeBookListing
            title="Read"
            getAllBooksLoading={getAllBooksLoading && !hasCache}
          />
          <HomeBookListing
            title="Want To Read"
            getAllBooksLoading={getAllBooksLoading && !hasCache}
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
