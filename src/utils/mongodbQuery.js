/**
 * Execute an aggregation query on a Mongoose model.
 *
 * @param {model} model - The Mongoose model to perform the aggregation on.
 * @param {Array} pipeline - The aggregation pipeline containing stages.
 * @returns {Promise<Array>} - A promise that resolves to the result of the aggregation query.
 * @throws {Error} If an error occurs during the aggregation process.
 */
const aggregation = async (model, pipeline) => {
    try {
        return await model.aggregate(pipeline, { maxTimeMS: 60000, allowDiskUse: true });
    } catch (error) {
        console.log('Error during aggregation:', error);
        throw error; // Re-throw the error for handling at a higher level if necessary.
    }
};

/**
 * Find a single document in the specified model.
 *
 * @param {model} model - The Mongoose model to query.
 * @param {object} query - The query conditions.
 * @param {object} [filter={}] - The fields to include or exclude from the result.
 * @param {object} [options={}] - Additional query options.
 * @returns {Promise<object|null>} - A promise that resolves to the found document or null if not found.
 * @throws {Error} If an error occurs during the query.
 */
const findOne = async (model, query, filter = {}, options = {}) => {
    try {

        return await model.findOne(query, filter, options).lean();
    } catch (error) {
        console.error('Error during findOne:', error);
        throw error; // Re-throw the error for handling at a higher level if necessary.
    }
};

/**
 * Find a single document in the specified model by id.
 *
 * @param {model} model - The Mongoose model to query.
 * @param {object} id - The id of collection.
 * @returns {Promise<object|null>} - A promise that resolves to the found document or null if not found.
 * @throws {Error} If an error occurs during the query.
 */
const findById = async (model, id, options = {}) => {
    try {
        return await model.findById(id, options);
    } catch (error) {
        console.error('Error during findById:', error);
        throw error; // Re-throw the error for handling at a higher level if necessary.
    }
};

/**
 * save a single document in the specified model.
 *
 * @param {model} model - The Mongoose model to query.
 * @param {object} data - The data of collection.
 * @returns {Promise<object|null>} - A promise that resolves to the found document or null if not found.
 * @throws {Error} If an error occurs during the query.
 */
const create = async (model, data) => {
    try {
        return await model.create(data);
    } catch (error) {
        console.error('Error during create:', error);
        throw error; // Re-throw the error for handling at a higher level if necessary.
    }
};

/**
 * Find a all documents in the specified model.
 *
 * @param {model} model - The Mongoose model to query.
 * @param {object} [query={}] - The query conditions.
 * @param {object} [filter={}] - The fields to include or exclude from the result.
 * @param {object} [options={}] - Additional query options.
 * @returns {Promise<object|null>} - A promise that resolves to the found document or null if not found.
 * @throws {Error} If an error occurs during the query.
 */
const find = async (model, query = {}, filter = {}, options = {}) => {
    try {
        return await model.find(query, filter, options);
    } catch (error) {
        console.error('Error during find:', error);
        throw error; // Re-throw the error for handling at a higher level if necessary.
    }
};

/**
 * Find a all documents in the specified model.
 *
 * @param {model} model - The Mongoose model to query.
 * @param {object} [query={}] - The query conditions.
 * @param {object} [filter={}] - The fields to include or exclude from the result.
 * @param {object} [options={}] - Additional query options.
 * @returns {Promise<object|null>} - A promise that resolves to the found document or null if not found.
 * @throws {Error} If an error occurs during the query.
 */
const findByIdAndUpdate = async (model, query = {}, data = {}, options = {}) => {
    try {
        return await model.findByIdAndUpdate(query, data, options);
    } catch (error) {
        console.error('Error during findByIdAndUpdate:', error);
        throw error; // Re-throw the error for handling at a higher level if necessary.
    }
};

/**
 * Update a single document in the specified model based on a query.
 *
 * @param {model} model - The Mongoose model to query.
 * @param {object} [query={}] - The query conditions. By default, it is an empty object.
 * @param {object} data - The data to update the document with.
 * @param {object} [options={}] - Additional query options.
 * @returns {Promise<object|null>} - A promise that resolves to the updated document or null if not found.
 * @throws {Error} If an error occurs during the update.
 */
const findOneAndUpdate = async (model, query = {}, data = {}, options = {}) => {
    try {
        return await model.findOneAndUpdate(query, data, options);
    } catch (error) {
        console.error('Error during findOneAndUpdate:', error);
        throw error; // Re-throw the error for handling at a higher level if necessary.
    }
};

/**
 * Delete a single document in the specified model by id.
 *
 * @param {model} model - The Mongoose model to query.
 * @param {object} [query={}] - The query conditions. By default, it is an empty object.
 * @returns {Promise<object|null>} - A promise that resolves to the deleted document or null if not found.
 * @throws {Error} If an error occurs during the deletion.
 */
const findByIdAndDelete = async (model, query = {}) => {
    try {
        return await model.findByIdAndDelete(query);
    } catch (error) {
        console.error('Error during findByIdAndUpdate:', error);
        throw error; // Re-throw the error for handling at a higher level if necessary.
    }
};

/**
 * Query utility functions.
 */
exports.dbQuery = {
    aggregation,
    findOne,
    findById,
    create,
    find,
    findByIdAndUpdate,
    findByIdAndDelete,
    findOneAndUpdate
};