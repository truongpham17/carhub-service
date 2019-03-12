import HTTPStatus from "http-status";
import Store from "./store.model";

export async function getStoreList(req, res) {
  const limit = parseInt(req.query.limit, 0) || 50;
  const skip = parseInt(req.query.skip, 0) || 0;
  try {
    const list = await Store.list({ limit, skip });
    const total = await Store.count({ isRemoved: false });
    return res.status(HTTPStatus.OK).json({ list, total });
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message || e);
  }
}

export async function createStore(req, res) {
  try {
    const store = await Store.createStore(req.body, req.user._id);
    return res.status(HTTPStatus.CREATED).json(store);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message || e);
  }
}

export async function updateStore(req, res) {
  try {
    const store = await Store.findOne({ _id: req.params.id, isRemoved: false });
    if (!store) {
      throw new Error("Not found");
    }

    Object.keys(req.body).forEach(key => {
      store[key] = req.body[key];
    });

    return res.status(HTTPStatus.OK).json(await store.save());
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message || e);
  }
}

export async function deleteStore(req, res) {
  try {
    const store = await Store.findOne({ _id: req.params.id, isRemoved: false });
    if (!store) {
      return res.sendStatus(HTTPStatus.NOT_FOUND);
    }

    store.isRemoved = true;

    return res.status(HTTPStatus.OK).json(await store.save());
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message || e);
  }
}
