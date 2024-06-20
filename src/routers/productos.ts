import { Router } from "express";
import {
  Products,
  CreateProduct,
  getProductById,
  updateProduct,
  updateAvaibility,
  deleteProduct,
} from "../controllers/products";
import { body, param } from "express-validator";
import { ProductMiddleware } from "../middleware/products";

const routerProducts = Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    Product:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          descrition: Product ID
 *          example: 1
 *        name:
 *          type: string
 *          description: Product name
 *          example: CPU
 *        price:
 *          type: number
 *          description: Product price
 *          example: 500
 *        available:
 *          type: boolean
 *          description: Product availability
 *          example: true
 */

/**
 * 
 * @swagger
 * /api/v1/products: 
 *  get: 
 *    summary: Get a product list
 *    tags: 
 *      - Products
 *    description: Return a list of products
 *    responses: 
 *      200: 
 *        description: Successful response
 *        content: 
 *          application/json: 
 *            schema: 
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Product'
 */

routerProducts.get("/", Products);

/**
 * @swagger
 * /api/v1/products/{id}:
 *  get: 
 *    summary: Get a product by ID
 *    tags: 
 *      - Products
 *    description: Return a product based on its unique ID
 *    parameters:
 *      - in: path 
 *        name: id
 *        description: ID of the product retrieve
 *        required: true
 *        schema: 
 *          type: integer
 *    responses: 
 *      200:
 *        description: Successful Response
 *        content: 
 *          application/json: 
 *            schema: 
 *              $ref: '#/components/schemas/Product'
 *      404:
 *        description: Not found 
 *      400:
 *        description: Bad Request, invalid ID
 */

routerProducts.get(
  "/:id",
  param("id")
    .notEmpty()
    .withMessage("Parametro incorrecto")
    .isNumeric()
    .withMessage("Parametro incorrecto"),
  ProductMiddleware,
  getProductById
);


/**
 * @swagger
 * /api/v1/products:
 *  post: 
 *    summary: Creates a new product
 *    tags: 
 *      - Products
 *    description: Returns a new record in the database
 *    requestBody: 
 *      required: true
 *      content: 
 *        application/json: 
 *          schema: 
 *            type: object
 *            properties: 
 *              name: 
 *                type: string
 *                example: CPU
 *              price: 
 *                type: number
 *                example: 300
 *    responses: 
 *      201:  
 *        description: Product created Successfully
 *        content: 
 *          application/json: 
 *            schema: 
 *              $ref: '#/components/shemas/Product'
 *      400:  
 *        description: Bad request - invalid data
 */

// Segunda forma de hacer validaciones;
routerProducts.post(
  "/",
  body("name").notEmpty().withMessage("El campo del nombre no puede ser nulo"),
  body("price")
    .isNumeric()
    .withMessage("Entrada no valida")
    .custom((value) => value > 0)
    .withMessage("Entrada no valida")
    .notEmpty()
    .withMessage("El campo del precio no puede ser nulo"),
  ProductMiddleware,
  CreateProduct
);

/**
 * 
 * @swagger 
 * /api/v1/products/{id}: 
 *  put: 
 *    summary: "Updates product with a user input"
 *    tags: 
 *      - Products
 *    description: Return the updated product
 *    parameters: 
 *      - in: path
 *        name: id
 *        description: The Product ID
 *        required: true
 *        schema: 
 *          type: integer
 *    requestBody: 
 *      required: true
 *      content: 
 *        application/json: 
 *          schema: 
 *            type: object
 *            properties: 
 *              name:
 *                type: string
 *                example: Monitor curvo
 *              price: 
 *                type: number
 *                example: 200
 *              available: 
 *                type: boolean
 *                example: true
 *    responses: 
 *      200: 
 *        description: Successfull response
 *        content: 
 *          application/json: 
 *            schema: 
 *              $ref: '#/components/shemas/Product'
 *      400: 
 *        description: Bad request - Invalid input data
 *      404: 
 *        description: Not Found
 */

routerProducts.put(
  "/:id",
  body("price")
    .isNumeric()
    .withMessage("Entrada no valida")
    .custom((value) => value > 0)
    .withMessage("Entrada no valida"),
  body("available").isBoolean().withMessage("Entrada no valida"),
  param("id")
    .notEmpty()
    .withMessage("Parametro incorrecto")
    .isNumeric()
    .withMessage("Parametro incorrecto"),
  ProductMiddleware,
  updateProduct
);

/**
 * 
 * @swagger
 * /api/v1/products/{id}: 
 *  patch: 
 *    summary: Updated product availability
 *    tags: 
 *      - Products
 *    description: Return the updated availability
 *    parameters: 
 *      - in: path
 *        name: id
 *        required: true
 *        schema: 
 *          type: integer
 *    responses: 
 *      200: 
 *        description: Updated succesfully
 *        content: 
 *          application/json: 
 *            schema: 
 *              $ref: '#/components/shemas/Product'
 *      404:  
 *        description: Not Found
 */

routerProducts.patch(
  "/:id",
  param("id")
    .notEmpty()
    .withMessage("Parametro incorrecto")
    .isNumeric()
    .withMessage("Parametro incorrecto"),
  ProductMiddleware,
  updateAvaibility
);


/**
 * @swagger
 * /api/v1/products/{id}:
 *  delete: 
 *    summary: Delete an existing product
 *    tags: 
 *      - Products
 *    description: Return a successfully message
 *    parameters: 
 *      - in: path
 *        name: id
 *        required: true
 *        content: 
 *          $ref: '#/components/schemas/Product'
 *    responses: 
 *      200: 
 *        description: Deleted product succesfully
 *        content: 
 *          application/json: 
 *            schema: 
 *              type: string
 *              value: 'Producto eliminado'
 *      404: 
 *        description: Not found
 */


routerProducts.delete(
  "/:id",
  param("id")
    .notEmpty()
    .withMessage("Parametro incorrecto")
    .isNumeric()
    .withMessage("Parametro incorrecto"),
  ProductMiddleware,
  deleteProduct
);
export default routerProducts;
