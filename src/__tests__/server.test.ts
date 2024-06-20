import request from "supertest";
import server from "../server";
import db from "../config/db";
import { connectDB } from "../server";

describe("GET /api", () => {
  it("Should send back a json response", async () => {
    const response = await request(server).get("/api");

    expect(response.status).toBe(200); // Verifica el estado de la respuesta;
    expect(response.headers["content-type"]).toMatch(/json/); // Que el tipo de respuesta sea de application/json;
    expect(response.body.message).toBe("Desde la API");

    expect(response.status).not.toBe(404); // No nos debe marcar 404;
    expect(response.body.message).not.toBe("desde la api");
  });
});


jest.mock("../config/db");
describe("connectDB", () => {
  it("Should hanlde database connect", async () => {
    jest
      .spyOn(db, "authenticate")
      .mockRejectedValueOnce("Hubo un error al hacer la conexion");
    const consoleSpy = jest.spyOn(console, 'log'); 

    await connectDB(); 

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Hubo un error al hacer la conexion"))
  });
});
