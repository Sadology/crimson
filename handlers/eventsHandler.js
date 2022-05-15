const { readdirSync } = require("fs");
const { glob } = require("glob");
const { promisify } = require("util");
const globPromise = promisify(glob);
// Event handler function
module.exports = {
    run: async(client) => {

        const eventFiles = await globPromise(`${process.cwd()}/Events/**/*.js`);
        eventFiles.map((value) => require(value));

    }
};