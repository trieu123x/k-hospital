import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'

const PORT = process.env.PORT || 3000

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MediCare Backend API Documentation',
      version: '1.0.0',
      description: 'Tai lieu API cho he thong quan ly benh vien MediCare',
    },
    servers: [{ url: `http://localhost:${PORT}`, description: 'Development server' }],
  },
  apis: [
    './src/docs/swagger-component.yaml',
    './src/docs/paths/*.yaml'
  ],
}

const specs = swaggerJsdoc(options)

export const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))
  console.log(`Docs available at http://localhost:${PORT}/api-docs`)
}
