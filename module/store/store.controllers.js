import HTTPStatus from 'http-status';
import Store from './store.model';
import Product from '../product/product.model';
import StoreHistory from './storeHistory.model';

export async function getStoreList(req, res) {
  const limit = parseInt(req.query.limit, 0) || 50;
  const skip = parseInt(req.query.skip, 0) || 0;
  try {
    const list = await Store.list({ skip, limit });
    const total = await Store.count({ isRemoved: false });
    return res.status(HTTPStatus.OK).json({ list, total });
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message || e);
  }
}

export async function getStoreInfo(req, res) {
  try {
    const store = await Store.findOne({ _id: req.params.id, isRemoved: false });
    if (!store) {
      throw new Error('Store not found!');
    }
    const products = await Product.find({ store: store._id, isRemoved: false });
    let totalFund = 0;
    let totalSoldMoney = 0;
    products.forEach(item => {
      totalFund += item.importPrice * item.total;
      totalSoldMoney += (item.total - item.quantity) * item.exportPrice;
    });
    const result = {
      ...await store.toJSON(),
      totalSoldProduct: store.totalImportProduct - store.productQuantity,
      totalFund,
      totalSoldMoney,
    }
    return res.status(HTTPStatus.OK).json(result);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message || e);
  }
}

export async function getStoreProducts(req, res) {
  const limit = parseInt(req.query.limit, 0) || 50;
  const skip = parseInt(req.query.skip, 0) || 0;
  try {
    const store = await Store.findOne({ _id: req.params.id, isRemoved: false });
    if (!store) {
      throw new Error('Store not found!');
    }
    const list = await Product.list({ skip, limit, store: store._id });
    const total = await Product.count({ store: store._id, isRemoved: false });
    return res.status(HTTPStatus.OK).json({ list, total });
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message || e);
  }
}

export async function getStoreHistory(req, res) {
  const limit = parseInt(req.query.limit, 0) || 50;
  const skip = parseInt(req.query.skip, 0) || 0;
  try {
    const store = await Store.findOne({ _id: req.params.id, isRemoved: false });
    if (!store) {
      throw new Error('Store not found!');
    }
    const list = await StoreHistory.list({ skip, limit, store: store._id });
    const total = await StoreHistory.count({ store: store._id, isRemoved: false });
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
      throw new Error('Store not found!');
    }
    let countQuantity = 0;
    let countTotal = 0;
    const products = await Promise.all(
      productList.map(async ({ importPrice, exportPrice, quantity }) => {
        const product = await Product
          .findOne({ store: storeId, importPrice, exportPrice });
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
      throw new Error('Store not found!');
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
