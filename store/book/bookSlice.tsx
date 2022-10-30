import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { CATEGORIES } from "../../utils/constants";
import { updateBook, getAllBooks } from "../../pages/api/BooksAPI";
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
  async (data: any) => {
    const { book, shelf } = data;
    try {
      // just a single element, don't put in thunk
      // answer: it is an async call. it has to be here
      const response = await updateBook(book, shelf);
      return response;
    } catch (err: any) {
      return err;
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
      return err;
    }
  }
);

export const readerSlice = createSlice({
  name: "reader",
  initialState,
  reducers: {
    switchFirstTimeLoad: (state = initialState) => {
      state.firstTimeLoad = false;
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
        getHomePageBooks.fulfilled,
        (state, action: PayloadAction<BookProps[]>) => {
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
      // TODO: correct <any>
      .addCase(getHomePageBooks.rejected, (_, action: PayloadAction<any>) => {
        console.log("getHomePageBooks was rejected.");
        console.log(action);
      });
  },
});

// Action creators are generated for each case reducer function
export const { switchFirstTimeLoad, switchReloadOn, switchReloadOff } =
  readerSlice.actions;

export default readerSlice.reducer;
