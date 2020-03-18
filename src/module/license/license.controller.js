import HTTPStatus from 'http-status';
import License from './license.model';
import constants from '../../config/constants';
import Customer from '../customer/customer.model';

export const getLicenseList = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = parseInt(req.query.skip, 10) || 0;
  try {
    const list = await License.find()
      .skip(skip)
      .limit(limit);
    const total = await License.count();
    return res.status(HTTPStatus.OK).json({ list, total });
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const getLicense = async (req, res) => {
  try {
    const { id } = req.params;
    const license = await License.findById(id);
    if (!license) {
      throw new Error('License Not found');
    }

    return res.status(HTTPStatus.OK).json(license.toJSON());
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const addLicense = async (req, res) => {
  try {
    const license = await License.create(req.body);
    req.customer.license = license._id;
    await req.customer.save();

    return res.status(HTTPStatus.CREATED).json(license);
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const deleteLicense = async (req, res) => {
  try {
    const license = await License.findOne({ _id: req.params.id });
    license.isActive = false;
    await license.save();
    return res.status(HTTPStatus.OK).json(license);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message || e);
  }
};

export const updateLicense = async (req, res) => {
  try {
    const license = await License.findByIdAndUpdate(
      { _id: req.params.id },
      req.body
    );
    return res.status(HTTPStatus.OK).json(license);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message || e);
  }
};
