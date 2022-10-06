import React, { useState } from "react";
import { search } from "../api/BooksAPI";
import Shelf from "../../components/Shelf";
// import debounce from "lodash";
import { trackPromise } from "react-promise-tracker";
import { SpinnerSearch } from "../../components/Spinner";
import { RESPONSE_KEY_MAP } from "../constants";

interface Props {
  addBook: Function;
  moveBook: Function;
}

const SearchPage = ({ addBook, moveBook }: Props) => {
  const [searchResults, setSearchResults] = useState([]);
  const [blankMsg, setBlankMsg] = useState("");
  const [prevSearchName, setPrevSearchName] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const SEARCH_ERR_MSG = "Please enter a valid search keyword!";
  const BLANK_MSG = "No result found.";

  // function debounce(fn, time, triggerNow) {
  //   var t = null,
  //     res;
  //   var debounced = function() {
  //     var _self = this,
  //       args = arguments;

  //     if (t) {
  //       clearTimeout(t);
  //     }

  //     if (triggerNow) {
  //       var exec = !t;

  //       t = setTimeout(function() {
  //         t = null;
  //       }, time);

  //       if (exec) {
  //         res = fn.apply(_self, args);
  //         console.log(res);
  //       }
  //     } else {
  //       t = setTimeout(function() {
  //         res = fn.apply(_self, args).then((data) => data);
  //       }, time);
  //     }

  //     return res;
  //   };
  //   return debounced;
  // }

  async function searchBook(query: string) {
    const responseKey = RESPONSE_KEY_MAP.searchResponse;
    const searchResultCache = localStorage.getItem(responseKey);
    // Retrieve from cache if the search result exists
    if (searchResultCache && query === prevSearchName) {
      setSearchResults(JSON.parse(searchResultCache));
    } else {
      try {
        // const debouncedSearch = debounce((query) => search(query), 1000);

        // console.log(debounce);
        // const searchResult = debouncedSearch(query);
        // console.log(searchResult);
        setBlankMsg("");
        let searchResult = await search(query);

        if (searchResult.error) {
          setSearchResults([]);
          setBlankMsg(BLANK_MSG);
          return;
        }

        // Display the search result to UI
        setSearchResults(searchResult);

        // Add search result to local storage
        localStorage.setItem(responseKey, JSON.stringify(searchResult));
      } catch (err) {
        console.log(err);
        setSearchResults([]);
        setBlankMsg(BLANK_MSG);
      }
    }
  }

  // Return the title for the search result
  function getTitle(name: string) {
    return name ? `Results of "${name}"` : "";
  }

  // Get the search name from the input
  function getSearchName() {
    return document.getElementById("input")!.value;
  }

  // Handle search
  function handleSearch(event: any) {
    if (event.key === "Enter" || event.type === "click") {
      // Handle empty search keyword
      if (!searchKeyword) {
        alert(SEARCH_ERR_MSG);
        return;
      }

      const searchName = getSearchName();
      setPrevSearchName(searchName);
      trackPromise(searchBook(searchName));
    }
  }

  return (
    <div className="search-books">
      <div className="search-books-bar">
        <button
          className="close-search"
          // onClick={() => {
          //   navigate("/");
          // }}
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
            onKeyDown={handleSearch}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            maxLength={20}
          />
        </div>
        <button onClick={handleSearch}>search</button>
      </div>
      <div className="search-books-results">
        {searchResults.length === 0 ? (
          <div className="bookshelf">
            <h2 className="bookshelf-title">{getTitle(prevSearchName)}</h2>
            <h3>{blankMsg}</h3>
          </div>
        ) : (
          <Shelf
            title={getTitle(prevSearchName)}
            books={searchResults}
            addBook={addBook}
            moveBook={moveBook}
            setSearchResults={setSearchResults}
            onSearchPage={true}
          />
        )}
        <SpinnerSearch />
      </div>
    </div>
  );
};

export default SearchPage;
