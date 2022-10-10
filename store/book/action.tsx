export const bookActionTypes = {
  MOVE_TO_CURRENTLY: "MOVE_TO_CURRENTLY",
  MOVE_TO_READ: "MOVE_TO_READ",
  MOVE_TO_WANT: "MOVE_TO_WANT",
  REMOVE_FROM_CURRENTLY: "REMOVE_FROM_CURRENTLY",
  REMOVE_FROM_READ: "REMOVE_FROM_READ",
  REMOVE_FROM_WANT: "REMOVE_FROM_WANT",
};

export const moveToCurrently = (book: any) => {
  return { type: bookActionTypes.MOVE_TO_CURRENTLY, book: book };
};

export const moveToRead = (book: any) => {
  return { type: bookActionTypes.MOVE_TO_READ, book: book };
};

export const moveToWant = (book: any) => {
  return { type: bookActionTypes.MOVE_TO_WANT, book: book };
};

export const removeFromCurrently = (book: any) => {
  return { type: bookActionTypes.REMOVE_FROM_CURRENTLY, book: book };
};

export const removeFromRead = (book: any) => {
  return { type: bookActionTypes.REMOVE_FROM_READ, book: book };
};

export const removeFromWant = (book: any) => {
  return { type: bookActionTypes.REMOVE_FROM_WANT, book: book };
};
