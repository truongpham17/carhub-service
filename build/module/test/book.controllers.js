"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateBook = exports.deleteBook = exports.addBook = exports.getBooks = void 0;

var _httpStatus = _interopRequireDefault(require("http-status"));

var _book = _interopRequireDefault(require("./book.model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getBooks = async (req, res) => {
  const books = await _book.default.find({});
  return res.json(books);
};

exports.getBooks = getBooks;

const addBook = async (req, res) => {
  try {
    const {
      title,
      description
    } = req.body;
    const book = await _book.default.create({
      title,
      description
    });
    return res.json(book.toJSON());
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST);
  }
};

exports.addBook = addBook;

const deleteBook = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const book = await _book.default.findByIdAndDelete({
      _id: id
    });
    return res.json(book.toJSON());
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST);
  }
};

exports.deleteBook = deleteBook;

const updateBook = async (req, res) => {
  try {
    const {
      title,
      description
    } = req.body;
    const {
      id
    } = req.params;
    const book = await _book.default.findByIdAndUpdate({
      _id: id
    }, {
      title,
      description
    });
    return res.json(book.toJSON());
  } catch (error) {
    return res.status(_httpStatus.default.BAD_REQUEST);
  }
};

exports.updateBook = updateBook;