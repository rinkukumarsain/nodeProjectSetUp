/* eslint-disable no-undef */
const axios = require('axios');
let appUtils = {
    /**
     * @description Split array to chunks
     * @param data
     * @author 
     */
    splitArrayInToChunks: (data) => {
        return [].concat(
            ...data.map(function (elem, i) {
                return i % 100 ? [] : [data.slice(i, i + 100)];
            })
        );
    },
    /**
     *
     * @param payload @description Fornmat push data for payload
     * @param token
     * @author 
     */
    formatDataForPush: (payload, token) => {
        return {
            registration_ids: token,
            notification: {
                title: payload['title'],
                body: payload['body'],
                sound: 'default',
                type: payload['type'],
                id: payload['id'],
                force: true,
                badge: 1
            },
            data: payload['data'],
            priority: 'high'
        };
    },

    /**
     * @function thirdPartyAPI
     * @description Third Partyies API's Hits (Now its using for hitting the bank approve from admin panel to approve bank resurst to cashfree)
     * @param { } payload
     * @author 
     */
    thirdPartyAPI: (URL, payload) => {
        axios.default.post(`${URL}`, payload, {
            headers: {
                'content-type': 'application/json'
            }
        }).then(function (response) {
            // eslint-disable-next-line no-undef
            resolve(response);
        }).catch(function (error) {
            console.log('AXIOS Third Party API ERROR ', error);
            // reject(error);
            // eslint-disable-next-line no-undef
            resolve({ data: '' });
        });
    }

};
module.exports = appUtils;