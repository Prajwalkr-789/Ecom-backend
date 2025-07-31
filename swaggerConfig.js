// swaggerConfig.js
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My E-commerce API',
      version: '1.0.0',
      description: `API documentation for the E-commerce backend## 🔐 Authentication Instructions
  
  1. Register or login using **/auth/register** or **/auth/login**.
  2. Copy the **token** from the response.
  3. Click the 🔒 **Authorize** button at the top.
  4. Paste the token to test routes as **admin** or **customer**.
  5. **Use the admin token to try out the endpoints of Products and Categories, customer token to try out the endpoints of Order and Cart**.
  `,
    },
    servers: [
      {
        url: 'https://ecom-backend-5emk.onrender.com/api', 
      },
    ],
     components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
     security: [
      {
        bearerAuth: []
      }
    ]
  },
  
  apis: ['./Routes/*.js', './controllers/*.js'], 
//   apis: ['./routes/*.js', './controllers/*.js'], 
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
