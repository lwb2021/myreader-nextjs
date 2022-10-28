import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store/store";
import { CATEGORIES } from "../../utils/constants";
import { updateBook, getAllBooks } from "../../pages/api/BooksAPI";
import { BookProps } from "../../components/Book";

interface newStateProps {
  currentlyReadBooks: BookProps[];
  readBooks: BookProps[];
  wantToReadBooks: BookProps[];
}

interface ValidationErrors {
  errorMessage: string;
  field_errors: Record<string, string>;
}

export interface BookStateProps {
  currentlyReadBooks: BookProps[];
  readBooks: BookProps[];
  wantToReadBooks: BookProps[];
  firstTimeLoad: boolean;
  isPageReloaded: boolean;
}

const initialState: BookStateProps = {
  currentlyReadBooks: [],
  readBooks: [],
  wantToReadBooks: [],
  firstTimeLoad: true,
  isPageReloaded: false,
};

export const updateShelf = createAsyncThunk(
  "reader/updateShelf",
  async (data: any, { rejectWithValue }) => {
    const { book, shelf } = data;
    try {
      // just a single element, don't put in thunk
      const response = await updateBook(book, shelf);
      return response;
    } catch (err: any) {
      console.log(err);
      console.log(err.response);
      console.log(err.response.data);

      return rejectWithValue(err.response.data);
    }
  }
);

export const getHomePageBooks = createAsyncThunk(
  "reader/getHomePageBooks",
  async () => {
    try {
      const response = await getAllBooks();
      return response;
    } catch (err: any) {
      // console.log("err   ", err);
      console.log(err);
      // return err;
      return rejectWithValue((await response.json()) as MyKnownError);
    }
  }
);

export const readerSlice = createSlice({
  name: "reader",
  initialState,
  reducers: {
    switchFirstTimeLoad: (state = initialState) => {
      state.firstTimeLoad = !state.firstTimeLoad;
    },
    switchReloadOn: (state = initialState) => {
      state.isPageReloaded = true;
    },
    switchReloadOff: (state = initialState) => {
      state.isPageReloaded = false;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(
        getHomePageBooks.pending,
        (state, action: PayloadAction<any>) => {}
      )
      .addCase(
        getHomePageBooks.fulfilled,
        (state, action: PayloadAction<any>) => {
          const newState: newStateProps = {
            currentlyReadBooks: [],
            readBooks: [],
            wantToReadBooks: [],
          };
          const response = action.payload;
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
        }
      )
      .addCase(
        getHomePageBooks.rejected,
        (state, action: PayloadAction<any>) => {
          console.log("getHomePageBooks.rejected,");
        }
      );
  },
});

// Action creators are generated for each case reducer function
export const {
  // getHomePageBooks,
  switchFirstTimeLoad,
  switchReloadOn,
  switchReloadOff,
} = readerSlice.actions;

export default readerSlice.reducer;
