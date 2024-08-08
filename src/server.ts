import express from "express";
import routerProducts from "./routers/productos";
import colors from "colors";
import cors, {CorsOptions} from 'cors';
import db from "./config/db";
import swaggerUi from 'swagger-ui-express'; 
import swaggerSpec, {swaggerUiOptions} from "./config/swagger";
import morgan from "morgan";

// Base de datos;
export const connectDB = async () => {
  try {
    await db.authenticate(); // Auntenticacion con la base de datos;
    db.sync(); // Sincronizar los cambios de la base de datos;

    console.log(colors.cyan.bold("Conectados con exito a la base de datos"));
  } catch (error) {
    console.log(
      colors.red("Hubo un error al hacer la conexion")
    );
  }
};

connectDB();

// Crear el servidor; 
const server = express();

// CORS;
const corsOptions : CorsOptions = {
  origin: (origin, callback) => {
    if(origin === process.env.CLIENT_URL){
      callback(null, true); // Si hay error, si se permite la conexion;  
    }else{
      callback(new Error('Error CORS'), false);
    }
  }
}

server.use(cors());

// Morgan - info requests HTTP; 
server.use(morgan('dev')); // Tiene varias opciones, como combined, common, short, etc. Cambian los formatos; 
// Esta en este caso devuelve POST /api/v1/products 201 222.925 ms - 176;

// Tratar las respuestas; 
server.use(express.json()); 

// Routing;
server.use("/api/v1/products", routerProducts);

server.get('/api', (req, res) => {
  res.status(200).json({
    message: "Desde la API"
  })
})

// Documentation; 
server.use('/sources', express.static('sources')); // Imagen del header; 
server.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

export default server;