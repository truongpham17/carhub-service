import HTTPStatus from "http-status";

import Bill from "./bill.model";
import Store from "../store/store.model";
import Product from "../product/product.model";
import Customer from '../customer/customer.model';

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

    // console.log(req.body);
    const defaultStore = await Store.findOne({isDefault: true});
    const productProcess = [];

    // add field customer for bill
    // if new customer -> create one
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

    for(let i = 0; i < productList.length; i++ ) {
      const productItem = productList[i];

      let store = await Store.findById({_id: productItem.store.storeId});
      // if(!store) {
      //   store = defaultStore;
      // }

      let productDB = await Product.findOne({
        exportPrice: productItem.exportPrice,
        store: productItem.store.storeId,
      })

      // neu khong tim duoc san pham, create new
      if(!productDB) {
        // ban hang
        if(!productItem.isReturned) {
          console.log("ban hang - khong ton tai hang");
          productDB = await Product.createProduct({
            importPrice: productItem.exportPrice - 20,
            exportPrice: productItem.exportPrice,
            quantity: 0,
            total: productItem.quantity,
            store: productItem.store.storeId
          });
          store.totalImportProduct += productItem.quantity;
          await store.save();
        } else {
          // tra hang
          console.log("tra hang - khong ton tai hang")
          productDB = await Product.createProduct({
            importPrice: productItem.exportPrice - 20,
            exportPrice: productItem.exportPrice,
            quantity: productItem.quantity,
            total: productItem.quantity,
            store: productItem.store.storeId
          });
          store.totalImportProduct += productItem.quantity;
          store.productQuantity += productItem.quantity;
          await store.save();
        }
      } else {
        // ton tai product
        // ban hang
        if(!productItem.isReturned) {
          const delta = productDB.quantity  - productItem.quantity;
          // con hang
          if(delta >= 0) {
            console.log("co san pham - ban hang - con hang")
            productDB.quantity -= productItem.quantity;
            store.productQuantity -= productItem.quantity
            await store.save();
            await productDB.save();
          } else {
            // khong con hang
            console.log("co san pham - ban hang - thieu hang")
            store.productQuantity -= productDB.quantity;
            store.totalImportProduct -= delta;
            productDB.quantity = 0;
            productDB.total -= delta;
            await store.save();
            productDB.save();
          }
        } else {
          // tra hang
          const delta = productDB.total - productDB.quantity - productItem.quantity;
          //du so luong
          if(delta >= 0) {
            console.log(" co san pham - tra hang - du hang");
            productDB.quantity += productItem.quantity;
            store.productQuantity += productItem.quantity
            await productDB.save();
            await store.save();
          } else {
            // khong du so luong
            console.log(" co san pham - tra hang - khong du hang")
            productDB.quantity += productItem.quantity;
            productDB.total -= delta;
            store.productQuantity += productItem.quantity;
            store.totalImportProduct -= delta;
            await productDB.save();
            await store.save();
          }
        }

      }
      productProcess.push(productDB);
      totalQuantity += productItem.quantity * (productItem.isReturned ? -1 : 1);
      totalPrice += productItem.quantity * (productItem.exportPrice - (productItem.discount || 0)) * (productItem.isReturned ? -1 : 1);
      saveList.push({
        product: productDB,
        quantity: productItem.quantity,
        discount: productItem.discount || 0,
        isReturned: productItem.isReturned
      });
    }
    totalPaid = totalPrice - debt;
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