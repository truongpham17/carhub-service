import HTTPStatus from 'http-status';
import Notification from './notification.model';
import Customer from '../customer/customer.model';

export const getNotifications = async (req, res) => {
  try {
    console.log('come here!!');
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = parseInt(req.query.skip, 10) || 0;
    const { customer } = req;

    const list = await Notification.find({
      customer: customer._id.toString(),
    })
      .populate({ path: 'actor', model: Customer })
      .skip(skip)
      .limit(limit);

    console.log(list);
    const total = await Notification.countDocuments();
    return res.status(HTTPStatus.OK).json({ list, total });
  } catch (error) {
    console.log(error);
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const getNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findById(id);

    if (!notification) {
      throw new Error('Customer not found');
    }

    return res.status(HTTPStatus.OK).json(notification.toJSON());
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};
