import CarMapping from './carmapping.model';

export const getCarMapping = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = parseInt(req.query.skip, 10) || 0;
  const carmappings = await CarMapping.find()
    .skip(skip)
    .limit(limit);
  const total = await CarMapping.count();
  return res.json({ carmappings, total });
};

export const createCarMapping = async (req, res) => {
  const carmapping = await CarMapping.create(req.body);
  return res.json({ msg: 'Created successfully!', carmapping });
};

export const updateCarMapping = async (req, res) => {
  try {
    const { id } = req.params;
    const carmapping = await CarMapping.findByIdAndUpdate(
      { _id: id },
      req.body
    );
    return res.json({ msg: 'Updated successfully!', carmapping });
  } catch (error) {
    res.status(404).json(error);
  }
};

export const removeCarMapping = async (req, res) => {};
