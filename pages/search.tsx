import React, { useState, useEffect, useRef } from "react";
import { search } from "./api/BooksAPI";
import SearchBookListing from "../components/SearchBookListing";

import { useRouter } from "next/router";
import {
  clearSearchedBooks,
  displaySearchPageBooks,
} from "../store/book/bookSlice";
import { useDispatch } from "react-redux";
import { debounce } from "lodash";
import { Spinner } from "../components/Spinner";

const SearchPage = () => {
  const router = useRouter();
  const [blankMsg, setBlankMsg] = useState("");
  const [spinnerVisible, setSpinnerVisible] = useState(false);
  const BLANK_MSG = "No result found.";

  const dispatch = useDispatch();

  const debouncedSearch = useRef(
    debounce(async (query: string) => {
      setSpinnerVisible(true);
      try {
        // Clear the previous result
        setBlankMsg("");
        dispatch(clearSearchedBooks());
        const response = await search(query);
        const action = {
          response: response,
        };
        dispatch(displaySearchPageBooks(action));
      } catch (err) {
        // Leave it blank if the search query is empty
        if (query) setBlankMsg(BLANK_MSG);
        console.log(err);
      }
      setSpinnerVisible(false);
    }, 500)
  ).current;

  useEffect(() => {
    // Clear the previous result
    setBlankMsg("");
    dispatch(clearSearchedBooks());

    return () => {
      debouncedSearch.cancel();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Get the search name from the input
  function getSearchName() {
    return (document.getElementById("input") as HTMLInputElement).value;
  }

  // Handle search
  function handleSearch() {
    const searchName = getSearchName();
    debouncedSearch(searchName);
  }

  return (
    <div className="search-books">
      <div className="search-books-bar">
        <button
          className="close-search"
          onClick={() => {
            router.push("/");
          }}
        >
          Close
        </button>
        <div className="search-books-input-wrapper">
          {/*
            NOTES: The search from BooksAPI is limited to a particular set of search terms.
            You can find these search terms here:
            https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

            However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
            you don't find a specific author or title. Every search is limited by search terms.
          */}
          <input
            type="text"
            id="input"
            placeholder="Search by title or author"
            onChange={handleSearch}
            maxLength={30}
          />
        </div>
      </div>
      <div className="search-books-results">
        <div className="bookshelf">
          <h3>{blankMsg}</h3>
          <SearchBookListing />
          <Spinner spinnerVisible={spinnerVisible} />
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
