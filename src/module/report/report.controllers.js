import HTTPStatus from 'http-status';
import moment from 'moment';

import Bill from '../bill/bill.model';
import Store from '../store/store.model';
import { getMonthsInRange } from '../../utils/time';

export async function report(req, res) {
  const { start, end } = req.query;
  const months = getMonthsInRange(start, end);
  try {
    const list = await Bill.find({
      isRemoved: false,
      isReturned: false,
      createdAt: {
        "$gte": moment(start).startOf('day').toDate(),
        "$lte": moment(end).endOf('day').toDate(),
      },
    }).populate({
      path: 'productList.product',
      populate: {
        path: 'store',
      },
    });
    let totalSoldMoney = 0;
    list.forEach(item => {
      item.productList.forEach(prod => {
        totalSoldMoney += (prod.product.exportPrice - prod.discount) * prod.quantity;
      })
    })
    const billCount = await Bill.count({ isRemoved: false });

    const reportByTime = await Promise.all(months.map(async month => {
      const billList = await Bill.find({
        isReturned: false,
        isRemoved: false,
        createdAt: {
          "$gte": moment(month, 'MM/YYYY').startOf('month').toDate(),
          "$lte": moment(month, 'MM/YYYY').endOf('month').toDate(),
        },
      }).populate('productList.product');
      let monthSoldMoney = 0;
      billList.forEach(item => {
        item.productList.forEach(prod => {
          monthSoldMoney += (prod.product.exportPrice - prod.discount) * prod.quantity;
        })
      })
      return {
        time: month,
        total: monthSoldMoney,
      };
    }))

    let reportByStore = [];
    list.forEach(item => {
      let soldMoney = 0;
      item.productList.forEach(prod => {
        const soldMoney = (prod.product.exportPrice - prod.discount) * prod.quantity;
        if (reportByStore.find(i => i.store._id === prod.product.store._id)) {
          reportByStore = reportByStore.map(rp => rp.store._id === prod.product.store._id
            ? { ...rp, total: rp.total + soldMoney }
            : rp);
        } else {
          reportByStore.push({
            store: prod.product.store,
            total: soldMoney,
          })
        }
      })
    })

    return res.status(HTTPStatus.OK).json({
      // list,
      billCount,
      reportByTime,
      reportByStore,
      totalSoldMoney,
    });
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message || e);
  }
}
