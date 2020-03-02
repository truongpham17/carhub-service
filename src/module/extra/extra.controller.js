import Extra from './extra.model';

export const getExtra = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = parseInt(req.query.skip, 10) || 0;
  const extras = await Extra.find({ isActive: true })
    .skip(skip)
    .limit(limit);
  const total = await Extra.countDocuments();
  return res.json({ extras, total });
};

export const getExtraById = async (req, res) => {
  const { id } = req.params;
  const extra = await Extra.findById(id);
  return res.json(extra);
};

export const createExtra = async (req, res) => {
  const { content, price } = req.body;
  const extra = await Extra.create({ content, price });
  return res.json({ msg: 'Created!', extra });
};

export const updateExtra = async (req, res) => {
  try {
    const { id } = req.params;
    const extra = await Extra.findByIdAndUpdate({ _id: id }, req.body);
    return res.json({ msg: 'Updated!', extra });
  } catch (error) {
    res.status(404).json(error);
  }
};

export const removeExtra = async (req, res) => {
  try {
    const { id } = req.params;
    await Extra.findByIdAndUpdate({ _id: id }, { isActive: false });
    return res.json({ msg: 'Deleted!' });
  } catch (error) {
    res.status(404).json(error);
  }
};
