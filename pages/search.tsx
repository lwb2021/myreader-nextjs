import React, { useState, useEffect, useRef } from "react";
import { search } from "./api/BooksAPI";
import SearchBookListing from "../components/SearchBookListing";

import { useRouter } from "next/router";
import { switchSearchSpinnerVisible } from "../store/book/bookSlice";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";
import type { RootState } from "../store/store";
import { BookProps } from "../components/Book";

const SearchPage = () => {
  const router = useRouter();
  const [blankMsg, setBlankMsg] = useState("");
  const [keyword, setKeyword] = useState("");
  const [searchedBooks, setSearchedBooks] = useState<BookProps[]>([]);
  const BLANK_MSG = "No result found.";
  const {
    currentlyReadBooks,
    readBooks,
    wantToReadBooks,
    searchSpinnerVisible,
  } = useSelector((state: RootState) => state.book);

  const dispatch = useDispatch();

  function markSearchedBooksVisibility(response: BookProps[]) {
    const searchedBooks: BookProps[] = [];
    const combinedArray = [
      ...currentlyReadBooks,
      ...readBooks,
      ...wantToReadBooks,
    ];
    response.filter((book: BookProps) => {
      const index = combinedArray.findIndex((item) => item.id === book.id);
      if (index === -1) {
        searchedBooks.push(book);
      } else {
        book.shelf = combinedArray[index].shelf;
        searchedBooks.push(book);
      }
    });
    return searchedBooks;
  }

  function checkLocalStorage(keyword: string) {
    let searchMap = new Map(
      JSON.parse(localStorage.getItem("searchMap") || "[]")
    );
    if (!searchMap.has(keyword)) {
      return null;
    } else {
      return JSON.parse(searchMap.get(keyword) as string);
    }
  }

  function updateLocalStorage(keyword: string, response: string) {
    let searchMap = localStorage.getItem("searchMap")
      ? new Map(JSON.parse(localStorage.getItem("searchMap") || "[]"))
      : new Map();

    searchMap.set(keyword, JSON.stringify(response));

    // Check size
    const size = Array.from(searchMap.entries()).length;
    if (size > 10) {
      const key = Array.from(searchMap.entries())[0][0];
      searchMap.delete(key);
    }

    localStorage.setItem(
      "searchMap",
      JSON.stringify(Array.from(searchMap.entries()))
    );
  }

  const debouncedSearch = useRef(
    debounce(async (keyword: string) => {
      // Clear the previous result
      setSearchedBooks([]);
      setBlankMsg("");

      // Handle emtpy search
      if (!keyword) {
        return;
      }

      // Show spinner
      dispatch(switchSearchSpinnerVisible());
      try {
        const storedBooks = checkLocalStorage(keyword);
        if (storedBooks) {
          // Display the books stored in the localStorage
          setSearchedBooks(storedBooks);
        }
        const response = await search(keyword);
        if (response.error) {
          setBlankMsg(BLANK_MSG);
          dispatch(switchSearchSpinnerVisible());
          return;
        }

        // Update localStorage with the most recent response
        updateLocalStorage(keyword, response);

        // Display most updated search result
        setSearchedBooks(markSearchedBooksVisibility(response));
      } catch (err) {
        console.log(err);
      }
      // Hide spinner
      dispatch(switchSearchSpinnerVisible());
    }, 200)
  ).current;

  useEffect(() => {
    debouncedSearch(keyword);
    return () => {
      debouncedSearch.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword]);

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
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            maxLength={30}
          />
        </div>
      </div>
      <div className="search-books-results">
        <div className="bookshelf">
          <h3>{blankMsg}</h3>
          <SearchBookListing
            books={searchedBooks}
            spinnerVisible={searchSpinnerVisible}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
