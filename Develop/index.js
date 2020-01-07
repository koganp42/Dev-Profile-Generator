const inquirer = require("inquirer");
const generateHTML = require("./generateHTML.js");
const axios = require("axios");
const fs = require("fs"),
    convertFactory = require("electron-html-to");
const conversion = convertFactory({
    converterPath: convertFactory.converters.PDF
});
const apikey = require("./apikey")

const googleApiKeyImport = apikey.giveApiKey();

let profImage = null;
let userName = null;
let googleMapUrl = null;
let userLocation = null;
let userGithubLink = null;
let userBlog = null;
let userBio = null;
let publicRepoNum = null;
let followersNum = null;
let githubStarsNum = 0;
let followingNum = null;
let data = null;

async function inq() {
    return inquirer.prompt([
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
}

async function githubProfileRequest(githubLogin) {
    let queryUrl = `https://api.github.com/users/${githubLogin}`;
    return axios.get(queryUrl);
}

async function githubRepoRequest(githubLogin) {
    let queryUrl = `https://api.github.com/users/${githubLogin}/repos`;
    return axios.get(queryUrl);
}

async function googleGeoCodeRequest() {
    let queryUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${userLocation}&key=${googleApiKeyImport}`;
    return axios.get(queryUrl);
}

async function init() {
    let userPromptResponse = await inq();
    data = userPromptResponse;

    let githubProfileResponse = await githubProfileRequest(userPromptResponse.github);
    let githubRes = githubProfileResponse.data;
    profImage = githubRes.avatar_url;
    userName = githubRes.name;
    userGithubLink = githubRes.html_url;
    userBlog = githubRes.blog;
    userBio = githubRes.bio;
    userCompany = githubRes.company;
    publicRepoNum = githubRes.public_repos;
    followersNum = githubRes.followers;
    followingNum = githubRes.following;
    userLocation = githubRes.location;
    console.log(userLocation);

    let githubRepoResponse = await githubRepoRequest(userPromptResponse.github);
    githubRepoResponse.data.forEach(function (repo) {
        githubStarsNum += repo.stargazers_count;
    });

    let googleGeoCodeResponse = await googleGeoCodeRequest();
    let userLat = googleGeoCodeResponse.data.results[0].geometry.location.lat;
    let userLng = googleGeoCodeResponse.data.results[0].geometry.location.lng;
    googleMapUrl = `https://www.google.com/maps/@${userLat},${userLng},11z`

    const htmlPageData = generateHTML.generateHTML(data, profImage, userName, googleMapUrl, userLocation, userGithubLink, userBlog, userBio, publicRepoNum, followersNum, githubStarsNum, followingNum);

    conversion({ html: htmlPageData, delay: 1000 }, function (err, result) {
        if (err) {
            return console.log(err);
        }
        console.log(result.numberOfPages);
        console.log("success");
        result.stream.pipe(fs.createWriteStream(`${userName}.pdf`));
        conversion.kill();
    });
}
init();