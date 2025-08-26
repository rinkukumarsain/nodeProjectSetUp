const express = require('express');
const swaggerUi = require('swagger-ui-express');
const appSwagger = require('../../swagger/appSwagger.json');
const router = express.Router();
// Merge userSwagger with the default structure
const mergedSwaggerDocs = {
    ...appSwagger,
    paths: {
        ...appSwagger,
    },
    definitions: {
        ...appSwagger,
    }
};

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(mergedSwaggerDocs));

module.exports = router;