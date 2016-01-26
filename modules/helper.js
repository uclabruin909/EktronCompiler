/*Helper Module - has depenceny to the config object
Provides methods to retrieve information from the config obj*/

//Configuration object//
var config = require('../compileConfig.json');


//public helperMethods that will be returned
var helperMethods = {
  getCompanyName : getCompanyName,
  getProjectName : getProjectName,
  getProjectDate : getProjectDate,
  getCompileFiles: getCompileFiles,
  getRootDir : getRootDir,
  getProjectDir : getProjectDir,
  getInitialDirectories : getInitialDirectories,
  getFilesOf : getFilesOf,
  getPathOf : getPathOf,
  getFileObj : getFileObj,
};



function getCompanyName() {
  var companyName = config['companyName'];
  return companyName;
}

function getProjectName() {
  var projectName = config['projectName'];
  return  projectName;
}

function getProjectDate() {
  var projectDate = config['projectDate'];
  return projectDate;
}

function getCompileFiles() {
  var compileFiles = config['compileFiles'];
  return compileFiles;
}

function getRootDir() {
  var rootDir = config['rootDir'];
  return rootDir;
}

function getProjectDir() {
  var rootDir = config['rootDir'];
  var projectName = config['projectName'];
  var projectDir = rootDir + projectName;
  return projectDir;
}

function getInitialDirectories() {
  var initDirs = config['initDirectories'];
  return initDirs;
}

//pass in the name of the directory
//eg. 'UserControls', 'Layouts', 'xslt'
function getFilesOf(dirName) {
  var directoryFiles = config['project'][dirName]['files'];
  return directoryFiles;
}

//passes in two arguments (directoryName, fileName) and resturns the path.
//if only one argument is passed (directoryName), return path to the directory eg. 'Layouts', 'UserControls', etc
function getPathOf(dirName, fileName) {

  var fileTypeMap = {
    UserControls: '.ascx',
    Layouts: '.aspx',
    xslt: '.xsl',
  };

  var rootDir = getRootDir();
  var projectName = getProjectName();
  var dirPath =  rootDir + projectName + '/' + dirName;


  // if only 1 parameter is passed, return the path of directory
  if ( arguments.length === 1 ) {
    return dirPath;
  }

  //with two arguments passed, return path of the file.
  var filePath = dirPath + '/' + fileName + fileTypeMap[dirName];
  return filePath;

}

// returns the fileObj of particular fileName
//ex: getFileObj('Smarsh_Head')
function getFileObj(fileName) {
  var userControlsFiles = getFilesOf('UserControls');
  var layoutsFiles = getFilesOf('Layouts');
  //concat the files array for Layouts and UserControls
  var fileObjCollection = userControlsFiles.concat(layoutsFiles);

  var fileObj;
  //search through file list and return object with name = fileName parameter
  for (var i=0; i<fileObjCollection.length; i++) {
    var file = fileObjCollection[i];
    if ( file['name'] === fileName ) {
      fileObj = file;
      return fileObj;
    }
    else {
      console.log('no such file exists');
      return false;
    }
  }

}


module.exports = helperMethods;



