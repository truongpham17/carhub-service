import HTTPStatus from 'http-status';
import Transaction from './transaction.model';

export const getTransactionList = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = parseInt(req.query.skip, 10) || 0;
  try {
    const transactions = await Transaction.find({ isActive: true })
      .populate('employee lease rental')
      .populate({ path: 'lease', populate: { path: 'customer' } })
      .populate({ path: 'lease', populate: { path: 'car' } })

      .populate({
        path: 'lease',
        populate: { path: 'car', populate: { path: 'carModel' } },
      })
      .populate({ path: 'rental', populate: { path: 'customer' } })
      .populate({ path: 'rental', populate: { path: 'carModel' } })

      .skip(skip)
      .limit(limit);
    const total = await Transaction.count();
    return res.status(HTTPStatus.OK).json({ transactions, total });
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const getTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      throw new Error('Transaction Not found');
    }

    return res.status(HTTPStatus.OK).json(transaction.toJSON());
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const addTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.create(req.body);
    return res.status(HTTPStatus.CREATED).json(transaction);
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id });
    transaction.isActive = false;
    await transaction.save();
    return res.status(HTTPStatus.OK).json(transaction);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message || e);
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      { _id: req.params.id },
      req.body
    );
    return res.status(HTTPStatus.OK).json(transaction);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message || e);
  }
};
