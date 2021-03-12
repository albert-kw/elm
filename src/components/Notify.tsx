import React, { FunctionComponent } from 'react';
//let n = require('node-notifier');
//import Notification from 'rc-notification';
//import React from 'react';
//import ReactDOM from 'react-dom';

import Snackbar from '@material-ui/core/Snackbar';
//import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
//import Alert from '@material-ui/lab/Alert';
//
//const notifier = new n.NotificationCenter();

interface NotifyProps {
  title: string
  message: string
  open: boolean
  onClose: () => void
}

//function Alert(props: AlertProps) {
//  return <MuiAlert elevation={6} variant="filled" {...props} />;
//}

//function Notify (title:string, message:string) {
const Notify: FunctionComponent<NotifyProps> = ({ title, message, open, onClose }) => {

    //let notifier:any = null;
    //Notification.newInstance({}, (n:any) => notifier = n);

    // const handleClick = () => {
    //     setOpen(true);
    // };

    // const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    //     if (reason === 'clickaway') return;

    //     setOpen(false);
    // };

    /*
    notifier.notify( {
        title: ((title)? title : null),
        message: message
    });
    */

    //notifier.notice({
    //        content: <span>message</span>,
    //        onClose() {
    //            console.log("notifier simple close");
    //        }
    //    });

    return (
        <>

            <Snackbar open={open} autoHideDuration={3000} onClose={onClose}>
                {/*
                    //<Alert onClose={handleClose} severity="success">
                */}
                    <div>This is a success message!</div>
                {/*
                    //</Alert>
                */}
            </Snackbar>
        </>
    );
}

export default Notify
