const bcrypt = require('bcryptjs');

const password = 'puplabeeis123'; // Replace with your actual password
const salt = bcrypt.genSaltSync(10);
const hashedPassword = bcrypt.hashSync(password, salt);

console.log(hashedPassword);
