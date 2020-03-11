import httpStatus from 'http-status';
import Book from './book.model';

export const getBooks = async (req, res) => {
  const books = await Book.find({});
  return res.json(books);
};

export const addBook = async (req, res) => {
  try {
    const { title, description } = req.body;
    const book = await Book.create({ title, description });
    console.log(book);
    return res.json(book.toJSON());
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST);
  }
};

export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByIdAndDelete({ _id: id });
    return res.json(book.toJSON());
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST);
  }
};

export const updateBook = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { id } = req.params;
    const book = await Book.findByIdAndUpdate(
      { _id: id },
      { title, description }
    );
    return res.json(book.toJSON());
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST);
  }
};
