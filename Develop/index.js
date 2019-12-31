const inquirer = require("inquirer");
const generateHTML = require("./generateHTML.js");
const axios = require("axios");
const fs = require("fs"),
    convertFactory = require("electron-html-to");
const conversion = convertFactory({
    converterPath: convertFactory.converters.PDF
});

let bioImage = null;
let userLocation = null;
let userGithubLink = null;
let publicRepoNum = null;
let followersNum = null;
let githubStarsNum = null;
let followingCount = null;

inquirer
    .prompt([
        {
            type: "input",
            name: "github",
            message: "What is your Github username?"
        },
        {
            type: "list",
            name: "color",
            message: "Pick a color for your profile!",
            choices: ["green", "blue", "pink", "red"]
        }
    ])
    .then(answers => {
        // Use user feedback for... whatever!!
    });

function writeToFile(fileName, data) {

}

function init() {
}
init();
