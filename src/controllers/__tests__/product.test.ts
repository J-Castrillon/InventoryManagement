import request from "supertest";
import server from "../../server";

describe("POST /api/v1/products", () => {
  it("Should validate that the price is greater than 0", async () => {
    const response = await request(server).post("/api/v1/products").send({
      name: "Memoria",
      price: "text",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(2); // La validación nos devuelve dos objetos;

    expect(response.status).not.toBe(404);
    expect(response.body.errors).not.toHaveLength(1);
  });

  it("Should validate that the price is greater than 0", async () => {
    const response = await request(server).post("/api/v1/products").send({
      name: "Memoria",
      price: 0,
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);

    expect(response.status).not.toBe(404);
    expect(response.body.errors).not.toHaveLength(2);
  });

  it("Should display validation errors", async () => {
    const response = await request(server).post("/api/v1/products").send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(4); // elementos validados;

    expect(response.status).not.toBe(404);
    expect(response.body.errors).not.toHaveLength(2);
  });

  it("Should create a new product", async () => {
    const response = await request(server).post("/api/v1/products").send({
      name: "Mouse test",
      price: 50,
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("product"); // Que exista la propiedad de products;

    expect(response.status).not.toBe(404);
    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty("errors");
  });
});

describe("GET /api/v1/products", () => {
  it("Should check if /api/v1/products exist", async () => {
    const response = await request(server).get("/api/v1/products");

    expect(response.status).not.toBe(404);
  });

  it("GET a JSON response with products", async () => {
    const response = await request(server).get("/api/v1/products");

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toHaveProperty("products");

    expect(response.status).not.toBe(404);
    expect(response.body).not.toHaveProperty("errors");
  });
});

describe("GET /api/v1/products/:id", () => {
  it("Should return a 404 response for a non-existent product", async () => {
    const productId = 3000;
    const response = await request(server).get(`/api/v1/products/${productId}`);

    expect(response.status).toBe(404);
    expect(response.body.status).toBe("Error");

    expect(response.status).not.toBe(200);
  });

  it("Should check a valid ID in the URL", async () => {
    const response = await request(server).get(
      "/api/v1/products/not-valid-url"
    );
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe("Parametro incorrecto");
  });

  it("Get a JSON response for a single product", async () => {
    const response = await request(server).get("/api/v1/products/1");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("product");
    expect(response.body).not.toHaveProperty("errors");
  });
});

describe("PUT /api/v1/products/:id", () => {
  it("Should check a valid ID in the URL", async () => {
    const response = await request(server)
      .put("/api/v1/products/not-valid-url")
      .send({
        name: "Monitor",
        price: 200,
        available: true,
      });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe("Parametro incorrecto");
  });

  it("Should display validation error messages when updating a product", async () => {
    const response = await request(server).put("/api/v1/products/1").send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toBeTruthy(); // Es lo mismo que la funcion anterior;
    expect(response.body.errors).toHaveLength(3);

    expect(response.status).not.toBe(200);
    expect(response.body.product).not.toBeTruthy();
  });

  it("Should validate that the price is greater than 0", async () => {
    const response = await request(server).put("/api/v1/products/1").send({
      name: "Monitor",
      price: 0,
      available: true,
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toBeTruthy(); // Es lo mismo que la funcion anterior;
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe("Entrada no valida");

    expect(response.status).not.toBe(200);
    expect(response.body.product).not.toBeTruthy();
  });

  it("Should return a 404 response for a non-existent product", async () => {
    const productId = 2000;

    const response = await request(server)
      .put(`/api/v1/products/${productId}`)
      .send({
        name: "Monitor",
        price: 20,
        available: true,
      });

    expect(response.status).toBe(404);
    expect(response.body.status).toBe("Error");
    expect(response.body.message).toBe("Producto no encontrado");

    expect(response.status).not.toBe(200);
    expect(response.body.product).not.toBeTruthy();
  });

  it("Update an existing product with valid data", async () => {
    const response = await request(server).put("/api/v1/products/1").send({
      name: "Monitor",
      price: 20,
      available: true,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("product");

    expect(response.status).not.toBe(404);
    expect(response.body.error).not.toBeTruthy();
  });
});

describe("PATCH /api/v1/products/:id", () => {
  it("Should check a valid ID in the URL", async () => {
    const response = await request(server)
      .patch("/api/v1/products/not-valid-url")
      .send({
        name: "Monitor",
        price: 200,
        available: true,
      });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe("Parametro incorrecto");
  });

  it("Should update the product availability", async () => {
    const response = await request(server).patch("/api/v1/products/1");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("product");
    expect(response.body.product.available).toBe(false);

    expect(response.status).not.toBe(404);
    expect(response.status).not.toBe(400);
    expect(response.body).not.toHaveProperty("errors");
  });
});

describe("DELETE /api/v1/products/:id", () => {
  it("Should check a valid ID in the URL", async () => {
    const response = await request(server).delete(
      "/api/v1/products/not-valid-url"
    );
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe("Parametro incorrecto");
  });

  it("Should return a 404 response for a non-existen product", async () => {
    const productId = 2000;
    const response = await request(server).delete(
      `/api/v1/products/${productId}`
    );
    expect(response.status).toBe(404);
    expect(response.body.status).toBe("Error");
    expect(response.body.message).toBe("Producto no encontrado");
  });

  it("Should delete an existing product", async () => {
    const response = await request(server).delete("/api/v1/products/1");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Producto eliminado");

    expect(response.status).not.toBe(404);
    expect(response.status).not.toBe(400);
  });
});
