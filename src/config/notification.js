
const appUtils = require('./appUtils');
const fcm = require('./fcm');
// const { userModel } = require('../../src/model');
// const { messaging } = require('../../src/libs/firestoreConnections')
// const { NOTIFICATION } = require('../config/constant');
exports.PushAllNotifications = async (params) => {
    return new Promise((resolve, reject) => {
        try {
            const pushLoad = {
                title: params.title || '',
                body: params.message,
                type: params.type,
                notification: {
                    title: params.message,
                    displayPicture: '',
                    type: params.type
                },
                data: {
                    title: params.message,
                    displayPicture: '',
                    type: params.type
                }
            };
            console.log(params.deviceTokens, '----->>>>>>>');
            const tokenChunks = appUtils.splitArrayInToChunks(params.deviceTokens);

            const promiseResult = [];
            for (let i = 0; i < tokenChunks.length; i++) {
                const message = appUtils.formatDataForPush(pushLoad, tokenChunks[i]);
                promiseResult.push(fcm.sendPush(message));
            }
            resolve(Promise.all(promiseResult));
        } catch (error) {
            console.log('error', error);
            reject(error);
        }
    });
};
