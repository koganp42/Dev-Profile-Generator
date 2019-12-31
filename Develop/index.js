const inquirer = require("inquirer");
const generateHTML = require("./generateHTML.js"); 
const axios= require("axios"); 
const fs= require("fs"),
  convertFactory= require("electron-html-to"); 
const conversion = convertFactory({
  converterPath: convertFactory.converters.PDF
}); 

const questions = [

];

function writeToFile(fileName, data) {
 
}

function init() {
}
init();
