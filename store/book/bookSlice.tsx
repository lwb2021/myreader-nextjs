import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { CATEGORIES } from "../../utils/constants";
import { update } from "../../pages/api/BooksAPI";
import { BookProps } from "../../components/Book";

interface newStateProps {
  currentlyReadBooks: BookProps[];
  readBooks: BookProps[];
  wantToReadBooks: BookProps[];
}

export interface BookStateProps {
  currentlyReadBooks: BookProps[];
  readBooks: BookProps[];
  wantToReadBooks: BookProps[];
  firstTimeLoad: boolean;
  homeSpinnerVisible: boolean;
  searchSpinnerVisible: boolean;
  isPageReloaded: boolean;
}

const initialState: BookStateProps = {
  currentlyReadBooks: [],
  readBooks: [],
  wantToReadBooks: [],
  firstTimeLoad: true,
  homeSpinnerVisible: false,
  searchSpinnerVisible: false,
  isPageReloaded: false,
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
    displayHomePageBooks: (
      state = initialState,
      action: PayloadAction<any>
    ) => {
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
    switchFirstTimeLoad: (state = initialState) => {
      state.firstTimeLoad = !state.firstTimeLoad;
    },
    switchHomeSpinnerVisible: (state = initialState) => {
      state.homeSpinnerVisible = !state.homeSpinnerVisible;
    },
    switchSearchSpinnerVisible: (state = initialState) => {
      state.searchSpinnerVisible = !state.searchSpinnerVisible;
    },
    switchReloadOff: (state = initialState) => {
      state.isPageReloaded = false;
    },
    switchReloadOn: (state = initialState) => {
      state.isPageReloaded = true;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  displayHomePageBooks,
  switchFirstTimeLoad,
  switchHomeSpinnerVisible,
  switchSearchSpinnerVisible,
  switchReloadOn,
  switchReloadOff,
} = bookSlice.actions;

export default bookSlice.reducer;
