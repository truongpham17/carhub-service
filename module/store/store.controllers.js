import HTTPStatus from 'http-status';
import Store from './store.model';
import Product from '../product/product.model';
import StoreHistory from './storeHistory.model';

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

export async function importStore(req, res) {
  try {
    const { storeId, productList, note } = req.body;
    const store = await Store.findById(storeId);
    if (!store) {
      throw new Error({ message: 'Store not found!' });
    }
    let countQuantity = 0;
    let countTotal = 0;
    const products = await Promise.all(
      productList.map(async ({ importPrice, exportPrice, quantity }) => {
        const product = await Product.findOne({ importPrice, exportPrice });
        if (product) {
          product.quantity += quantity;
          product.total += quantity;
          countQuantity += product.quantity;
          countTotal += product.total;
          return await product.save();
        } else {
          countQuantity += quantity;
          countTotal += quantity;
          return await Product.createProduct({
            importPrice,
            exportPrice,
            quantity,
            total: quantity,
            store: storeId,
          }, req.user._id);
        }
      })
    );
    const result = await StoreHistory.createStoreHistory({
      store: storeId,
      quantity: countQuantity,
      total: countTotal,
      note,
      productList: products.map(item => item._id),
    }, req.user._id);
    return res.status(HTTPStatus.OK).json(result);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message || e);
  }
}

export async function updateStore(req, res) {
  try {
    const store = await Store.findOne({ _id: req.params.id, isRemoved: false });
    if (!store) {
      throw new Error('Not found');
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
