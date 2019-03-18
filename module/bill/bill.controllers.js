import HTTPStatus from 'http-status';

import Bill from './bill.model';
import Store from '../store/store.model';
import Product from '../product/product.model';

export async function getBillList(req, res) {
  const limit = parseInt(req.query.limit, 0) || 50;
  const skip = parseInt(req.query.skip, 0) || 0;
  try {
    const list = await Bill.list({ skip, limit });
    const total = await Bill.count({ isRemoved: false });
    return res.status(HTTPStatus.OK).json({ list, total });
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
      product.quantity -= item.quantity;
      const store = await Store.findById({ _id: product.store, isRemoved: false });
      store.productQuantity -= item.quantity;
      return await Promise.all([await product.save(), await store.save()])
    }));
    const bill = await Bill.createBill(req.body, req.user._id);
    return res.status(HTTPStatus.CREATED).json(bill);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message || e);
  }
}