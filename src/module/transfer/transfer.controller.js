import httpStatus from 'http-status';
import Transfer from './transfer.model';

export const getTransferList = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = parseInt(req.query.skip, 10) || 0;
  try {
    const transfers = await Transfer.find()
      .limit(limit)
      .skip(skip);
    const total = await Transfer.count();
    return res.status(httpStatus.OK).json({ transfers, total });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json(error.message);
  }
};

export const getTransfer = async (req, res) => {
  try {
    const { id } = req.params;
    const transfer = await Transfer.findById({ _id: id });
    if (!transfer) {
      throw new Error('Transfer not found!');
    }
    return res.status(httpStatus.OK).json(transfer);
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json(error.message);
  }
};

export const createTransfer = async (req, res) => {
  try {
    console.log(req.body);
    const transfer = await Transfer.create(req.body);
    return res.status(httpStatus.CREATED).json(transfer);
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json(error.message);
  }
};

export const updateTransfer = async (req, res) => {
  try {
    const { id } = req.params;
    const transfer = await Transfer.findById(id);
    Object.keys(req.body).forEach(key => {
      transfer[key] = req.body[key];
    });
    await transfer.save();
    return res.status(httpStatus.OK).json(transfer);
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json(error.message);
  }
};

export const removeTransfer = async (req, res) => {
  try {
    const { id } = req.params;
    await Transfer.findByIdAndUpdate({ _id: id });
    return res.json(httpStatus.OK).json({ msg: 'Deteled successfully!' });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json(error.message);
  }
};
