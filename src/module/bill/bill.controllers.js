import HTTPStatus from "http-status";

import Bill from "./bill.model";
import Store from "../store/store.model";
import Product from "../product/product.model";
import Customer from '../customer/customer.model';
import { importProduct } from '../store/store.controllers';

export async function getBillList(req, res) {
  const limit = parseInt(req.query.limit, 0) || 50;
  const skip = parseInt(req.query.skip, 0) || 0;
  const search = req.query.search;
  const customer = req.query.customer;
  try {
    console.log(customer);
    let list = await Bill.list({ skip, limit, search });
    console.log(list);
    let total = await Bill.count({
      isRemoved: false,
      isReturned: false,
      _id: new RegExp(search, "i"),
    });

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

// productList:
// product: { quantity: number, exportPrice: number, store: { storeName: string, storeId: string }, importPrice: number }
// only need importPrice when this product is in defaultStore
// customer: {isNew: boolean} || {id: string}

export async function createBill(req, res){
  try {
    const { productList, customer, debt, note } = req.body;
    let totalQuantity = 0;
    let totalPrice = 0;
    let totalPaid = 0;
    let saveList = [];

    console.log(req.body);
    const defaultStore = await Store.findOne({isDefault: true});

    // this bill have customer -> add new field
    let dbCustomer = null;
    if(customer.id || customer.isNew) {
      if(customer.isNew) {
        // add new Customer
        dbCustomer = await Customer.createCustomer(customer);
      } else {
        dbCustomer = await Customer.findById({_id: customer.id});
      }
      console.log('customer', dbCustomer);
      if(!dbCustomer) {
        throw new Error("Invalid customer!");
      }
    }

    for(let i = 0; i < productList.length; i++) {
      if(productList[i].store.storeId !== defaultStore._id.toString() || productList[i].isReturned) {
        const checkProductNull = await Product.findOne({
          exportPrice: productList[i].exportPrice,
          store: productList[i].store.storeId
        });
        if(!checkProductNull) {
          throw new Error("Invalid product");
        }
      }
    }

    // first, import all product that in default store
    const productNeedToImport = productList.filter(item => item.store.storeId === defaultStore._id.toString() && !item.isReturned);
    await importProduct(productNeedToImport, defaultStore, '', false, 0,  req.user._id);

    let stores = [];
    let products = [];

    for (let i = 0; i < productList.length; i++) {
      let product = null;
      if(productList[i].store.storeId === defaultStore._id.toString() && !productList[i].isReturned) {
        product = await Product.findOne({
          importPrice: productList[i].importPrice,
          exportPrice: productList[i].exportPrice,
          store: defaultStore._id
        })
      } else if(productList[i].isReturned){
        product = await Product.findOne({
          exportPrice: productList[i].exportPrice,
          store: productList[i].store.storeId,
        })
        if(product && product.total < product.quantity + productList[i].quantity) {
          throw new Error("Over max quantity");
        }
      } else {
        product = await Product.findOne({
          exportPrice: productList[i].exportPrice,
          store: productList[i].store.storeId,
          quantity: {$gt: productList[i].quantity - 1}
        })
      }
      if(!product) {
        throw new Error("Product is invalid");
      }

      const store = await Store.findById({
        _id: product.store.toString(),
        isRemoved: false
      });

      products.push(product);
      const checkDuplicate = stores.find(
        item => item._id.toString() === store._id.toString()
      );
      // neu checkduplicate === undefined -> cho add vao
      if (!checkDuplicate) {
        stores.push(store);
      }
      const productItem = productList[i];

      totalQuantity += productItem.quantity * (productItem.isReturned ? -1 : 1);
      totalPrice += productItem.quantity * (productItem.exportPrice - (productItem.discount || 0)) * (productItem.isReturned ? -1 : 1);
      saveList.push({
        product,
        quantity: productItem.quantity,
        discount: productItem.discount || 0,
        isReturned: productItem.isReturned
      })
    };
    totalPaid = totalPrice - debt;

    await Promise.all(
      productList.map(async (item, index) => {
        const product = products[index];
        if (!product) {
          throw new Error("Invalid product!");
        }
        const store = stores.find(
          item => item._id.toString() === product.store.toString()
        );
        if (!store) {
          throw new Error("Invalid Product!");
        }
        // Trả hàng
        if (item.isReturned) {
          product.quantity += item.quantity;
          store.productQuantity += item.quantity;
        } else {
          product.quantity -= item.quantity;
          store.productQuantity -= item.quantity;
        }
        return null;
        // return await store.save();
      })
    );

    for (let i = 0; i < stores.length; i++) {
      await stores[i].save();
    }
    for (let i = 0; i < products.length; i++) {
      await products[i].save();
    }

    if(debt && dbCustomer) {
      dbCustomer.debt += debt;
      await dbCustomer.save();
    }

    const bill = await Bill.createBill({ customer: dbCustomer && dbCustomer._id, totalQuantity, totalPrice, totalPaid, note, productList: saveList}, req.user._id);
    return res.status(HTTPStatus.CREATED).json(bill);


  } catch(err) {
      console.log(err);
      return res.status(HTTPStatus.BAD_REQUEST).json(err.message || e);
  }
}

export async function getBillDetail(req, res) {
  try {
    const bill = await Bill.findOne({
      _id: req.params.id,
      isRemoved: false,
    }).populate({
      path: "productList.product createdBy customer",
      populate: {
        path: "store"
      }
    });
    if (!bill) {
      return res.sendStatus(HTTPStatus.NOT_FOUND);
    }
    return res.status(HTTPStatus.OK).json(await bill.toDetailJSON());
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message || e);
  }
}

// productList: {product, quantity}

export async function returnToSupplier(req, res) {
  try {
    const { productList, ...rest } = req.body;
    let productInDb = [];
    let totalQuantity = 0;
    let totalPrice = 0;
    for (let i = 0; i <= productList.length - 1; i++) {
      const item = productList[i];
      const product = await Product.findOne({
        _id: item.product,
        isRemoved: false
      });
      if (!product) {
        throw new Error("Invalid product!");
      }
      productInDb.push({product, quantity: item.quantity});
      totalPrice += product.importPrice * item.quantity;
      totalQuantity += item.quantity;
      const store = await Store.findById({
        _id: product.store,
        isRemoved: false
      });
      store.productQuantity -= item.quantity;
      store.returnedQuantity += item.quantity;
      await store.save();
      product.quantity -= item.quantity;
      product.total -= item.quantity;
      await product.save();
    }

     /*
     [ { product:
     { importPrice: 20,
       exportPrice: 30,
       quantity: 8,
       total: 19,
       isReturned: false,
       isRemoved: false,
       _id: 5d1038d4e9aa7520c612b5b6,
       store: 5d0ea6a9fd06500cd83b9ffa,
       createdBy: 5c7c148b85119e4d1a4a5bc2,
       createdAt: 2019-06-24T02:43:32.597Z,
       updatedAt: 2019-07-01T18:04:55.218Z,
       __v: 0 },
    quantity: 1,
    discount: 0,
    isReturned: false } ]
    */

    //  const bill = await Bill.createBill({ customer: dbCustomer && dbCustomer._id, totalQuantity, totalPrice, totalPaid, note, productList: saveList}, req.user._id);

    const a =   productInDb.map(item => ({
      product: item.product,
      quantity: item.quantity,
      discount: 0,
      isReturned: true
    }));
    console.log('result product List: ', a);
    const bill = await Bill.createBill(
      {
        productList: productInDb.map(item => ({
          product: item.product,
          quantity: item.quantity,
          discount: 0,
          isReturned: true
        })),
        isReturned: true,
        totalQuantity,
        totalPrice,
        totalPaid: totalPrice,
        note: '',
      },
      req.user._id
    );
    return res.status(HTTPStatus.CREATED).json(bill);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message || e);
  }
}


export async function paidBill(req, res) {
  try {
    const bill = await Bill.findOne({
      _id: req.params.id,
      isRemoved: false
    }).populate({
      path: "productList.product",
      populate: {
        path: "store"
      }
    });
    if (!bill) {
      return res.sendStatus(HTTPStatus.NOT_FOUND);
    }
    if (bill.totalPaid >= bill.totalPrice) {
      return res
        .status(HTTPStatus.OK)
        .json({ message: "Bill've already paid!" });
    }
    bill.totalPaid = bill.totalPrice;
    bill.paymentStatus = "paid";
    await bill.save();
    return res.status(HTTPStatus.OK).json({ message: "Paid success!" });
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message || e);
  }
}
