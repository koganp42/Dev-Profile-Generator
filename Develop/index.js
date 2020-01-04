const inquirer = require("inquirer");
const generateHTML = require("./generateHTML.js");
const axios = require("axios");
const fs = require("fs"),
    convertFactory = require("electron-html-to");
const conversion = convertFactory({
    converterPath: convertFactory.converters.PDF
});

let profImage = null;
let userName = null;
let userLocation = null;
let userGithubLink = null;
let userBlog = null;
let userBio = null;
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
    .then(function(response){
        let { githubLogin } = response;
        let colors = response;
        let queryUrl = `https://api.github.com/users/${githubLogin}`;
        axios.get(queryUrl)
            .then(function(response_git){
                profImage = response_git.avatar_url;
                userName = response_git.name;
                userGithubLink = response_git.html_url;
                userBlog = response_git.blog;
                userBio = response_git.bio;
                publicRepoNum = response_git.public_repos;
                followersNum = response_git.followers;
                followingCount = response_git.following;
                userLocation = response_git.location;
                //console.log();
            });
        axios.get(queryUrl + "/repos")
            .then(function(response){
                response.data.forEach(function(stars){
                    githubStarsNum += stars.stargazers_count;
                    
                });
                console.log(githubStarsNum);
            });
    });

function writeToFile(fileName, data) {

}

function init() {
}
init();
