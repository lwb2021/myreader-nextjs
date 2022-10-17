import React, { useState, useEffect, useRef } from "react";
import { search } from "./api/BooksAPI";
import SearchBookListing from "../components/SearchBookListing";

import { useRouter } from "next/router";
import { clearSearchedBooks, addToSearchPage } from "../store/book/bookSlice";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store/store";
import { debounce } from "lodash";

const SearchPage = () => {
  const router = useRouter();
  const [blankMsg, setBlankMsg] = useState("");
  const BLANK_MSG = "No result found.";

  const dispatch = useDispatch();

  let { searchedBooks } = useSelector((state: RootState) => state.book);

  const debouncedSearch = useRef(
    debounce(async (query: string) => {
      try {
        // Clear the previous result
        setBlankMsg("");
        dispatch(clearSearchedBooks());

        const response = await search(query);
        for (const BookType of response) {
          const action = {
            category: undefined,
            // Initialize the book download status
            book: BookType,
          };
          dispatch(addToSearchPage(action));
        }
      } catch (err) {
        if (query) setBlankMsg(BLANK_MSG);
        console.log(err);
      }
    }, 500)
  ).current;

  useEffect(() => {
    // Clear the previous result
    setBlankMsg("");
    dispatch(clearSearchedBooks());
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch, dispatch]);

  // Return the title for the search result
  function getTitle(name: string) {
    return name ? `Results of "${name}"` : "";
  }

  // Get the search name from the input
  function getSearchName() {
    return (document.getElementById("input") as HTMLInputElement).value;
  }

  // Handle search
  function handleSearch(event: any) {
    // if (event.key === "Enter" || event.type === "click") {
    // // Handle empty search keyword
    // if (!searchKeyword) {
    //   alert("Please enter a valid search keyword!");
    //   return;
    // }

    const searchName = getSearchName();
    // setSearchKeyword(searchName);
    debouncedSearch(searchName);

    // const searchWordAction = {
    //   searchName: searchName,
    // };
    // dispatch(markPrevSearch(searchWordAction));
    // trackPromise(debouncedSearch(searchName));
    // debouncedSearch(searchName);
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
            // onKeyDown={handleSearch}
            // value=''
            onChange={handleSearch}
            maxLength={30}
          />
        </div>
      </div>
      <div className="search-books-results">
        <div className="bookshelf">
          <h3>{blankMsg}</h3>
          <SearchBookListing books={searchedBooks} />
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
