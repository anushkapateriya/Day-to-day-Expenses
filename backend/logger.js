const fs = require("fs");

const errorLogStream = fs.createWriteStream(
    "./logs/error.log",
    { flags: "a" }
);

const logError = (error) => {

    const time = new Date().toISOString();

    errorLogStream.write(
        `[${time}] ${error.stack || error}\n`
    );
};

module.exports = {
    logError
};
