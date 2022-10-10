import { bookActionTypes } from "./action";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { CATEGORIES } from "../../pages/constants";
import { RootState } from "../store";

// const bookInitialState = {
//   currentlyReadBooks: [],
//   readBooks: [],
//   wantToReadBooks: [],
// };

// export default function reducer(state = bookInitialState, action: any) {
//   switch (action.type) {
//     case bookActionTypes.MOVE_TO_CURRENTLY:
//       return {
//         ...state,
//         currentlyReadBooks: [...state.currentlyReadBooks, action.newItem],
//       };
//     case bookActionTypes.REMOVE_FROM_CURRENTLY:
//       return {
//         ...state,
//         currentlyReadBooks: [
//           ...state.currentlyReadBooks.filter(
//             // TODO: fix it
//             (book: object) => book !== action.newItem.id
//           ),
//         ],
//       };
//     case bookActionTypes.MOVE_TO_READ:
//       return {
//         ...state,
//         readBooks: [...state.readBooks, action.newItem],
//       };
//     case bookActionTypes.MOVE_TO_WANT:
//       return {
//         ...state,
//         wantToReadBooks: [...state.wantToReadBooks, action.newItem],
//       };
//     default:
//       return state;
//   }
// }

export interface BookState {
  currentlyReadBooks: object[];
  readBooks: object[];
  wantToReadBooks: object[];
}

const initialState: BookState = {
  currentlyReadBooks: [],
  readBooks: [],
  wantToReadBooks: [],
};

export const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {
    moveTo: (state = initialState, action: PayloadAction<any>) => {
      // currently reading
      const { book, category } = action.payload;
      if (category === CATEGORIES[0]) {
        state.currentlyReadBooks.push(book);
      }
      // read
      else if (category === CATEGORIES[1]) {
        state.readBooks.push(book);
      }
      // want to read
      else {
        state.wantToReadBooks.push(book);
      }
    },
    removeFrom: (state = initialState, action: PayloadAction<any>) => {
      // currently reading
      const { book, category } = action.payload;
      if (category === CATEGORIES[0]) {
        state.currentlyReadBooks = state.currentlyReadBooks.filter(
          (item: any) => item.id !== book.id
        );
      }
      // read
      else if (category === CATEGORIES[1]) {
        state.readBooks = state.readBooks.filter(
          (item: any) => item.id !== book.id
        );
      }
      // want to read
      else {
        state.wantToReadBooks = state.wantToReadBooks.filter(
          (item: any) => item.id !== book.id
        );
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { moveTo, removeFrom } = bookSlice.actions;

export default bookSlice.reducer;
