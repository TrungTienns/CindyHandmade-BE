const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'KnitWorkShop API',
            version: '1.0.0',
            description: 'API Documentation for KnitWorkShop Backend',
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 8080}`,
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.js'], 
};

const specs = swaggerJsDoc(options);

module.exports = {
    swaggerUi,
    specs,
};
