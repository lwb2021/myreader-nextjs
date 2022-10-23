import React, { useState, useEffect, useRef } from "react";
import { search } from "./api/BooksAPI";
import SearchBookListing from "../components/SearchBookListing";

import { useRouter } from "next/router";
import {
  clearSearchedBooks,
  displaySearchPageBooks,
  switchSearchSpinnerVisible,
} from "../store/book/bookSlice";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";
import { Spinner } from "../components/Spinner";
import type { RootState } from "../store/store";

const SearchPage = () => {
  const router = useRouter();
  const [blankMsg, setBlankMsg] = useState("");
  const BLANK_MSG = "No result found.";
  const { searchSpinnerVisible } = useSelector(
    (state: RootState) => state.book
  );

  const dispatch = useDispatch();

  function checkLocalStorage(query: string) {
    let searchMap = new Map(
      JSON.parse(localStorage.getItem("searchMap") || "[]")
    );
    if (searchMap.has(query)) {
      return JSON.parse(searchMap.get(query) as string);
    } else {
      return null;
    }
  }

  function updateLocalStorage(query: string, response: string) {
    let searchMap = localStorage.getItem("searchMap")
      ? new Map(JSON.parse(localStorage.getItem("searchMap") || "[]"))
      : new Map();

    // Check size
    const size = Array.from(searchMap.entries()).length;
    if (size >= 10) {
      const key = Array.from(searchMap.entries())[0][0];
      searchMap.delete(key);
    }

    searchMap.set(query, JSON.stringify(response));
    localStorage.setItem(
      "searchMap",
      JSON.stringify(Array.from(searchMap.entries()))
    );
  }

  const debouncedSearch = useRef(
    debounce(async (query: string) => {
      // Clear the previous result
      dispatch(clearSearchedBooks());

      setBlankMsg("");

      // Handle emtpy search
      if (!query) {
        return;
      }

      // Show spinner
      dispatch(switchSearchSpinnerVisible());

      try {
        let response = checkLocalStorage(query);
        if (!response) {
          response = await search(query);
        }

        // Handle no search result
        if (response.error) {
          setBlankMsg(BLANK_MSG);
        } else {
          updateLocalStorage(query, response);
          const action = {
            query: query,
            response: response,
          };
          dispatch(displaySearchPageBooks(action));
        }
      } catch (err) {
        console.log(err);
      }
      // Hide spinner
      dispatch(switchSearchSpinnerVisible());
    }, 200)
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
          <Spinner spinnerVisible={searchSpinnerVisible} />
          <SearchBookListing />
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
