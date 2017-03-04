const config = require('config');
const express = require('express');
const ect = require('ect');
const WunderlistSDK = require('wunderlist');

const port = 5000;

const wunderlist = new WunderlistSDK({
    'accessToken': config.get('wunderlist.accessToken'),
    'clientID': config.get('wunderlist.clientId')
});

const midnight = new Date();
midnight.setHours(0, 0, 0, 0);

const completed = [];

const getCompletedTasks = () => {
    wunderlist.http.lists.all().done(lists => {
        lists.forEach(list => {
            wunderlist.http.tasks.forList(list.id, true).done(tasks => {
                tasks.forEach(task => {
                    if (new Date(task.completed_at).getTime() > midnight.getTime()) {
                        completed.push({
                            list: list.title,
                            task: task.title
                        });
                    }
                });
            });
        });
    });
};

getCompletedTasks();

setTimeout(() => {

    express()
        .get('/', (req, res) => {
            res.send('<pre>' + JSON.stringify(completed, null, 2) + '</pre>');
        })
        .listen(port, () => console.info('Website started at port ' + port));

}, 3000);