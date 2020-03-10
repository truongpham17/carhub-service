import httpStatus from 'http-status';
import Payment from './payment.model';

export const getPayment = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = parseInt(req.query.skip, 10) || 0;
    const payments = await Payment.find({ isActive: true })
      .skip(skip)
      .limit(limit);
    const total = await Payment.countDocuments({ isActive: true });
    return res.status(httpStatus.OK).json({ payments, total });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json(error);
  }
};

export const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findById(id);
    if (!payment) {
      throw new Error('Payment is not found!');
    }
    return res.status(httpStatus.OK).json(payment);
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json(error);
  }
};

export const createPayment = async (req, res) => {
  try {
    const { type, amount, note } = req.body;
    const payment = await Payment.create({ type, amount, note });
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
    return res.status(httpStatus.OK).json({ msg: 'Updated!', payment });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json(error);
  }
};

export const removePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findByIdAndUpdate(
      { _id: id },
      { isActive: false }
    );
    return res.status(httpStatus.OK).json({ msg: 'Deleted', payment });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json(error);
  }
};
