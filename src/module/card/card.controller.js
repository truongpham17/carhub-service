import HTTPStatus from 'http-status';
import Card from './card.model';

export const getCardList = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = parseInt(req.query.skip, 10) || 0;
  try {
    const list = await Card.find()
      .skip(skip)
      .limit(limit);
    const total = await Card.count();
    return res.status(HTTPStatus.OK).json({ list, total });
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const getCard = async (req, res) => {
  try {
    const { id } = req.params;
    const card = await Card.findById(id);
    if (!card) {
      throw new Error('License Not found');
    }

    return res.status(HTTPStatus.OK).json(card.toJSON());
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const addCard = async (req, res) => {
  try {
    const card = await Card.create(req.body);
    return res.status(HTTPStatus.CREATED).json(card);
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const deleteCard = async (req, res) => {
  try {
    const card = await Card.findOne({ _id: req.params.id });
    card.isActive = false;
    await card.save();
    return res.status(HTTPStatus.OK).json(card);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message || e);
  }
};

export const updateCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate({ _id: req.params.id }, req.body);
    return res.status(HTTPStatus.OK).json(card);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message || e);
  }
};
