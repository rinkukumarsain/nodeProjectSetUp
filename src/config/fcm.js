const FCM = require('fcm-node');
const { FCM_SERVER_KEY } = require('../config/dev.config');

const fcm = new FCM(FCM_SERVER_KEY); // put your server key here
let fcm_fun = {
    sendPush: async (message) => {
        return new Promise((resolve, reject) => {
            try {
                fcm.send(message, function (error, response) {
                    if (error) {
                        console.log(error);
                        resolve(error);
                    } else {
                        console.log('---push---notificatrion--sucess--', response);
                        resolve(response);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },
    subscribeToTopic: async (deviceIds) => {
        return new Promise((resolve, reject) => {
            try {
                fcm.subscribeToTopic(deviceIds, 'some_topic_name', (err, res) => {
                    console.log(err, res);
                });
            } catch (error) {
                reject(error);
            }
        });
    },
    unsubscribeToTopic: async (deviceIds) => {
        return new Promise((resolve, reject) => {
            try {
                fcm.unsubscribeToTopic(deviceIds, 'some_topic_name', (err, res) => {
                    console.log(err, res);
                });
            } catch (error) {
                reject(error);
            }
        });
    }
};
module.exports = fcm_fun;