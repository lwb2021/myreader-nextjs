import { createSlice, current } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { CATEGORIES } from "../../utils/constants";

export interface BookType {
  id: string;
  isDownloaded: Boolean;
  shelf: string;
  imageLinks: {
    thumbnail: string;
  };
  title: string;
  authors: string[];
}

export interface BookState {
  currentlyReadBooks: BookType[];
  readBooks: BookType[];
  wantToReadBooks: BookType[];
  searchedBooks: BookType[];
  prevSearchWord: string;
  firstTimeLoad: Boolean;
}

const initialState: BookState = {
  currentlyReadBooks: [],
  readBooks: [],
  wantToReadBooks: [],
  searchedBooks: [],
  prevSearchWord: "",
  firstTimeLoad: true,
};

const IS_DOWNLOADED = "isDownloaded";

export const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {
    moveBooks: (state = initialState, action: PayloadAction<any>) => {
      const { response } = action.payload;
      for (const bookObject of response) {
        const book = bookObject;
        const category = bookObject.shelf;
        // Mark the book as downloaded if it is from the search page
        let searchedIndex = -1;
        if (book.hasOwnProperty(IS_DOWNLOADED)) {
          state.searchedBooks = state.searchedBooks.map((item, idx) => {
            if (item.id === book.id) {
              searchedIndex = idx;
              return Object.assign({}, current(state).searchedBooks[idx], {
                isDownloaded: true,
                shelf: category,
              });
            } else {
              return item;
            }
          });
        }

        // If it is to download a book, get the book object from the searchBooks
        // array and then add it to the shelf
        const bookToAdd = book.hasOwnProperty(IS_DOWNLOADED)
          ? current(state).searchedBooks[searchedIndex]
          : Object.assign({}, book, { shelf: category });

        // currently reading
        if (category === CATEGORIES[0]) {
          state.currentlyReadBooks.push(bookToAdd);
        }
        // read
        else if (category === CATEGORIES[1]) {
          state.readBooks.push(bookToAdd);
        }
        // want to read
        else if (category === CATEGORIES[2]) {
          state.wantToReadBooks.push(bookToAdd);
        }
      }
    },
    moveTo: (state = initialState, action: PayloadAction<any>) => {
      const { book, category } = action.payload;

      // Mark the book as downloaded if it is from the search page
      let searchedIndex = -1;
      if (book.hasOwnProperty(IS_DOWNLOADED)) {
        state.searchedBooks = state.searchedBooks.map((item, idx) => {
          if (item.id === book.id) {
            searchedIndex = idx;
            return Object.assign({}, current(state).searchedBooks[idx], {
              isDownloaded: true,
              shelf: category,
            });
          } else {
            return item;
          }
        });
      }

      // If it is to download a book, get the book object from the searchBooks
      // array and then add it to the shelf
      const bookToAdd = book.hasOwnProperty(IS_DOWNLOADED)
        ? current(state).searchedBooks[searchedIndex]
        : Object.assign({}, book, { shelf: category });

      // currently reading
      if (category === CATEGORIES[0]) {
        state.currentlyReadBooks.push(bookToAdd);
      }
      // read
      else if (category === CATEGORIES[1]) {
        state.readBooks.push(bookToAdd);
      }
      // want to read
      else if (category === CATEGORIES[2]) {
        state.wantToReadBooks.push(bookToAdd);
      }
    },
    addToSearchPage: (state = initialState, action: PayloadAction<any>) => {
      const { book } = action.payload;
      const combinedArray = [
        ...current(state).currentlyReadBooks,
        ...current(state).readBooks,
        ...current(state).wantToReadBooks,
      ];

      // Check if the book is already downloaded
      const index = combinedArray.findIndex((item) => item.id === book.id);

      // First time downloaded
      if (index === -1) {
        book.isDownloaded = false;
        state.searchedBooks.push(book);
        // Book is already downloaded
      } else {
        state.searchedBooks.push(combinedArray[index]);
      }
    },
    clearSearchedBooks: (state = initialState) => {
      state.searchedBooks = [];
    },
    removeDownload: (state = initialState, action: PayloadAction<any>) => {
      const { book, category } = action.payload;
      // Delete the downloaded book from the shelf
      // currently reading
      if (category === CATEGORIES[0]) {
        state.currentlyReadBooks = state.currentlyReadBooks.filter(
          (item: BookType) => item.id !== book.id
        );
      }
      // read
      else if (category === CATEGORIES[1]) {
        state.readBooks = state.readBooks.filter(
          (item: BookType) => item.id !== book.id
        );
      }
      // want to read
      else if (category === CATEGORIES[2]) {
        state.wantToReadBooks = state.wantToReadBooks.filter(
          (item: BookType) => item.id !== book.id
        );
      }

      // Reset the book's 'isDownloaded' and 'shelf' properties
      state.searchedBooks = state.searchedBooks.map((item, idx) => {
        if (item.id === book.id) {
          return Object.assign({}, current(state).searchedBooks[idx], {
            isDownloaded: false,
            shelf: undefined,
          });
        } else {
          return item;
        }
      });
    },
    removeFrom: (state = initialState, action: PayloadAction<any>) => {
      const { book, category } = action.payload;

      // currently reading
      if (category === CATEGORIES[0]) {
        state.currentlyReadBooks = state.currentlyReadBooks.filter(
          (item: BookType) => item.id !== book.id
        );
      }
      // read
      else if (category === CATEGORIES[1]) {
        state.readBooks = state.readBooks.filter(
          (item: BookType) => item.id !== book.id
        );
      }
      // want to read
      else if (category === CATEGORIES[2]) {
        state.wantToReadBooks = state.wantToReadBooks.filter(
          (item: BookType) => item.id !== book.id
        );
      }
    },
    markPrevSearch: (state = initialState, action: PayloadAction<any>) => {
      state.prevSearchWord = action.payload.searchName;
    },
    switchMode: (state = initialState) => {
      state.firstTimeLoad = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  removeDownload,
  moveTo,
  moveBooks,
  removeFrom,
  clearSearchedBooks,
  addToSearchPage,
  markPrevSearch,
  switchMode,
} = bookSlice.actions;

export default bookSlice.reducer;
