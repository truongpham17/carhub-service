import HTTPStatus from 'http-status';
import Book from './book.model';
import constants from '../../config/constants';

export const getBookList = async (req, res) => {
  const books = await Book.find();
  return res.json(books);
};

export const addBook = async (req, res) => {
  try {
    const { title, description } = req.body;
    const book = await Book.create({ title, description });
    return res.json(book);
  } catch (error) {
    console.log(error);
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findOneAndRemove({ _id: req.params.id });
    return res.status(HTTPStatus.OK).json(book);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message || e);
  }
};

export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const book = await Book.findByIdAndUpdate(
      { _id: id },
      { title, description }
    );
    return res.status(HTTPStatus.OK).json(book);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message || e);
  }
};
