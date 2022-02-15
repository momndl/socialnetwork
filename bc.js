const bcrypt = require("bcryptjs");

const { genSalt, hash, compare } = bcrypt;

module.exports.compare = compare;
module.exports.hash = (plainTxtPw) =>
    genSalt().then((salt) => hash(plainTxtPw, salt));
