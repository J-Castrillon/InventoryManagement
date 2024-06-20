import { Request, Response } from "express";
import Product from "../models/Products.model";

// Get Products;
export const Products = async (req: Request, res: Response) => {
  // const products = await Product.findAll({
  //     order: [
  //         ['price','DESC']
  //     ],
  //     limit: 2,
  //     attributes: {exclude: ['createdAt', 'updatedAt']} // Excluir algunos datos;
  // });

  const products = await Product.findAll({
    order: [["price", "DESC"]],
  });

  if (products) {
    return res.status(200).json({
      status: "Success",
      products,
    });
  }
};

// Get one;
export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await Product.findByPk(id);

  if (product) {
    return res.status(200).json({
      status: "Success",
      product,
    });
  } else {
    return res.status(404).json({
      status: "Error",
      message: "Producto no encontrado",
    });
  }
};

// Create product;
export const CreateProduct = async (req: Request, res: Response) => {
  const body = req.body;

  // Validacion - Primera forma;
  //   await check("name")
  //     .notEmpty()
  //     .withMessage("El campo del nombre no puede ser nulo")
  //     .run(req);
  //   await check("price")
  //     .isNumeric()
  //     .withMessage("Valor no valido")
  //     .custom((value) => value > 0)
  //     .withMessage("Valor no valido")
  //     .notEmpty()
  //     .withMessage("El campo del precio no puede ser nulo")
  //     .run(req);

  // Todo esto va al middleware;
  //   const errors = validationResult(req);

  //   if (!errors.isEmpty()) {
  //     return res.status(400).json({
  //       status: "Error",
  //       errors: errors.array(),
  //     });
  //   }

  const created = await Product.create(req.body);

  if (created) {
    res.status(201).json({
      status: "Success",
      product: created,
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await Product.findByPk(id);

  if (product) {
    const updated = await product.update(req.body);

    if (updated) {
      return res.status(200).json({
        status: "Success",
        product,
      });
    }
  } else {
    return res.status(404).json({
      status: "Error",
      message: "Producto no encontrado",
    });
  }
};

export const updateAvaibility = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await Product.findByPk(id);

  if (product) {
    product.available = !product.available;
    const updated = product.save();

    if (updated) {
      return res.status(200).json({
        status: "Success",
        product,
      });
    }
  }
};

// Delete;
export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  const product = await Product.findByPk(id);

  if (product) {
    await product.destroy();

    return res.status(200).json({
      status: "Success",
      message: "Producto eliminado",
    });
  } else {
    return res.status(404).json({
      status: "Error",
      message: "Producto no encontrado",
    });
  }
};
