import React, { useEffect, useState } from "react";
import { RESPONSE_KEY_MAP, CATEGORIES, BOOKSET } from "../pages/constants";
import Image from "next/image";
import { moveTo, removeFrom } from "../store/book/bookSlice";
import { useSelector, useDispatch } from "react-redux";

interface Props {
  title?: string;
  book: any;
  shelfIndex: number;
  addBook: Function;
  moveBook: Function;
  setSearchResults: Function;
  onSearchPage: boolean;
}

const Book = ({ book, shelfIndex, addBook, moveBook, onSearchPage }: Props) => {
  const WIDTH = 128;
  const HEIGHT = 193;
  const DELETE = "delete";
  const NONE_OPTION_INDEX = 4;
  const CHECKMARK_ID = `checkmark_${book.id}`;
  const [optionStatus, setOptionStatus] = useState(false);
  const dispatch = useDispatch();

  // Set a book's visibility
  function markBookVisibility(checkID: string, visible = true) {
    const checkmark = document.getElementById(checkID);
    checkmark!.style.visibility = visible ? "visible" : "hidden";
  }

  function setLocalStorage(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  function onSelect(event: any) {
    // undefined means this book is from the search result
    const prevCategory: string | undefined =
      book.shelf === undefined ? undefined : book.shelf;
    const currCategory: string = event.currentTarget.value;
    if (event.target.value in CATEGORIES) {
      const removeAction = {
        category: prevCategory,
        book: book,
      };
      dispatch(removeFrom(removeAction));

      const newBook = Object.assign({}, book, { shelf: currCategory });
      const moveAction = {
        category: currCategory,
        book: newBook,
      };
      dispatch(moveTo(moveAction));
    } else if (currCategory === DELETE) {
      // delete the book
      const answer = window.confirm("Do you want to delete it?");
      if (answer) {
        const removeAction = {
          category: prevCategory,
          book: book,
        };
        console.log(removeAction);
        dispatch(removeFrom(removeAction));
        // Remove the book from the bookSet
        // const bookSetArr = localStorage
        //   .getItem(BOOKSET)!
        //   .split(",")
        //   .filter((item) => item !== book.id);
        // setLocalStorage(BOOKSET, bookSetArr.join(","));
        // Remove the book from the downloaded cache
        // const downloadedCache = new Map(
        //   JSON.parse(localStorage.getItem(RESPONSE_KEY_MAP.downloadedResponse)!)
        // );
        // for (let pair of downloadedCache) {
        //   if (pair[0] === book.id) {
        //     downloadedCache.delete(pair[0]);
        //   }
        // }
        // setLocalStorage(
        //   RESPONSE_KEY_MAP.downloadedResponse,
        //   JSON.stringify(Array.from(downloadedCache.entries()))
        // );
        // Mark the book as unchecked
        // markBookVisibility(CHECKMARK_ID, false);
      }
    } else if (currCategory !== prevCategory) {
      // initialize the cache for downloaded books
      let downloadedCache = new Map();
      if (!localStorage.getItem(RESPONSE_KEY_MAP.downloadedResponse))
        setLocalStorage(
          RESPONSE_KEY_MAP.downloadedResponse,
          JSON.stringify(Array.from(downloadedCache.entries()))
        );
      else {
        downloadedCache = new Map(
          JSON.parse(localStorage.getItem(RESPONSE_KEY_MAP.downloadedResponse)!)
        );
      }

      downloadedCache.set(book.id, currCategory);

      setLocalStorage(
        RESPONSE_KEY_MAP.downloadedResponse,
        JSON.stringify(Array.from(downloadedCache.entries()))
      );

      // Record the downloaded book
      if (!prevCategory) {
        addBook(book);

        // Mark the book as checked
        markBookVisibility(CHECKMARK_ID, true);
      }
    }
    // Change the dropdown menu's status
    // changeDropdownStatus(book, currCategory);
  }

  function changeDropdownStatus(book: any, currCategory: string) {
    // Change the book's dropdown menu
    const elem = document.getElementById(book.id) as HTMLSelectElement;
    // Plus 1 since the index 0 of the dropdown is a disabled option
    elem.options.selectedIndex =
      currCategory === DELETE
        ? NONE_OPTION_INDEX
        : CATEGORIES.indexOf(currCategory) + 1;
    if (currCategory === DELETE) {
      setOptionStatus(false);
    } else setOptionStatus(true);
  }

  useEffect(() => {
    // Set the default selected option of all the dropdown menus
    (function setDefaultSelected() {
      const elem = document.getElementById(book.id) as HTMLSelectElement;
      // Plus 1 since the index 0 of the dropdown is a disabled option
      const index = onSearchPage ? NONE_OPTION_INDEX : shelfIndex + 1;
      if (elem) elem.options.selectedIndex = index;
    })();

    // Set the default visibility of all checkmarks
    (function setCheckmarkVisibility() {
      const checkElement = document.getElementById(
        CHECKMARK_ID
      ) as HTMLImageElement;
      const downloadedCache = new Map<string, string>(
        JSON.parse(localStorage.getItem(RESPONSE_KEY_MAP.downloadedResponse)!)
      );

      // Mark the book as downloaded
      if (downloadedCache && downloadedCache.has(book.id) && onSearchPage) {
        checkElement.style.visibility = "visible";
      }

      // Label the category for the downloaded book
      if (onSearchPage && downloadedCache.has(book.id)) {
        const elem = document.getElementById(book.id) as HTMLSelectElement;
        elem.options.selectedIndex =
          CATEGORIES.indexOf(downloadedCache.get(book.id)!) + 1;
        setOptionStatus(true);
      }
    })();
  }, []);

  return (
    <div className="book">
      <div className="book-top">
        <div
          className="book-cover"
          style={{
            width: WIDTH,
            height: HEIGHT,
            backgroundImage:
              `${book.imageLinks}` !== "undefined"
                ? `url("${book.imageLinks.thumbnail}")`
                : `url(undefined)`,
          }}
        ></div>
        <Image
          id={`checkmark_${book.id}`}
          className="checkmark"
          alt="checkmark"
          src="/checkmark.jpeg"
          layout="fill"
        />
        <div className="book-shelf-changer">
          <select onChange={onSelect} id={book.id}>
            <option value="move" disabled>
              Move to...
            </option>
            <option value="currentlyReading" disabled={optionStatus}>
              Currently Reading
            </option>
            <option value="read" disabled={optionStatus}>
              Read
            </option>
            <option value="wantToRead" disabled={optionStatus}>
              Want to Read
            </option>
            {onSearchPage ? (
              <option value="none" disabled>
                None
              </option>
            ) : (
              <option value="delete">Delete</option>
            )}
          </select>
        </div>
      </div>
      <div className="book-title">{book.title}</div>
      <div className="book-authors">{book.authors}</div>
    </div>
  );
};

export default Book;
