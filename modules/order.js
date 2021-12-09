/**
 * Models
 */
const { Product, Order, OrderProduct } = require('../models');

/**
 * createOrderModule
 */
const createOrderModule = (app, ...middlewares) => {

  /**
   * Create order
   */
  app.post('/order/create', middlewares, async (req, res) => {

    await Order.sync();
    await OrderProduct.sync();

    const { body } = req;

    let _order = { ...body };
    if (_order.products) {
      delete _order.products;
    }

    let _products = { ...body }.products || [];

    const orderToCreate = await Order.create({
      ..._order,
    });

    if (orderToCreate.id) {
      
      for (let product in _products) {

        product = JSON.parse(_products[product]);

        const orderProductToCreate = await OrderProduct.create({
          orderId: orderToCreate.id,
          productId: product.id,
        });

        console.log(orderProductToCreate);
      }
    }

    console.log(`[balcony-api] /order/create:`, orderToCreate);

    return res.status(200).json({
      success: true,
      data: orderToCreate,
    });
  });

  /**
   * List orders
   */
  app.get('/order/list', async (req, res) => {

    await Order.sync();

    const orderList = await Order.findAll({
      raw: true,
      nest: true,
    });

    console.log(`[balcony-api] /order/list:`, orderList);

    return res.status(200).json({
      success: true,
      data: orderList,
    });
  });

  /**
   * List order products
   */
  app.get('/order/products', async (req, res) => {

    await Product.sync();
    await OrderProduct.sync();

    const orderProductsList = await OrderProduct.findAll({
      raw: true,
      nest: true,
      where: {
        orderId: req.query.orderId,
      },
    });

    let products = [];

    for (let orderProductIndex in orderProductsList) {

      const product = await Product.findOne({
        where: {
          id: orderProductsList[orderProductIndex].productId,
        },
      });

      products = [...products, product];
    }

    console.log(`[balcony-api] /order/products:`, products);

    return res.status(200).json({
      success: true,
      data: products,
    });
  });
};

/**
 * Export
 */
module.exports = createOrderModule;
