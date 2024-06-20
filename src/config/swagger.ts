import swaggerJSDoc from 'swagger-jsdoc'; 
import { SwaggerUiOptions } from 'swagger-ui-express';


const options : swaggerJSDoc.Options = {
    swaggerDefinition: {
        openapi: '3.0.2', 
        tags: [
            {
                name: "Products", 
                description: "API operations related to products"
            }
        ], 
        info: {
            title: "REST API Node.js / Express / TypeScript", 
            version: '0.0.1', 
            description: "API Docs for Products"
        }
    }, 
    apis: ['./src/routers/productos.ts']
}

// Especifications; 
const swaggerSpec = swaggerJSDoc(options); 

const swaggerUiOptions : SwaggerUiOptions = {
    customCss: `
        .topbar-wrapper .link {
            content: url('/sources/doc-icon.svg'); 
            height: 120px; 
            width: auto; 
        }

        .swagger-ui .topbar{
            background-color: #2b3b45; 
        }
    `,

    customSiteTitle: "Documentation Inventory"
}

export default swaggerSpec;
export {
    swaggerUiOptions
}