const { default: mongoose } = require('mongoose');
const devConfig = require('../../config/dev.config');
const { userPipeLine } = require('./feed.deo');

/**
 * This function generates a MongoDB aggregation pipeline for fetching tournament data.
 *
 * @param {Object} query - The query object containing filter parameters.
 * @param {string} query.search - A search string to filter tournament titles.
 * @param {string} query.gameId - The ID of the game to filter tournaments.
 * @param {Array} tournamentIdArr - An array of tournament IDs to filter tournaments.
 * @param {Object} options - Additional options for the pipeline.
 * @param {Array} options.archived - An array containing archived tournament IDs.
 *
 * @returns {Array} - An array of MongoDB aggregation pipeline stages.
 *
 * @throws Will throw an error if there is an issue with the pipeline stages.
 *
 * @example
 * const tournamentPipeline = exports.getTournament({ search: 'example', gameId: '12345' }, ['1', '2', '3'], { archived: ['4', '5'] });
 * // tournamentPipeline will be an array of MongoDB aggregation pipeline stages
 */
exports.getTournament = (query, tournamentIdArr, { archived }) => {
    try {
        // Define MongoDB aggregation pipeline and filter obj
        let pipeline = [];
        let filterObj = {};
        if (query.search || tournamentIdArr.length > 0) {
            filterObj['$or'] = [];
        }

        // If search parameter is provided, add a regex match stage to the pipeline
        if (query?.search) {
            filterObj['$or'].push({ 'title': { '$regex': query.search, '$options': 'i' } });
        }

        // If tournamentIdArr is not empty, add a match stage to the pipeline
        if (tournamentIdArr.length > 0) {
            filterObj['$or'].push({ '_id': { '$in': tournamentIdArr } });
        }

        // If gameId parameter is provided, add a match stage to the pipeline
        if (query?.gameId) {
            filterObj.gameId = new mongoose.Types.ObjectId(query.gameId);
        }

        // If type parameter is provided and equals 'archive', add a match stage to the pipeline
        if (query.type === 'archive') {
            filterObj.archived = true;
        }

        // Add a new field 'coverImage' to the documents in the pipeline,
        // which is the concatenation of the devConfig.url and the existing 'coverImage' field
        pipeline.push({
            '$addFields': {
                'coverImage': { '$concat': [devConfig.url, '$coverImage'] },
                'prizePool.bookSlots': '20',               /* bookSlots is stattic now  */
                'archived': { '$in': ['$_id', archived?.tournamentId ? archived.tournamentId : []] }
            }
        });

        // Add match stage to the pipeline
        pipeline.push({ '$match': filterObj });

        // Perform a outer join with the 'users' collection,
        // using the 'userId' field from the current document and the '_id' field from the 'users' collection
        pipeline.push({
            '$lookup': {
                'from': 'users',
                'let': { 'userId': '$userId' },
                'pipeline': userPipeLine(),
                'as': 'userId'
            }
        });

        pipeline.push({
            '$lookup': {
                'from': 'games',
                'let': { 'gameId': '$gameId' },
                'pipeline': this.gamePipeline(),
                'as': 'gameId'
            }
        });

        // Deconstruct the 'userId' array field from the input documents to output a document for each element
        pipeline.push({
            '$unwind': {
                'path': '$userId'
                // 'preserveNullAndEmptyArrays': true
            }
        });

        pipeline.push({
            '$unwind': {
                'path': '$gameId'
                // 'preserveNullAndEmptyArrays': true
            }
        });

        pipeline.push({ '$sort': { 'createdAt': -1 } });

        return pipeline;
    } catch (error) {
        console.log(error);
        // Log the error and return an error response
        return [];
    }
};

/**
 * This function generates a MongoDB aggregation pipeline for fetching game data.
 *
 * @returns {Array} - An array of MongoDB aggregation pipeline stages.
 *
 * @throws Will throw an error if there is an issue with the pipeline stages.
 *
 * @example
 * const gamePipeline = exports.gamePipeline();
 * // gamePipeline will be an array of MongoDB aggregation pipeline stages
 */
exports.gamePipeline = () => {
    try {
        // Initialize an empty array to store the pipeline stages
        let arr = [];

        // Stage 1: Match the gameId with the _id field in the games collection
        arr.push({ '$match': { '$expr': { '$eq': ['$_id', '$$gameId'] } } });

        // Stage 2: Add a new field 'image' to the documents in the pipeline,
        // which is the concatenation of the devConfig.url and the existing 'image' field
        arr.push({ '$set': { 'image': { '$concat': [devConfig.url, '$image'] } } });

        return arr;
    } catch (error) {
        // Log the error
        console.log(error);
        // Log the error and return an error response
        return [];
    }
};

/**
 * This function generates a MongoDB aggregation pipeline for fetching team data.
 *
 * @param {Object} query - The query object containing filter parameters.
 * @param {string} query.name - A search string to filter team names.
 * @param {string} query.userId - The ID of the user to filter teams.
 * @param {string} query.tournamentId - The ID of the tournament to filter teams.
 *
 * @returns {Array} - An array of MongoDB aggregation pipeline stages.
 *
 * @throws Will throw an error if there is an issue with the pipeline stages.
 *
 * @example
 * const teamPipeline = exports.getTeam({ name: 'example', userId: '12345', tournamentId: '67890' });
 * // teamPipeline will be an array of MongoDB aggregation pipeline stages
 */
exports.getTeam = (query) => {
    try {
        // Define MongoDB aggregation pipeline
        let pipeline = [];
        let obj = { '$expr': { '$and': [] } };
        let OrArr = [];

        // If name parameter is provided, add a regex match stage to the pipeline
        if (query?.name) {
            obj['name'] = { '$regex': query.name, '$options': 'i' };
        }

        // If userId parameter is provided, add a match stage to the pipeline
        if (query?.userId) {
            OrArr.push(
                { '$eq': ['$userId', query.userId] },
                { '$in': [query.userId, '$playerId.userId'] },
                { '$in': [query.userId, '$substitute.userId'] }
            );

            // obj.userId = new mongoose.Types.ObjectId(query.userId);
            // obj.playerId.userId = { '$in': [new mongoose.Types.ObjectId(query.userId)] };
            // obj.substitute.userId = { '$in': [new mongoose.Types.ObjectId(query.userId)] };
        }

        // Add tournamentId match stage to the pipeline
        /*  if (query?.tournamentId) {
             obj['$expr']['$and'].push({ 'tournamentId': new mongoose.Types.ObjectId(query.tournamentId) });
             // obj.tournamentId = new mongoose.Types.ObjectId(query.tournamentId);
         } */

        if (OrArr.length > 0) {
            obj['$expr']['$and'].push({ '$or': OrArr });
        }

        // Add match stage to the pipeline
        pipeline.push({ '$match': obj });

        // Add a new field 'image' to the documents in the pipeline,
        // which is the concatenation of the devConfig.url and the existing 'image' field
        pipeline.push({
            '$addFields': {
                'image': { '$concat': [devConfig.url, '$image'] }
            }
        });

        // Perform a outer join with the 'users' collection,
        // using the 'userId' field from the current document and the '_id' field from the 'users' collection
        pipeline.push({
            '$lookup': {
                'from': 'users',
                'let': { 'userId': '$userId' },
                'pipeline': userPipeLine(),
                'as': 'userId'
            }
        });

        pipeline.push({ '$unwind': { 'path': '$substitute' } }, { '$unwind': { 'path': '$playerId' } });

        // Perform a outer join with the 'users' collection,
        // using the 'userId' field from the current document and the '_id' field from the 'users' collection
        pipeline.push({
            '$lookup': {
                'from': 'users',
                'let': { 'userId': '$substitute.userId' },
                'pipeline': userPipeLine(),
                'as': 'substitute.userId'
            }
        });

        // Perform a outer join with the 'users' collection,
        // using the 'userId' field from the current document and the '_id' field from the 'users' collection
        pipeline.push({
            '$lookup': {
                'from': 'users',
                'let': { 'userId': '$playerId.userId' },
                'pipeline': userPipeLine(),
                'as': 'playerId.userId'
            }
        });


        // Deconstruct the 'userId' array field from the input documents to output a document for each element
        pipeline.push({
            '$unwind': {
                'path': '$userId'
                // 'preserveNullAndEmptyArrays': true
            }
        });


        pipeline.push({ '$unwind': { 'path': '$substitute.userId' } });
        pipeline.push({ '$unwind': { 'path': '$playerId.userId' } });

        pipeline.push({
            '$group': {
                '_id': '$_id',
                'playerId': { '$addToSet': '$playerId' },
                'substitute': { '$addToSet': '$substitute' },
                'data': { '$first': '$$ROOT' }
            }
        }, {
            '$addFields': {
                'data.substitute': '$substitute',
                'data.playerId': '$playerId'
            }
        }, { '$replaceRoot': { 'newRoot': '$data' } });

        pipeline.push({ '$sort': { 'createdAt': 1 } });

        return pipeline;
    } catch (error) {
        console.log(error);
        // Log the error and return an error response
        return [];
    }
};

/**
 * This function generates a MongoDB aggregation pipeline for fetching rules and stages of a tournament.
 *
 * @param {Object} query - The query object containing filter parameters.
 * @param {string} query.tournamentId - The ID of the tournament to fetch rules and stages.
 *
 * @returns {Array} - An array of MongoDB aggregation pipeline stages.
 *
 * @throws Will throw an error if there is an issue with the pipeline stages.
 *
 * @example
 * const rulesAndStagesPipeline = exports.getRulesAndStages({ tournamentId: '12345' });
 * // rulesAndStagesPipeline will be an array of MongoDB aggregation pipeline stages
 */
exports.getRulesAndStages = (query) => {
    try {
        // Define MongoDB aggregation pipeline
        let pipeline = [];

        // Stage 1: Match the tournamentId with the _id field in the tournaments collection
        pipeline.push({
            '$match': {
                '_id': new mongoose.Types.ObjectId(query.tournamentId)
            }
        });

        // Stage 2: Perform a look up with the 'tournament_rules' collection;
        pipeline.push({
            '$lookup': {
                'from': 'tournament_rules',
                'localField': '_id',
                'foreignField': 'tournamentId',
                'as': 'rules'
            }
        });

        // Stage 3: Perform a look up with the 'tournament_stages' collection
        pipeline.push({
            '$lookup': {
                'from': 'tournament_stages',
                'localField': '_id',
                'foreignField': 'tournamentId',
                'as': 'stage'
            }
        });

        // Stage 4: Perform a look up with the 'tournament_stage_groups' collection
        pipeline.push({
            '$lookup': {
                'from': 'tournament_stage_groups',
                'localField': '_id',
                'foreignField': 'tournamentId',
                'as': 'stageGroups'
            }
        });

        pipeline.push({
            '$project': {
                'rules': 1,
                'totalStage': { '$size': '$stage' },
                'totalGroups': { '$size': '$stageGroups' }
            }
        });

        return pipeline;
    } catch (error) {
        console.log(error);
        // Log the error and return an error response
        return [];
    }
};

/**
 * This function generates a MongoDB aggregation pipeline for fetching stages of a tournament.
 *
 * @param {Object} query - The query object containing filter parameters.
 * @param {string} query.tournamentId - The ID of the tournament to fetch stages.
 *
 * @returns {Array} - An array of MongoDB aggregation pipeline stages.
 *
 * @throws Will throw an error if there is an issue with the pipeline stages.
 *
 * @example
 * const tournamentStagesPipeline = exports.getTournamentsStages({ tournamentId: '12345' });
 * // tournamentStagesPipeline will be an array of MongoDB aggregation pipeline stages
 */
exports.getTournamentsStages = (query) => {
    try {
        // Define MongoDB aggregation pipeline
        let pipeline = [];

        // Stage 1: Match the tournamentId with the _id field in the tournaments collection
        pipeline.push({ '$match': { '_id': new mongoose.Types.ObjectId(query.tournamentId) } });

        // Stage 3: Perform a look up with the 'tournament_stages' collection
        pipeline.push({
            '$lookup': {
                'from': 'tournament_stages',
                'let': { 'tournamentId': '$_id' },
                'pipeline': [{
                    '$match': {
                        '$expr': {
                            '$eq': ['$tournamentId', '$$tournamentId']
                        }
                    }
                }, {
                    '$lookup': {
                        'from': 'tournament_stage_groups',
                        'localField': '_id',
                        'foreignField': 'stageId',
                        'as': 'stageGroups'
                    }
                }],
                'as': 'stage'
            }
        });

        // Stage 4: Project the 'stage' field from the input documents
        pipeline.push({ '$project': { 'stage': 1 } });

        // Return the pipeline
        return pipeline;
    } catch (error) {
        console.log(error);
        // Log the error and return an error response
        return [];
    }
};

/**
* This function generates a MongoDB aggregation pipeline for fetching player IDs associated with a tournament.
* It joins the 'tournament_teams' collection based on the 'teamId' field and accumulates the player IDs.
* @param {string} tournamentId - The ID of the tournament to fetch player IDs.
* @returns {Array} - An array of MongoDB aggregation pipeline stages.
* The pipeline stages include match, lookup, unwind, group, and addFields stages.
* @throws Will throw an error if there is an issue with the pipeline stages.
*/
exports.getAllJoinPlayerPipeline = (tournamentId) => {
    try {
        // Initialize an empty aggregation pipeline
        const pipeline = [];

        // Add a match stage to filter documents based on the tournamentId
        pipeline.push({ '$match': { 'tournamentId': new mongoose.Types.ObjectId(tournamentId) } });

        // Add a lookup stage to join the tournament_teams collection based on the teamId
        pipeline.push({
            '$lookup': {
                'from': 'tournament_teams',
                'let': { 'teamId': '$teamId' },
                'pipeline': [{
                    '$match': { '$expr': { '$eq': ['$_id', '$$teamId'] } }
                }, {
                    '$unwind': { 'path': '$playerId' }
                }, {
                    '$unwind': {
                        'path': '$substitute'
                        // 'preserveNullAndEmptyArrays': true
                    }
                }],
                'as': 'teamData'
            }
        });

        // Add an unwind stage to deconstruct the teamData array
        pipeline.push({ '$unwind': { 'path': '$teamData' } });

        // Add a group stage to group the documents and accumulate the player ids
        pipeline.push({
            '$group': {
                '_id': null,
                'players': { '$addToSet': { '$toString': '$teamData.playerId' } },
                'substitute': { '$addToSet': { '$toString': '$teamData.substitute' } }
            }
        });

        pipeline.push({
            '$addFields': {
                'players': { '$setUnion': ['$players', '$substitute'] }
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
 * This function generates a MongoDB aggregation pipeline for fetching team data.
 * It includes stages for matching documents and projecting fields.
 *
 * @returns {Array} - An array of MongoDB aggregation pipeline stages.
 *
 * @throws Will throw an error if there is an issue with the pipeline stages.
 */
exports.teamPipeLine = () => {
    try {
        // Define the MongoDB aggregation pipeline
        return [{
            '$match': { '$expr': { '$eq': ['$_id', '$$teamId'] } }
        }, {
            '$project': {
                'image': {
                    '$cond': {
                        'if': { '$ne': ['$image', ''] },
                        'then': { '$concat': [devConfig.url, '$image'] },
                        'else': ''
                    }
                },
                'name': 1,
                'captainId': 1
            }
        }];
    } catch (error) {
        console.log(error);
        // Log the error and return an error response
        return [];
    }
};

/**
 * This function generates a MongoDB aggregation pipeline for fetching team members.
 * It includes stages for matching documents, projecting fields, and performing left outer joins.
 *
 * @param {Object} query - The query object containing filter parameters.
 * @param {string} query.teamId - The ID of the team to fetch members.
 *
 * @returns {Array} - An array of MongoDB aggregation pipeline stages.
 *
 * @throws Will throw an error if there is an issue with the pipeline stages.
 */
exports.getTeamMembersPipeline = (query) => {
    try {
        // Initialize an empty pipeline array
        let pipeline = [];

        // Initialize an empty filter object
        let filterObj = {};

        // If the query object contains a group ID, add it to the filter object
        if (query.teamId) {
            filterObj['_id'] = new mongoose.Types.ObjectId(query.teamId);
        }

        // Add a $match stage to the pipeline to filter the documents based on the filter object
        pipeline.push({ '$match': filterObj });

        // Add stages to the pipeline to unwind the substitute and playerId arrays
        pipeline.push({ '$unwind': { 'path': '$substitute' } }, { '$unwind': { 'path': '$playerId' } });

        // Add a $lookup stage to the pipeline to perform a left outer join with the 'users' collection
        // This will fetch the user details for the substitute IDs
        pipeline.push({
            '$lookup': {
                'from': 'users',
                'let': { 'userId': '$substitute.userId' },
                'pipeline': userPipeLine(),
                'as': 'substitute.userId'
            }
        });

        // Add another $lookup stage to the pipeline to perform a left outer join with the 'users' collection
        // This will fetch the user details for the player IDs
        pipeline.push({
            '$lookup': {
                'from': 'users',
                'let': { 'userId': '$playerId.userId' },
                'pipeline': userPipeLine(),
                'as': 'playerId.userId'
            }
        });

        // Add stages to the pipeline to unwind the substitute.userId and playerId.userId arrays
        pipeline.push({ '$unwind': { 'path': '$substitute.userId' } });
        pipeline.push({ '$unwind': { 'path': '$playerId.userId' } });

        // Add a $group stage to the pipeline to group the documents by the team ID
        // This will create an array of player and substitute IDs for each team
        pipeline.push({
            '$group': {
                '_id': '$_id',
                'playerId': { '$addToSet': '$playerId' },
                'substitute': { '$addToSet': '$substitute' },
                'data': { '$first': '$$ROOT' }
            }
        });

        // Add a $addFields stage to the pipeline to add the substitute and playerId arrays to the root document
        pipeline.push({
            '$addFields': {
                'data.substitute': '$substitute',
                'data.playerId': '$playerId'
            }
        });

        // Add a $replaceRoot stage to the pipeline to replace the root document with the data field
        pipeline.push({ '$replaceRoot': { 'newRoot': '$data' } });

        // Add a $lookup stage to the pipeline to perform a left outer join with the 'users' collection
        // This will fetch the user details for the team captain ID
        pipeline.push({
            '$lookup': {
                'from': 'users',
                'let': { 'userId': '$captainId' },
                'pipeline': userPipeLine(),
                'as': 'captainId'
            }
        });

        // Add a $lookup stage to the pipeline to perform a left outer join with the 'users' collection
        // This will fetch the user details for the team user ID
        pipeline.push({
            '$lookup': {
                'from': 'users',
                'let': { 'userId': '$userId' },
                'pipeline': userPipeLine(),
                'as': 'userId'
            }
        });

        // Add a $unwind stage to the pipeline to unwind the captainId array
        pipeline.push({ '$unwind': { 'path': '$captainId' } });

        // Add a $unwind stage to the pipeline to unwind the userId array
        pipeline.push({ '$unwind': { 'path': '$userId' } });

        // Return the pipeline
        return pipeline;
    } catch (error) {
        console.log(error);
        // Log the error and return an error response
        return [];
    }
};