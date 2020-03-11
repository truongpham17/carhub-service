"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateTest = exports.deleteTest = exports.createTest = exports.getTestById = exports.getTest = void 0;

var _test = _interopRequireDefault(require("./test.models"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getTest = async (req, res) => {
  const triTest = await _test.default.find();
  return res.json(triTest);
};

exports.getTest = getTest;

const getTestById = async (req, res) => {
  const {
    id
  } = req.params.id;
  const triTest = await _test.default.findById(id);
  return res.json(triTest);
};

exports.getTestById = getTestById;

const createTest = async (req, res) => {
  const {
    title,
    description
  } = req.body;
  const test = await _test.default.create({
    title,
    description
  });
  return res.json(test);
};

exports.createTest = createTest;

const deleteTest = async (req, res) => {
  try {
    const test = await _test.default.findByIdAndDelete(req.params.id);
    return res.json(test);
  } catch (error) {
    res.status(404).json(error);
  }
};

exports.deleteTest = deleteTest;

const updateTest = async (req, res) => {
  try {
    const {
      title,
      description
    } = req.body;
    const {
      id
    } = req.params;
    const test = await _test.default.findByIdAndUpdate({
      _id: id
    }, {
      title,
      description
    });
    return res.json(test);
  } catch (error) {
    res.status(404).json(error);
  }
};

exports.updateTest = updateTest;