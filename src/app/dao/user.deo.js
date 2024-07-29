/**
 * This function generates a MongoDB aggregation pipeline for joining the 'countries' collection with the current collection.
 * It uses the '$lookup' and '$unwind' stages to achieve this.
 * 
 * @returns {Array} - Returns an array representing the MongoDB aggregation pipeline.
 * If an error occurs during the process, it logs the error and returns an empty array.
 */
exports.countriesLookup = () => {
    try {
        // Define MongoDB aggregation pipeline
        let pipeline = [];

        pipeline.push({
            '$lookup': {
                'from': 'countries',
                'localField': 'countryId',
                'foreignField': '_id',
                'as': 'countryId'
            }
        });
        pipeline.push({ '$unwind': { 'path': '$countryId' } });
        return pipeline;
    } catch (error) {
        console.log(error);
        // Log the error and return an error response
        return [];
    }
};
