const { default: mongoose } = require('mongoose');
const { userPipeLine } = require('./feed.deo');
const devConfig = require('../../config/dev.config');

/**
 * This function generates a MongoDB aggregation pipeline for fetching community data.
 *
 * @param {Object} query - The query object containing filter parameters.
 * @param {string} query.search - A search string to filter community names.
 * @param {string} query.categoryId - The ID of the category to filter communities.
 * @param {Array} communityIdArr - An array of community IDs to filter communities.
 *
 * @returns {Array} - An array of MongoDB aggregation pipeline stages.
 *
 * @throws Will throw an error if there is an issue with the pipeline stages.
 */


exports.getCommunity = (query, communityIdArr) => {
    try {
        // Define MongoDB aggregation pipeline and filter object
        let pipeline = [];
        let filterObj = {};

        // If there are query parameters, initialize the $or array
        if (query && Object.keys(query).length > 0) {
            filterObj['$or'] = [];
        }


        // If search parameter is provided, add a regex match stage to the pipeline
        if (query?.search) {
            filterObj['$or'].push({ 'name': { '$regex': query.search, '$options': 'i' } });
        }

        // If communityIdArr is not empty, add a match stage to the pipeline
        if (communityIdArr.length > 0) {
            filterObj['$or'].push({ '_id': { '$in': communityIdArr } });
        }

        // If categoryId parameter is provided, add a match stage to the pipeline
        if (query?.categoryId) {
            filterObj.category = new mongoose.Types.ObjectId(query.categoryId);
        }

        // Check if $or array is empty and remove it if so
        if (filterObj['$or']?.length === 0) {
            delete filterObj['$or'];
        }


        // Add match stage to the pipeline
        if (Object.keys(filterObj).length > 0) {
            pipeline.push({ '$match': filterObj });
        }


        // Perform an outer join with the 'users' collection,
        // using the 'createdBy' field from the current document and the '_id' field from the 'users' collection
        pipeline.push({
            '$lookup': {
                'from': 'users',
                'let': { 'userId': '$createdBy' },
                'pipeline': userPipeLine(),
                'as': 'createdBy'
            }
        });

        // Unwind the 'created_by' array field from the input documents to output a document for each element
        pipeline.push({
            '$unwind': {
                'path': '$createdBy',
                'preserveNullAndEmptyArrays': true
            }
        });

        // Perform an outer join with the 'users' collection for team members,
        // using the 'teamMembers' field from the current document and the '_id' field from the 'users' collection
        pipeline.push({
            '$lookup': {
                'from': 'users',
                'let': { 'userId': '$teamMembers' },
                'pipeline': [{ '$match': { '$expr': { '$in': ['$_id', '$$userId'] } } }, {
                    '$project': {
                        'userName': 1,
                        'firstName': 1,
                        'lastName': 1,
                        'isStatus': true,
                        'profile_image': { '$concat': [devConfig.url, '$profile_image'] }
                    }
                }],
                'as': 'teamMembers'
            }
        });

        return pipeline;
    } catch (error) {
        console.log(error);
        // Log the error and return an error response
        return [];
    }
};
