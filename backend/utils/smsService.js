const serialportgsm = require('serialport-gsm');
const modem = serialportgsm.Modem();

const options = {
    baudRate: 9600,
    dataBits: 8,
    stopBits: 1,
    parity: 'none',
    rtscts: false,
    xon: false,
    xoff: false,
    xany: false,
    autoDeleteOnReceive: true,
    enableConcatenation: true,
    incomingCallIndication: true,
    incomingSMSIndication: true,
    pin: '',  // Add your SIM pin here if needed
    customInitCommand: '',
    cnmiCommand: 'AT+CNMI=2,1,0,2,1',
    logger: {
        debug: () => {},   // Ignore debug logs
        info: () => {},    // Ignore info logs
        warn: console.warn, // You can keep warnings
        error: console.error // You can keep errors
    },
};

// Initialize and open the modem connection
modem.open('COM4', options, (err) => {
    if (err) {
        console.log('Error opening modem:', err);
    } else {
        console.log('Modem connected successfully');
        modem.initializeModem(() => {
            console.log('Modem initialized');
        });
    }
});

// Function to send SMS
exports.sendSMS = (recipient, message) => {
    return new Promise((resolve, reject) => {
        if (!recipient || !message) {
            return reject(new Error('Recipient number and message are required'));
        }

        console.log(`Sending SMS to ${recipient}: ${message}`);

        modem.sendSMS(recipient, message, false, (result) => {
            // Check for success response in modem's result data
            if (result && result.status === 'success' && result.data.response.includes('Successfully Sent')) {
                console.log('SMS sent successfully', result.data);
                resolve(result.data);  // Consider this a success
            } else {
                console.log('Failed to send SMS', result);
                reject(new Error('Failed to send SMS'));  // Reject on failure
            }
        });
    });
};

// Close modem connection (optional)
exports.closeModem = () => {
    modem.close(() => {
        console.log('Modem connection closed');
    });
};
