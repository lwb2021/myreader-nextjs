import HomeBookListing from "../components/HomeBookListing";
import React, { useEffect, useState } from "react";
import { getAll as getAllBooks } from "./api/BooksAPI";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { displayHomePageBooks } from "../store/book/bookSlice";

const HomePage = () => {
  const router = useRouter();
  const [spinnerVisible, setSpinnerVisible] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    async function fetchBooks() {
      setSpinnerVisible(true);
      try {
        const response = await getAllBooks();
        const action = {
          response: response,
        };
        dispatch(displayHomePageBooks(action));
      } catch (err) {
        console.log(err);
      }
      setSpinnerVisible(false);
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
          <HomeBookListing
            title="Currently Reading"
            spinnerVisible={spinnerVisible}
          />
          <HomeBookListing title="Read" spinnerVisible={spinnerVisible} />
          <HomeBookListing
            title="Want To Read"
            spinnerVisible={spinnerVisible}
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
