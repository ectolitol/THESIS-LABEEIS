let serialportgsm = require('serialport-gsm')
let modem = serialportgsm.Modem()
let options = {
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
    pin: '',
    customInitCommand: '',
    cnmiCommand: 'AT+CNMI=2,1,0,2,1',
    logger: console
}

modem.open('COM4', options, {});

modem.on('open', data => {	

  //initialize modem
  modem.initializeModem(() =>{
    console.log('Modem initialized');

    //send sms
    modem.sendSMS('639306183623', 'On top of that, when sending 141 characters exactly wwwwwwwwwwwwwwwwwwwOn top of that, when sending 141 characters exactly wwwwwwwwwwwwwwwwwwwode scripts/sms.js On top of that, when sending 141 characters exactly wwwwwwwwwwwwwwwwwwwOn top of that, when sending 141 characters exactly wwwwwwwwwwwwwwwwwwwode scripts/sms.js On top of that, when sending 141 characters exactly wwwwwwwwwwwwwwwwwwwOn top of that, when sending 141 characters exactly wwwwwwwwwwwwwwwwwwwode scripts/sms.js ', false, (data)=>{
      console.log(data);
    })

  });
   
})

modem.on('onSendingMessage', result => {
  console.log(result);
})