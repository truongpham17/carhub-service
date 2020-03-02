import Hub from './hub.model';

export const getHub = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = parseInt(req.query.skip, 10) || 0;
  const hubs = await Hub.find()
    .limit(limit)
    .skip(skip);
  const total = await Hub.count();
  return res.json({ hubs, total });
};

export const getHubById = async (req, res) => {
  const { id } = req.params;
  const hub = await Hub.findById({ _id: id });
  return res.json({ hub });
};

export const createHub = async (req, res) => {
  const hub = await Hub.create(req.body);
  return res.json({ msg: 'Created successfully!', hub });
};

export const updateHub = async (req, res) => {
  try {
    const { id } = req.params;
    const hub = await Hub.findByIdAndUpdate({ _id: id }, req.body);
    return res.json({ msg: 'Update successfully!', hub });
  } catch (error) {
    res.status(404).json(error);
  }
};

export const removeHub = async (req, res) => {};
