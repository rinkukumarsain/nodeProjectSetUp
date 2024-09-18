
const fs = require('fs');
const { statusCode, resMessage } = require('../config/default.json');


exports.autoSwagger = async (filePath, req, res) => {
    try {
        // Read the JSON file synchronously
        let data;
        try {
            data = fs.readFileSync(filePath, 'utf8');
        } catch (error) {
            if (error.code === 'ENOENT') {
                const defaultContent = JSON.stringify({
                    'swagger': '2.0', 'info': { 'title': 'api-Docs', 'version': '1.0.0' }, 'basePath': '/admin/v1', 'schemas': ['http'], 'paths': {},
                    'definitions': {
                        'errorResponse': {
                            'type': 'object',
                            'properties': {
                                'success': {
                                    'type': 'boolean',
                                    'description': 'success status',
                                    'example': false
                                },
                                'message': {
                                    'type': 'string',
                                    'description': 'something is wrong',
                                    'example': 'something is wrong'
                                }
                            }
                        }
                    }
                }, null, 2);
                fs.writeFileSync(filePath, defaultContent, 'utf8', (writeErr) => {
                    if (writeErr) {
                        console.error(writeErr);
                        return res.status(500).send('Internal Server Error');
                    }
                    data = fs.readFileSync(filePath, 'utf8');
                    // Send the default content as the response
                });

            }
        }

        if (!data) {
            data = fs.readFileSync(filePath, 'utf8');
        }

        // Parse the JSON data
        const adminSwagger = JSON.parse(data);

        // Example operation on the JSON data
        // const url = req.url;
        let url = req.originalUrl.slice(adminSwagger.basePath.length).split('?')[0];

        const method = req.method;
        const { parameters, schemas } = await this.manageParameters(req);

        // Check if the path does not exist and add it if necessary

        if (!adminSwagger.paths) {
            adminSwagger.paths = {};
        }
        const obj = {
            'tags': [url.split('/')[0] ? url.split('/')[0] : url.split('/')[1]],
            'description': `fetch data by ${url}`,
            'produces': ['application/json'],
            'consumes': [req.headers['content-type']]
            // 'parameters': [...parameters],
        };

        if (req.headers?.authorization) {
            obj['security'] = [{ 'BearerAuth': [] }];
            parameters.unshift({
                'name': 'Authorization',
                'in': 'header',
                'description': 'Bearer token',
                'required': true,
                'type': 'string'
            });
        }
        obj['parameters'] = [...parameters];
        adminSwagger.paths[url] = {
            [method.toLowerCase()]: obj
        };
        adminSwagger.paths[url][method.toLowerCase()]['responses'] = {
            '200': {
                'description': 'Successful response',
                'schema': {
                    '$ref': `#/definitions/${url.split('/')[url.split('/').length - 1]}Response`
                }
            },
            '400': {
                'description': 'Bad request',
                'schema': {
                    '$ref': '#/definitions/errorResponse'
                }
            }
        };

        schemas[`${url.split('/')[url.split('/').length - 1]}Response`] = {
            'type': typeof res,
            'properties': {}
        };
        /* ----------if data is arrya then 0 index else only obj----------- */
        // let exampleDataObj = {};
        // if (typeof res.data === 'object') {
        //     if (res.data.length > 0) {
        //         for (const key in res.data[0]) {
        //             exampleDataObj[key] = res.data[key]?.length > 0 && typeof res.data[key] === 'object' ? [res.data[key][0]] : res.data[key];
        //         }
        //     } else {
        //         for (const key in res.data) {
        //             exampleDataObj[key] = res.data[key]?.length > 0 && typeof res.data[key] === 'object' ? [res.data[key][0]] : res.data[key];
        //         }
        //     }
        // }
        /* ----------if data is arrya then 0 index else only obj----------- */

        for (const item of Object.keys(res)) {
            schemas[`${url.split('/')[url.split('/').length - 1]}Response`]['properties'][item] = {
                'type': typeof res[item],
                'description': typeof res[item] === 'object' ? 'Successfully Data' : `${res[item]}`,
                'example': typeof res[item] === 'object' && res[item].length > 0 ? [res[item][0]] : res[item]
            };
        }
        /* ----------if data is arrya then 0 index else only obj----------- */
        // if (typeof res.data === 'object') {
        //     schemas[`${url.split('/')[url.split('/').length - 1]}Response`]['properties']['data']['example'] = res.data.length > 0 ? [exampleDataObj] : exampleDataObj;
        // }
        /* ----------if data is arrya then 0 index else only obj----------- */
        adminSwagger.definitions = { ...adminSwagger.definitions, ...schemas };

        // Save the modified JSON back to the file
        fs.writeFileSync(filePath, JSON.stringify(adminSwagger, null, 2), 'utf8');

        // Return a success message with the modified data
        return {
            statusCode: statusCode.OK,
            success: true,
            message: resMessage.Data_Updated_Successfully,
            data: adminSwagger
        };

    } catch (error) {
        // Handle any errors that occur during the operation
        console.error(error);
        return {
            statusCode: statusCode.BAD_REQUEST,
            success: false,
            message: error.message
        };
    }
};


exports.manageParameters = async (req) => {
    try {
        let returnObj = {
            schemas: {},
            parameters: []
        };



        if (Object.keys(req.body).length > 0 && req.body && req.headers['content-type']) {
            if (req.headers['content-type'] === 'application/json') {
                returnObj.parameters.push({
                    'name': 'Body',
                    'in': 'body',
                    'description': 'please enter code',
                    'required': false,
                    'schema': {
                        '$ref': `#/definitions${req.url}`
                    }
                });

                const schemas = {};
                schemas[req.url.slice(1)] = {
                    'type': 'object',
                    'properties': {}
                };
                for (const kyes of Object.keys(req.body)) {
                    schemas[req.url.slice(1)].properties[kyes] = {
                        'type': typeof req.body[kyes],
                        'description': `Enter ${kyes}`,
                        'example': req.body[kyes]
                    };
                }
                returnObj['schemas'] = { ...returnObj.schemas, ...schemas };
            } else {
                let files = [];
                if (req.file) {
                    files.push(req.file.fieldname);
                } else if (req.file?.length > 0) {
                    for (const item of req.file) {
                        files.push(item.fieldname);
                    }
                }
                for (const kyes of Object.keys(req.body)) {
                    let obj = {
                        'name': kyes,
                        'in': 'formData',
                        'type': files.includes(kyes) ? 'file' : typeof req.body[kyes],
                        'description': `please enter ${kyes}`,
                        'required': false,
                        'example': files.includes(kyes) ? '' : req.body[kyes]
                    };
                    if (typeof req.body[kyes] === 'object' && req.body[kyes].length > 0) {
                        obj['type'] = 'array';
                    }
                    returnObj.parameters.push(obj);
                }
            }
        } else if (Object.keys(req.query).length > 0 && req.query) {
            for (const kyes of Object.keys(req.query)) {
                returnObj.parameters.push({
                    'name': kyes,
                    'in': 'query',
                    'description': `please enter ${kyes}`,
                    'example': req.query[kyes],
                    'required': false
                });
            }
        } else if (Object.keys(req.params).length > 0 && req.params) {
            for (const kyes of Object.keys(req.params)) {
                returnObj.parameters.push({
                    'name': kyes,
                    'in': 'path',
                    'description': `please enter ${kyes}`,
                    'required': false
                });
            }
        }

        return returnObj;
    } catch (error) {
        console.log(error);
        throw error;
    }
};