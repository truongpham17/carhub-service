import HTTPStatus from "http-status";

import Bill from "./bill.model";
import Store from "../store/store.model";
import Product from "../product/product.model";

export async function getBillList(req, res) {
  const limit = parseInt(req.query.limit, 0) || 50;
  const skip = parseInt(req.query.skip, 0) || 0;
  const search = req.query.search;
  const customer = req.query.customer;
  try {
    let list = await Bill.list({ skip, limit, search, customer });
    let total = await Bill.count({
      isRemoved: false,
      isReturned: false,
      _id: new RegExp(search, "i"),
      "customer.name": new RegExp(customer, "i")
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

export async function getBillDetail(req, res) {
  try {
    const bill = await Bill.findOne({
      _id: req.params.id,
      isRemoved: false,
      isReturned: false
    }).populate({
      path: "productList.product createdBy",
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

export async function returnToSupplier(req, res) {
  try {
    const { productList, ...rest } = req.body;

    for (let i = 0; i <= productList.length - 1; i++) {
      const item = productList[i];
      const product = await Product.findOne({
        _id: item.product,
        isRemoved: false
      });
      if (!product) {
        throw new Error("Invalid product!");
      }
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

    const bill = await Bill.createBill(
      {
        productList,
        ...rest,
        isReturned: true
      },
      req.user._id
    );
    return res.status(HTTPStatus.CREATED).json(bill);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message || e);
  }
}

export async function createBill(req, res) {
  try {
    const { productList } = req.body;
    /*
    { product: { importPrice: 23, exportPrice: 23 },
    quantity: 23,
    discount: 0,
    isNew: true }


    { product: [Object], quantity: 23, discount: 0, isNew: true }
    */


    const defaultStore = await Store.findOne({isDefault: true});
    let stores = [];
    let products = [];
    for (let i = 0; i < productList.length; i++) {
      let product = {};
      if(productList[i].product.importPrice) {
        product = await Product.findOne({
          importPrice: productList[i].product.importPrice,
          exportPrice: productList[i].product.exportPrice,
          store: defaultStore._id
        })
        productList[i].product = product._id.toString();
      } else {
        product = await Product.findOne({
          _id: productList[i].product,
          isRemoved: false
        });
      }
      console.log(product);
      if (!product) {
        throw new Error("Invalid product!");
      }
      if(product.quantity < productList[i].quantity) {
        throw new Error("Het san pham nay roi, huhu");
      }

        // create new Product
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
    }
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
          // Tìm hàng trả có sẵn
          let returnedProduct = await Product.findOne({
            importPrice: product.importPrice,
            exportPrice: product.exportPrice,
            isReturned: true,
            isRemoved: false
          });
          if (returnedProduct) {
            returnedProduct.quantity += item.quantity;
            returnedProduct.total += item.quantity;
            await returnedProduct.save();
          } else {
            returnedProduct = await Product.createProduct(
              {
                importPrice: product.importPrice,
                exportPrice: product.exportPrice,
                store: product.store,
                quantity: item.quantity,
                total: item.quantity,
                isReturned: true
              },
              req.user._id
            );
          }

          // product.quantity;
          product.total -= item.quantity;
          // await product.save();
          store.productQuantity += item.quantity;
        } else {
          product.quantity -= item.quantity;
          store.productQuantity -= item.quantity;
          // await product.save();
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
    const bill = await Bill.createBill(req.body, req.user._id);
    return res.status(HTTPStatus.CREATED).json(bill);
  } catch (e) {
    console.log(e);
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
