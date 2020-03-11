import httpStatus from 'http-status';
import Payment from './payment.model';

export const getPayment = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = parseInt(req.query.skip, 10) || 0;
  const payments = await Payment.find({ isActive: true })
    .skip(skip)
    .limit(limit);
  const total = await Payment.countDocuments({ isActive: true });
  return res.json({ payments, total });
};

export const getPaymentById = async (req, res) => {
  const { id } = req.params;
  const payment = await Payment.findById(id);
  return res.json(payment);
};

export const createPayment = async (req, res) => {
  try {
    const { type, amount, note } = req.body;
    const payment = await Payment.create({ type, amount, note });
    console.log(payment);
    return res.status(httpStatus.CREATED).json(payment);
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json(error);
  }
};

export const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const now = new Date();
    const payment = await Payment.findByIdAndUpdate(
      { _id: id },
      { ...req.body, modifiedDate: now }
    );
    return res.json({ msg: 'Updated!', payment });
  } catch (error) {
    res.status(404).json(error);
  }
};

export const removePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findByIdAndUpdate(
      { _id: id },
      { isActive: false }
    );
    return res.json({ msg: 'Deleted', payment });
  } catch (error) {
    res.status(404).json(error);
  }
};
