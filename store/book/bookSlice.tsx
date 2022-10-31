import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getAllBooks } from "../../pages/api/BooksAPI";
import { BookProps } from "../../components/Book";

interface newStateProps {
  currentlyReading: BookProps[];
  read: BookProps[];
  wantToRead: BookProps[];
}

export interface BookStateProps {
  currentlyReading: BookProps[];
  read: BookProps[];
  wantToRead: BookProps[];
  firstTimeLoad: boolean;
  isPageReloaded: boolean;
}

const initialState: BookStateProps = {
  currentlyReading: [],
  read: [],
  wantToRead: [],
  firstTimeLoad: true,
  isPageReloaded: false,
};

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
        (state, action: PayloadAction<newStateProps>) => {
          const newState: newStateProps = action.payload;
          Object.assign(state, newState);
        }
      )
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
