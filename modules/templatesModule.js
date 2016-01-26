//template module.  will have render methods for each of the different template types.
//render methods will be returned.
//Dependencies: Handlebar fs
var fs = require('fs');
var Handlebars = require('handlebars');



  /*dynamically compile all template files and attach appropriate methods
  to the renderMethods obj as each file is read.*/

  //eg {nameOfTemplate : templateFunction}
  var renderMethodsObj = {
    //contentblock : func()
  };


  //collection of all templates files inside the template folder
  // [contentblock.hbs, copyright.hbs, dropzone.hbs, etc]
  var templateFiles = fs.readdirSync('../templates');

  //loop through all files, extract source, compile and attach to the renderMethodsObj obk
  templateFiles.forEach(function(templateFile) {

    //template name wil be name of file minus the suffix ('.hbs')
    var templateName = templateFile.substring(0, templateFile.indexOf('.'));
    var templateSrc = fs.readFileSync('./templates/' + templateFile).toString();


    //dynamically attach the template to the renderMethodsObj object
    compileAndAttach(templateSrc, templateName);

  });


    //compileAndAttach function will compile src into Handlebar template and attach render property to
    //renderMethodsObj object.
  function compileAndAttach(src, templateName) {
    var TEMPLATE = Handlebars.compile(src);
    //create property based on the template name and attach compiled template to the renderMethodsObj obj
    renderMethodsObj[templateName] = TEMPLATE;

  }


  //main render function

  function render(templateName, templateObj) {
    var compiledSrc = renderMethodsObj[templateName](templateObj);
    return compiledSrc;
  }


  module.exports = {
    render : render,
  };

