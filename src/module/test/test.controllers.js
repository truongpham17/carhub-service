import TriTest from './test.models';

export const getTest = async (req, res) => {
  const triTest = await TriTest.find();
  return res.json(triTest);
};

export const getTestById = async (req, res) => {
  const { id } = req.params.id;
  const triTest = await TriTest.findById(id);
  return res.json(triTest);
};

export const createTest = async (req, res) => {
  const { title, description } = req.body;
  const test = await TriTest.create({ title, description });
  return res.json(test);
};

export const deleteTest = async (req, res) => {
  try {
    const test = await TriTest.findByIdAndDelete(req.params.id);
    return res.json(test);
  } catch (error) {
    res.status(404).json(error);
  }
};

export const updateTest = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { id } = req.params;
    const test = await TriTest.findByIdAndUpdate(
      { _id: id },
      { title, description }
    );
    return res.json(test);
  } catch (error) {
    res.status(404).json(error);
  }
};
