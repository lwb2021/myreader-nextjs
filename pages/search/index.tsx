import React, { useState } from "react";
import { search } from "../api/BooksAPI";
import Shelf from "../../components/Shelf";
// import debounce from "lodash";
import { trackPromise } from "react-promise-tracker";
import { SpinnerSearch } from "../../components/Spinner";
import { useRouter } from "next/router";
import {
  clearSearchedBooks,
  addToSearchPage,
  markPrevSearch,
} from "../../store/book/bookSlice";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store/store";

interface Props {
  addBook: Function;
  moveBook: Function;
}

const SearchPage = ({ addBook }: Props) => {
  const router = useRouter();
  const [searchKeyword, setSearchKeyword] = useState("");
  const SEARCH_ERR_MSG = "Please enter a valid search keyword!";
  const BLANK_MSG = "No result found.";
  const dispatch = useDispatch();
  let searchedBooks = useSelector(
    (state: RootState) => state.book.searchedBooks
  );
  let prevSearchWord = useSelector(
    (state: RootState) => state.book.prevSearchWord
  );
  let isSearchDone = true;

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
    try {
      // setBlankMsg("");

      // Clear the search result
      dispatch(clearSearchedBooks());

      let response = await search(query);

      for (const bookObject of response) {
        const action = {
          category: undefined,
          // Initialize the book download status
          book: bookObject,
        };
        dispatch(addToSearchPage(action));
      }
    } catch (err) {
      console.log(err);

      // setBlankMsg(BLANK_MSG);
    }
  }

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
    if (event.key === "Enter" || event.type === "click") {
      // Handle empty search keyword
      if (!searchKeyword) {
        alert(SEARCH_ERR_MSG);
        return;
      }

      const searchName = getSearchName();
      // setSearchKeyword(searchName);
      // setTitle(searchName);

      const searchWordAction = {
        searchName: searchName,
      };
      dispatch(markPrevSearch(searchWordAction));
      trackPromise(searchBook(searchName));
    }
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
            onKeyDown={handleSearch}
            value={searchKeyword ? searchKeyword : prevSearchWord}
            onChange={(e) => setSearchKeyword(e.target.value)}
            maxLength={20}
          />
        </div>
        <button onClick={handleSearch}>search</button>
      </div>
      <div className="search-books-results">
        {searchedBooks.length === 0 ? (
          <div className="bookshelf">
            <h2 className="bookshelf-title">{getTitle(prevSearchWord)}</h2>
            {/* <h3>{prevSearchWord ? BLANK_MSG : ""}</h3> */}
          </div>
        ) : (
          <Shelf
            title={getTitle(prevSearchWord)}
            books={searchedBooks}
            addBook={addBook}
            // TODO: fix it
            shelfIndex={-1}
            onSearchPage={true}
          />
        )}
        <SpinnerSearch />
      </div>
    </div>
  );
};

export default SearchPage;
