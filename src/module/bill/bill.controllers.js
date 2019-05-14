import HTTPStatus from 'http-status';

import Bill from './bill.model';
import Store from '../store/store.model';
import Product from '../product/product.model';

export async function getBillList(req, res) {
  const limit = parseInt(req.query.limit, 0) || 50;
  const skip = parseInt(req.query.skip, 0) || 0;
  const search = req.query.search;
  try {
    const list = await Bill.list({ skip, limit, search });
    const total = await Bill.count({ isRemoved: false, isReturned: false, _id: new RegExp(search, 'i') });
    return res.status(HTTPStatus.OK).json({ list, total });
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message || e);
  }
}

export async function getReturnedBillList(req, res) {
  const limit = parseInt(req.query.limit, 0) || 50;
  const skip = parseInt(req.query.skip, 0) || 0;
  try {
    const list = await Bill.list({ skip, limit, isReturned: true });
    const total = await Bill.count({ isRemoved: false, isReturned: true });
    return res.status(HTTPStatus.OK).json({ list, total });
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message || e);
  }
}

export async function getBillDetail(req, res) {
  try {
    const bill = await Bill
      .findOne({ _id: req.params.id, isRemoved: false, isReturned: false })
      .populate({
        path: 'productList.product',
        populate: {
          path: 'store',
        },
      });
    if (!bill) {
      return res.sendStatus(HTTPStatus.NOT_FOUND);
    }
    return res.status(HTTPStatus.OK).json(await bill.toDetailJSON());
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message || e);
  }
}

export async function returnToSupplier(req, res) {
  try {
    const { productList, ...rest } = req.body;
    await Promise.all(productList.map(async item => {
      const product = await Product.findOne({ _id: item.product, isRemoved: false });
      if (!product) {
        throw new Error('Invalid product!');
      }
      const store = await Store.findById({ _id: product.store, isRemoved: false });
      if (!store.isDefault) {
        product.quantity -= item.quantity;
        //
        product.total -= item.quantity;
        //
        store.productQuantity -= item.quantity;
        store.returnedQuantity += item.quantity;
        await product.save();
        await store.save();
      }
    }));
    const bill = await Bill.createBill({
      productList,
      ...rest,
      isReturned: true,
    }, req.user._id);
    return res.status(HTTPStatus.CREATED).json(bill);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message || e);
  }
}

export async function createBill(req, res) {
  try {
    const { productList } = req.body;
    await Promise.all(productList.map(async item => {
      const product = await Product.findOne({ _id: item.product, isRemoved: false });
      if (!product) {
        throw new Error('Invalid product!');
      }
      const store = await Store.findById({ _id: product.store, isRemoved: false });

      if (!store.isDefault) {
        // Trả hàng
        if (item.isReturned) {
          // Tìm hàng trả có sẵn
          let returnedProduct = await Product.findOne({
            importPrice: product.importPrice,
            exportPrice: product.exportPrice,
            isReturned: true,
            isRemoved: false,
          });
          if (returnedProduct) {
            returnedProduct.quantity += item.quantity;
            returnedProduct.total += item.quantity;
            await returnedProduct.save();
          } else {
            returnedProduct = await Product.createProduct({
              importPrice: product.importPrice,
              exportPrice: product.exportPrice,
              store: product.store,
              quantity: item.quantity,
              total: item.quantity,
              isReturned: true,
            }, req.user._id);
          }

          // product.quantity;
          product.total -= item.quantity;
          await product.save();
          store.productQuantity += item.quantity;
        } else {
          product.quantity -= item.quantity;
          store.productQuantity -= item.quantity;
          await product.save();
        }
      } else {
        // do with default store
      }

      return await store.save();
    }));
    const bill = await Bill.createBill(req.body, req.user._id);
    return res.status(HTTPStatus.CREATED).json(bill);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message || e);
  }
}
