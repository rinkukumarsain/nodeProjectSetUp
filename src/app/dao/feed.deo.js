const { default: mongoose } = require('mongoose');
const devConfig = require('../../config/dev.config');

/**
Function to get post data with MongoDB aggregation pipeline.
@param {Object} query - The query object to filter posts.
@param {string} query.userId - The user ID to filter posts. If provided, filters posts by the specified user.
@param {boolean} query.isCommunityPost - If true, filters posts that are community posts.
@param {number} query.skip - The number of documents to skip in the result set.
@param {number} query.limit - The maximum number of documents to return in the result set.
@param {Object} user - The user object for authentication and authorization.

@returns {Array} - The MongoDB aggregation pipeline.
@throws Will throw an error if there is an issue with the query or the database connection.
 */
exports.getPost = (query, user) => {
    try {
        // Define MongoDB aggregation pipeline
        let filterObj = {};
        let pipeline = [];

        // If userId is provided in the query, filter posts accordingly
        if (query.userId) {
            filterObj['userId'] = new mongoose.Types.ObjectId(query.userId);
        }


        // If isCommunityPost is provided in the query, filter posts accordingly
        if (query.isCommunityPost) {
            filterObj['isCommunityPost'] = Boolean(query.isCommunityPost);
        }

        pipeline.push({ '$match': filterObj });

        // Add a new field 'file' to the documents in the pipeline,
        // which is the concatenation of the devConfig.url and the existing 'file' field
        pipeline.push({ '$addFields': { 'file': { '$concat': [devConfig.url, '$file'] } } });

        // Perform a left outer join with the 'users' collection,
        // using the 'userId' field from the current document and the '_id' field from the 'users' collection
        pipeline.push({
            '$lookup': {
                'from': 'users',
                'let': { 'userId': '$userId' },
                'pipeline': this.userPipeLine(),
                'as': 'userId'
            }
        });

        // Perform a left outer join with the 'feedexpressions' collection,
        // using the '_id' field from the current document and the 'postId' field from the 'feedexpressions' collection
        pipeline.push({
            '$lookup': {
                'from': 'feedexpressions',
                'let': { 'postId': '$_id' },
                'pipeline': this.feedExpressionsPipeLine(user),
                'as': 'feedexpressions'
            }
        });

        // Deconstruct the 'feedexpressions' array field from the input documents to output a document for each element
        pipeline.push({
            '$unwind': {
                'path': '$feedexpressions'
                // 'preserveNullAndEmptyArrays': true
            }
        });

        // Deconstruct the 'userId' array field from the input documents to output a document for each element
        pipeline.push({
            '$unwind': {
                'path': '$userId'
                // 'preserveNullAndEmptyArrays': true
            }
        });

        pipeline.push({ '$sort': { 'createdAt': -1 } });

        pipeline.push({ '$skip': query.skip }, { '$limit': query.limit });

        return pipeline;
    } catch (error) {
        console.log(error);
        // Log the error and return an error response
        return [];
    }
};

/**
 * Function to create a MongoDB aggregation pipeline for user data.
 *
 * @returns {Array} - The MongoDB aggregation pipeline.
 *
 * @throws Will throw an error if there is an issue with the database connection.
 */
exports.userPipeLine = () => {
    try {
        // Define the MongoDB aggregation pipeline
        return [{ '$match': { '$expr': { '$eq': ['$_id', '$$userId'] } } },
        // Project the desired fields from the matched document
        {
            '$project': {
                'userName': 1,
                'firstName': 1,
                'lastName': 1,
                'isStatus': true,
                'profile_image': { '$concat': [devConfig.url, '$profile_image'] }
            }
        }];
    } catch (error) {
        console.log(error);
        // Log the error and return an error response
        return [];
    }
};

/**
 * Function to create a MongoDB aggregation pipeline for feed expressions data.
 *
 * @returns {Array} - The MongoDB aggregation pipeline.
 *
 * @throws Will throw an error if there is an issue with the database connection.
 */
exports.feedExpressionsPipeLine = (user) => {
    try {
        // Initialize the pipeline array
        let pipeline = [];

        // Add a match stage to filter documents where 'postId' matches the '$$postId' variable
        pipeline.push({ '$match': { '$expr': { '$eq': ['$postId', '$$postId'] } } });

        pipeline.push({ '$addFields': { 'isLike': { '$in': [user._id, '$like'] } } });

        // Add a lookup stage to perform a left outer join with the 'users' collection
        // The 'let' option is used to define variables accessible in the pipeline stages
        // The 'pipeline' option is used to specify the pipeline to apply to the 'users' collection
        // The 'as' option is used to specify the output field name
        pipeline.push({
            '$lookup': {
                'from': 'users',
                'let': { 'userId': '$like' },
                'pipeline': [{ '$match': { '$expr': { '$in': ['$_id', '$$userId'] } } }, {
                    '$project': {
                        'userName': 1,
                        'firstName': 1,
                        'lastName': 1,
                        'isStatus': true,
                        'profile_image': { '$concat': [devConfig.url, '$profile_image'] }
                    }
                }],
                'as': 'like'
            }
        });
        // Return the pipeline
        return pipeline;
    } catch (error) {
        console.log(error);
        // Log the error and return an error response
        return [];
    }
};

/**
 * Function to create a MongoDB aggregation pipeline for retrieving user accounts.
 *
 * @param {Object} params - The parameters object.
 * @param {string} params.deviceId - The deviceId to filter user accounts.
 * @param {string} params.userId - The userId to filter user accounts.
 *
 * @returns {Array} - The MongoDB aggregation pipeline.
 *
 * @throws Will throw an error if there is an issue with the query or the database connection.
 */
exports.getAccounts = ({ deviceId, userId }) => {
    try {
        console.log(userId, '-userId');
        // Initialize the pipeline array
        const pipeline = [{ '$match': { 'deviceId': deviceId } }];

        // Add a lookup stage to perform a left outer join with the 'users' collection
        // The 'let' option is used to define variables accessible in the pipeline stages
        // The 'pipeline' option is used to specify the pipeline to apply to the 'users' collection
        // The 'as' option is used to specify the output field name
        pipeline.push({
            '$lookup': {
                'from': 'users',
                'let': { 'userId': '$acounts' },
                'pipeline': [{
                    '$match': {
                        '$expr': { '$in': ['$_id', '$$userId'] }
                    }
                }, {
                    '$project': {
                        'userName': 1,
                        'firstName': 1,
                        'lastName': 1,
                        'isStatus': true,
                        'profile_image': { '$concat': [devConfig.url, '$profile_image'] }
                    }
                }],
                'as': 'acounts'
            }
        });

        // Return the pipeline
        return pipeline;
    } catch (error) {
        console.log(error);
        // Log the error and return an error response
        return [];
    }
};