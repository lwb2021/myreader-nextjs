import React, { useState, useEffect, useRef } from "react";
import { searchBook } from "./api/BooksAPI";
import SearchBookListing from "../components/SearchBookListing";

import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { debounce } from "lodash";
import type { RootState } from "../store/store";
import { BookProps } from "../components/Book";

const SearchPage = () => {
  const router = useRouter();
  const urlQuery = location.search.slice(1);
  const urlKeyword = urlQuery.split("=")[1];
  const [blankMsg, setBlankMsg] = useState("");
  const [keyword, setKeyword] = useState(urlKeyword ? urlKeyword : "");
  const [searchedBooks, setSearchedBooks] = useState<BookProps[]>([]);
  const [getAllBooksLoading, setGetAllBooksLoading] = useState(false);
  const BLANK_MSG = "No result found.";
  const SEARCHMAP_NAME = "searchMap";
  const { currentlyReading, read, wantToRead } = useSelector(
    (state: RootState) => state.book
  );

  function markSearchedBooksVisibility(response: BookProps[]) {
    const searchedBooks: BookProps[] = [];
    const combinedArray = [...currentlyReading, ...read, ...wantToRead];
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
      JSON.parse(localStorage.getItem(SEARCHMAP_NAME) || "[]")
    );
    if (!searchMap.has(keyword)) {
      return null;
    } else {
      return JSON.parse(searchMap.get(keyword) as string);
    }
  }

  function updateLocalStorage(keyword: string, response: string) {
    let searchMap = localStorage.getItem(SEARCHMAP_NAME)
      ? new Map(JSON.parse(localStorage.getItem(SEARCHMAP_NAME) || "[]"))
      : new Map();

    searchMap.set(keyword, JSON.stringify(response));

    // Check size
    const size = Array.from(searchMap.entries()).length;
    if (size > 10) {
      const key = Array.from(searchMap.entries())[0][0];
      searchMap.delete(key);
    }

    localStorage.setItem(
      SEARCHMAP_NAME,
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

      const storedBooks = checkLocalStorage(keyword);

      try {
        if (storedBooks) {
          // Display the books stored in the localStorage
          setSearchedBooks(storedBooks);
        } else {
          // Show spinner as it will make a request to the server
          setGetAllBooksLoading((prevState) => !prevState);
        }

        const response = await searchBook(keyword);
        if (response.error) {
          setBlankMsg(BLANK_MSG);
          setGetAllBooksLoading((prevState) => !prevState);
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
      if (!storedBooks) setGetAllBooksLoading((prevState) => !prevState);
    }, 500)
  ).current;

  useEffect(() => {
    // Put the keyword in the url
    if (keyword) router.push(`?q=${keyword}`);
    debouncedSearch(keyword);
    return () => {
      debouncedSearch.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, router.asPath]);

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
            getAllBooksLoading={getAllBooksLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
