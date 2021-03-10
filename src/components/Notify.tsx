//import React, { FunctionComponent } from 'react';
let n = require('node-notifier');
const notifier = new n.NotificationCenter();

function Notify (title:string, message:string) {

    if (!message) return;

    notifier.notify( {
        title: ((title)? title : null),
        message: message
    });
}

export default Notify
