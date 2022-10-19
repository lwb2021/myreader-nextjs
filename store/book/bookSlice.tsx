import { createSlice, current, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { CATEGORIES } from "../../utils/constants";
import { update } from "../../pages/api/BooksAPI";

interface newStateProps {
  currentlyReadBooks: BookProps[];
  readBooks: BookProps[];
  wantToReadBooks: BookProps[];
}

export interface BookProps {
  id: string;
  isDownloaded: Boolean;
  shelf: string;
  imageLinks: {
    thumbnail: string;
  };
  title: string;
  authors: string[];
}

export interface BookStateProps {
  currentlyReadBooks: BookProps[];
  readBooks: BookProps[];
  wantToReadBooks: BookProps[];
  searchedBooks: BookProps[];
  prevSearchWord: string;
  firstTimeLoad: Boolean;
}

const initialState: BookStateProps = {
  currentlyReadBooks: [],
  readBooks: [],
  wantToReadBooks: [],
  searchedBooks: [],
  prevSearchWord: "",
  firstTimeLoad: true,
};

export const move = createAsyncThunk("book/move", async (data: any) => {
  const { book, shelf } = data;
  try {
    const response = await update(book, shelf);
    return response;
  } catch (err: any) {
    console.log(err);
  }
});

export const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {
    displayBooks: (state = initialState, action: PayloadAction<any>) => {
      const { response } = action.payload;

      const newState: newStateProps = {
        currentlyReadBooks: [],
        readBooks: [],
        wantToReadBooks: [],
      };

      response.filter((book: BookProps) => {
        const category = book.shelf;
        // currently reading
        if (category === CATEGORIES[0]) {
          newState.currentlyReadBooks.push(book);
        }
        // read
        else if (category === CATEGORIES[1]) {
          newState.readBooks.push(book);
        }
        // want to read
        else if (category === CATEGORIES[2]) {
          newState.wantToReadBooks.push(book);
        }
      });

      Object.assign(state, newState);
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

    markPrevSearch: (state = initialState, action: PayloadAction<any>) => {
      state.prevSearchWord = action.payload.searchName;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  displayBooks,
  clearSearchedBooks,
  addToSearchPage,
  markPrevSearch,
} = bookSlice.actions;

export default bookSlice.reducer;
