import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllBooks } from "../../pages/api/BooksAPI";
import { BookProps } from "../../components/Book";

export interface HomePageBookProps {
  currentlyReading: BookProps[];
  read: BookProps[];
  wantToRead: BookProps[];
}

const initialState: HomePageBookProps = {
  currentlyReading: [],
  read: [],
  wantToRead: [],
};

export const getHomePageBooks = createAsyncThunk(
  "HomePageBook/getHomePageBooks",
  async () => {
    try {
      const response = await getAllBooks();
      return response;
    } catch (err) {
      return err;
    }
  }
);

export const HomePageBookSlice = createSlice({
  name: "HomePageBook",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getHomePageBooks.fulfilled, (state, action) => {
        const newState = action.payload;
        Object.assign(state, newState);
      })
      .addCase(getHomePageBooks.rejected, (_, action) => {
        console.error("getHomePageBooks was rejected.");
        console.error(action.payload);
      });
  },
});

export default HomePageBookSlice.reducer;
