const inquirer = require("inquirer");
const generateHTML = require("./generateHTML.js");
const axios = require("axios");
const fs = require("fs"),
    convertFactory = require("electron-html-to");
const conversion = convertFactory({
    converterPath: convertFactory.converters.PDF
});

const googleApiKey = "AIzaSyAPg5Dwcw9-O5hcA9WLjNALXCtfjTJLa8s";

let htmlObj = {
    profImage: null, 
    userName: null, 
    googleMapUrl: null, 
    userLocation: null, 
    userGithubLink: null, 
    userBlog: null, 
    userBio: null, 
    publicRepoNum: null, 
    followersNum: null, 
    githubStarsNum: 0, 
    followingNum: null,
    colors: null
};

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
 ])}

async function githubProfileRequest(githubLogin){
    let queryUrl = `https://api.github.com/users/${githubLogin}`;
    return axios.get(queryUrl);
}

async function githubRepoRequest(githubLogin){
  	let queryUrl = `https://api.github.com/users/${githubLogin}/repos`;
  	return axios.get(queryUrl);
}

async function googleGeoCodeRequest(){
  	let queryUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${htmlObj.userLocation}&key=${googleApiKey}`;
		return axios.get(queryUrl);
}

async function init() {
  	let userPromptResponse = await inq();
  	htmlObj.colors = userPromptResponse.color;	
  
  	let githubProfileResponse = await githubProfileRequest(userPromptResponse.github);
    let githubRes = githubProfileResponse.data;
    htmlObj.profImage = githubRes.avatar_url;
    htmlObj.userName = githubRes.name;
    htmlObj.userGithubLink = githubRes.html_url;
    htmlObj.userBlog = githubRes.blog;
    htmlObj.userBio = githubRes.bio;
    htmlObj.userCompany = githubRes.company;
    htmlObj.publicRepoNum = githubRes.public_repos;
    htmlObj.followersNum = githubRes.followers;
    htmlObj.followingNum = githubRes.following;
    htmlObj.userLocation = githubRes.location;
    console.log(htmlObj.userLocation);

  	let githubRepoResponse = await githubRepoRequest(userPromptResponse.github);
  	githubRepoResponse.data.forEach(function(repo){
      htmlObj.githubStarsNum += repo.stargazers_count;
    });
  
  	let googleGeoCodeResponse = await googleGeoCodeRequest();
    let userLat = googleGeoCodeResponse.data.results[0].geometry.location.lat;
    let userLng = googleGeoCodeResponse.data.results[0].geometry.location.lng;
    htmlObj.googleMapUrl = `https://www.google.com/maps/@${userLat},${userLng},13z`
    console.log(htmlObj);
}
init();