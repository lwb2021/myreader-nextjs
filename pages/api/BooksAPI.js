const api = "https://reactnd-books-api.udacity.com";

// TODO: delete the token as it is for testing purposes
let token = "dhagzjhr";
if (typeof window !== "undefined") {
  // Generate a unique token for storing your bookshelf data on the backend server.
  token = localStorage.token;
  // TODO: delete the token as it is for testing purposes
  token = "dhagzjhr";
  console.log("local token is ", token);

  if (!token)
    token = localStorage.token = Math.random().toString(36).substr(-8);
}

const headers = {
  Accept: "application/json",
  Authorization: token,
};

export const get = (bookId) =>
  fetch(`${api}/books/${bookId}`, { headers })
    .then((res) => res.json())
    .then((data) => data.book);

export const getAllBooks = () =>
  fetch(`${api}/books`, { headers })
    .then((res) => res.json())
    .then((data) => {
      const response = {
        currentlyReading: [],
        read: [],
        wantToRead: [],
      };
      data.books.filter((book) => {
        response[book.shelf].push(book);
      });
      return response;
    });

export const getBooksByShelf = (shelf) =>
  fetch(`${api}/books`, { headers })
    .then((res) => res.json())
    .then((data) => data.books.filter((book) => book.shelf === shelf));

export const updateBook = (book, shelf) =>
  fetch(`${api}/books/${book.id}`, {
    method: "PUT",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ shelf }),
  }).then((res) => res.json());

export const searchBook = (query) =>
  fetch(`${api}/search`, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  })
    .then((res) => res.json())
    .then((data) => data.books);
