/**
 * Models
 */
const { Product } = require('../models');

/**
 * createProductModule
 */
const createProductModule = (app, ...middlewares) => {

  /**
   * Create product
   */
  app.post('/product/create', middlewares, async (req, res) => {

    await Product.sync();

    const { body } = req;

    const productToCreate = await Product.create({
      ...body,
    });

    console.log(`[balcony-api] /product/create:`, productToCreate);

    return res.status(200).json({
      success: true,
      data: productToCreate,
    });
  });

  /**
   * Create product
   */
  app.put('/product/edit', middlewares, async (req, res) => {

    await Product.sync();

    const { body } = req;

    const productToEdit = await Product.update({
      ...body,
    }, {
      where: {
        id: body.id,
      },
    });

    console.log(`[balcony-api] /product/create:`, productToEdit);

    return res.status(200).json({
      success: true,
      data: productToEdit,
    });
  });

  /**
   * List products
   */
  app.get('/product/list', async (req, res) => {

    await Product.sync();

    const productList = await Product.findAll({
      raw: true,
      nest: true,
    });

    console.log(`[balcony-api] /product/list:`, productList);

    return res.status(200).json({
      success: true,
      data: productList,
    });
  });

  /**
   * Delete product
   */
  app.delete('/product/delete', middlewares, async (req, res) => {

    await Product.sync();

    const { body } = req;

    const productToDestroy = await Product.destroy({
      where: {
        id: body.id,
      }
    });

    console.log(`[balcony-api] /product/delete:`, productToDestroy);

    return res.status(200).json({
      success: true,
    });
  });
};

/**
 * Export
 */
module.exports = createProductModule;
