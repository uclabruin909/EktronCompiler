//Ektron Module : reponsibile for initialization of folders, ucFiles, etc
//Dependencies:  helper module, template module, fs

var fs = require('fs');
var helper = require('./helper.js');
var templatesModule = require('./templatesModule.js');


//public initlaization methods that will be exported

var initMethods = {
  createInitDirectories : createInitDirectories,
  createUCfiles : createUCfiles,
  createDescriptionFile : createDescriptionFile,
  createXSLFiles : createXSLFiles,
};


function createInitDirectories() {
  var projectFolderPath = helper.getProjectDir();
  var initDirectories = helper.getInitialDirectories();
  //create the base project folder where all other directories will be created in.
  //create base project folder synchronously to ensure folder exist before other directories are created
  fs.mkdirSync(projectFolderPath);

  //loop through initDirectories and create folder for each one of them inside the base project folder
  ///directories can be created async
  initDirectories.forEach(function(dirName) {
    var dirPath = projectFolderPath + '/' + dirName;
    fs.mkdirSync(dirPath);
  });

  //create UC folder inside 'Layouts directory'
  fs.mkdirSync(projectFolderPath+ '/Layouts/UC');
}

//method function to create UC .aspx files for each different layout file inside the Layouts folder
function createUCfiles() {
  var projectName = helper.getProjectName();
  var projectFolderPath = helper.getProjectDir();
  //the UC folder will be inside the Layouts folder.
  var basePath = helper.getPathOf('Layouts') + '/' + 'UC';

  var layoutFiles = helper.getFilesOf('Layouts');

  //loop through all the layout files and create UC files for each inside the base
  /*1. compile complete HTML for each UC file using the render module.
    Render method must pass object {projectName, fileName}*/
  layoutFiles.forEach(function(file) {
    var filePath = basePath + '/' + file['name'] + '.aspx';
    var bodyObj = {
      fileName: file['name'],
      projectName: projectName,
    };
    var compiledSrc = templatesModule.render('ucfile', bodyObj);

    //async writeFile to filePath with the compiled src.
    fs.writeFile(filePath, compiledSrc);
  });

}

//function method to create description.txt file
function createDescriptionFile() {
  //description file will always reside inside the base project directory path
  var baseDir = helper.getProjectDir();
  var filePath = baseDir + '/' + 'description.txt';

  //description file template requires {companyName : companyName, projectDate: projectDate} to be passed.
  var templateObj = {
    companyName : helper.getCompanyName(),
    projectDate : helper.getProjectDate(),
  };

  var compiledContent = templatesModule.render('descriptionfile', templateObj);

  fs.writeFileSync(filePath, compiledContent);
}

function createXSLFiles() {
  var compiled_main_menu = templatesModule.render('mainMenu-xsl');
  var compiled_single_menu = templatesModule.render('singleMenu-xsl');
  var basePath = helper.getPathOf('xslt');

  fs.writeFileSync(basePath + '/main_menu.xsl', compiled_main_menu);
  fs.writeFileSync(basePath + '/single_level_menu.xsl', compiled_single_menu);
}



module.exports = initMethods;
