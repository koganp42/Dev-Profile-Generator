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
let userCompany = null;
let userBlog = null;
let userBio = null;
let publicRepoNum = null;
let followersNum = null;
let githubStarsNum = null;
let followingNum = null;
const googleApiKey = "AIzaSyAPg5Dwcw9-O5hcA9WLjNALXCtfjTJLa8s";


function init() {

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
        let githubLogin = response.github;
        let colors = response.color;
        let queryUrl = `https://api.github.com/users/${githubLogin}`;
        axios.get(queryUrl)
            .then(function(response_git){
                profImage = response_git.data.avatar_url;
                userName = response_git.data.name;
                console.log(userName);
                userGithubLink = response_git.data.html_url;
                userBlog = response_git.data.blog;
                userBio = response_git.data.bio;
                userCompany = response_git.data.company;
                publicRepoNum = response_git.data.public_repos;
                followersNum = response_git.data.followers;
                followingNum = response_git.data.following;
                userLocation = response_git.data.location;
                console.log(userLocation);
                let googleGeoUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${userLocation}&key=${googleApiKey}`;
                console.log(googleGeoUrl);
                return axios.get(googleGeoUrl);
            }).then(function(geo_response){
                console.log(geo_response.data.geometry);
                let userLat = geo_response.data.geometry.location.lat;
                let userLong = geo_response.data.geometry.location.lng;
            });
            
        axios.get(queryUrl + "/repos")
            .then(function(response_git_stars){
                response_git_stars.data.forEach(function(stars){
                    githubStarsNum += stars.stargazers_count;
                });
                console.log(githubStarsNum);
            });
        //let generateHTML = html;

    });

}
init();
