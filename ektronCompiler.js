var fs = require('fs');
var cheerio = require('cheerio');
var rmdir = require('rimraf');
var beautify = require('js-beautify').html;

//load all modules//
var helper = require('./modules/helper.js');
var templatesModule = require('./modules/templatesModule.js');
var initModule = require('./modules/initModule.js');

var compilerModule = require('./modules/compiler.js');


var userAction = process.argv[2];


var ektronMethods = {
  init : initialize,
  remove : removeProject,
  compile : compileProject,
}



function initialize() {

  initModule.createInitDirectories();
  initModule.createDescriptionFile();
  initModule.createUCfiles();
  initModule.createXSLFiles();
  console.log("Project directory has been initialized!!!")

}

function removeProject() {
  var projectPath = helper.getProjectDir();
  rmdir(projectPath, function(error){
    if (error) {
      console.log("Unable to delete Project directory!");
    }
    console.log("Project directory has been deleted!!!")
  });
}



function compileProject() {

  //file collection for directories
  var userControlFiles = helper.getFilesOf('UserControls');
  var layoutFiles = helper.getFilesOf('Layouts');

  //compile UserControl files first
  userControlFiles.forEach(function(ucFile) {

    var uc_file_name = ucFile['name'];

    switch (uc_file_name) {

      case 'Smarsh_Head' :
        compileHead();
        break;

      case 'Smarsh_Header' :
        compileHeader();
        break;

      case 'Smarsh_Footer' :
        compileFooter();
        break;
    }

  });

  //compile Layout files after user Controls file
  layoutFiles.forEach(function(layoutFile) {

    var layout_file_name = layoutFile['name'];
    compileLayout(layout_file_name);

  });

}



function compileHead() {

  var file_obj = helper.getFileObj('Smarsh_Head');
  var dest_path = helper.getPathOf('UserControls') + '/' + file_obj['name'] + file_obj['fileType'];
  var $ = cheerioParse( file_obj['srcFile'] );

  var $ek_assets = $('[ek-asset]');
  var $ek_sources = $('[ek-source]');

  //compile all ek-assets//
  $ek_assets.each(function(ind) {
    var $this = $(this);
    compilerModule.compile['asset']($this);
  });

  //compile all ek-source//
  $ek_sources.each(function(ind) {
    var $this = $(this);
    var source_type = $this.attr('ek-source');
    compilerModule.compile['source'][source_type]($this);
  });

  var $ek_head = $('head');
  //Head template reqiores {html : headHTML}
  var head_temp_obj = {
    html : $ek_head.html(),
  };

  var compiled_head = templatesModule.render('head', head_temp_obj);
  fs.writeFileSync(dest_path, beautify(compiled_head, { indent_size: 2 }));

  console.log('Smarsh_Head.aspx file has been compiled!');

}


function compileHeader() {

  var file_obj = helper.getFileObj('Smarsh_Header');
  var dest_path = helper.getPathOf('UserControls') + '/' + file_obj['name'] + file_obj['fileType'];
  var $ = cheerioParse( file_obj['srcFile'] );

  var $ek_assets = $('[ek-asset]');
  var $ek_types = $('[ek-type]');
  var $ek_dropzones = $('[ek-dropzone]');

    //compile all ek-assets//
  $ek_assets.each(function(ind) {
    var $this = $(this);
    compilerModule.compile['asset']($this);
  });


  //after all ek-assets have been compiled, compile all ek-types//
  $ek_types.each(function(ind) {
    var $this = $(this);
    var ektron_type = $this.attr('ek-type');
    compilerModule.compile['type'][ektron_type]($this, $);
  });

  //after assets are compiled, compile all dropzones//

  //compile all assets//
  $ek_dropzones.each(function(ind) {
    var $this = $(this);
    compilerModule.compile['dropzone']($this, $);
  });

  var $ek_header = $('[ek-section = "header"]');
  //Head template reqiores {html : headHTML}
  var header_temp_obj = {
    html : $ek_header.html(),
  };

  var compiled_header = templatesModule.render('header', header_temp_obj);
  //decode final HTML
  compiled_header = decodeHTML(compiled_header);

  fs.writeFileSync(dest_path, beautify(compiled_header, { indent_size: 2 }) );

  console.log('Smarsh_Header.aspx file has been compiled!');


}



function compileFooter() {

  var file_obj = helper.getFileObj('Smarsh_Footer');
  var dest_path = helper.getPathOf('UserControls') + '/' + file_obj['name'] + file_obj['fileType'];
  var $ = cheerioParse( file_obj['srcFile'] );

  var $ek_assets = $('[ek-asset]');
  var $ek_sources = $('[ek-source]');
  var $ek_types = $('[ek-type]');

    //compile all ek-assets//
  $ek_assets.each(function(ind) {
    var $this = $(this);
    compilerModule.compile['asset']($this);
  });

  //compile all sources//
  $ek_sources.each(function(ind) {
    var $this = $(this);
    var source_type = $this.attr('ek-source');
    compilerModule.compile['source'][source_type]($this);
  });

  //compile all assets and sources and then compiled the ek-types//
  $ek_types.each(function(ind) {
    var $this = $(this);
    var ektron_type = $this.attr('ek-type');
    compilerModule.compile['type'][ektron_type]($this, $);
  });


  var $ek_footer = $('[ek-section = "footer"]');
  //Head template reqiores {html : headHTML}
  var footer_temp_obj = {
    html : $ek_footer.html(),
  };

  var compiled_footer = templatesModule.render('footer', footer_temp_obj);
  //decode final HTML
  compiled_footer = decodeHTML(compiled_footer);

  fs.writeFileSync(dest_path, beautify(compiled_footer, { indent_size: 2 }) );

  console.log('Smarsh_Footer.aspx file has been compiled!');

}



function compileLayout(layoutName) {

  var layout_name = layoutName;
  var file_obj = helper.getFileObj(layout_name);
  var dest_path = helper.getPathOf('Layouts') + '/' + file_obj['name'] + file_obj['fileType'];
  var $ = cheerioParse( file_obj['srcFile'] );

   var $ek_assets = $('[ek-asset]');
  var $ek_types = $('[ek-type]');
  var $ek_dropzones = $('[ek-dropzone]');


    //compile all ek-assets//
  $ek_assets.each(function(ind) {
    var $this = $(this);
    compilerModule.compile['asset']($this);
  });


  //compile all ek-types//
  $ek_types.each(function(ind) {
    var $this = $(this);
    var ektron_type = $this.attr('ek-type');
    compilerModule.compile['type'][ektron_type]($this, $);
  });

  //after assets are compiled, compile all dropzones//

  //compile all assets//
  $ek_dropzones.each(function(ind) {
    var $this = $(this);
    compilerModule.compile['dropzone']($this, $);
  });

  var $ek_body = $('[ek-section = "body"]');

  // layout template requires obj {layoutName: layoutName, html : compiledHTML}
  var layout_temp_obj = {
    layoutName : layout_name,
    html : $ek_body.html(),
  }


  var compiled_layout = templatesModule.render('layout', layout_temp_obj);
  //decode final HTML
  compiled_layout = decodeHTML(compiled_layout);

  fs.writeFileSync(dest_path, beautify(compiled_layout, { indent_size: 2 }) );

  console.log('Layout ' + file_obj['name'] + file_obj['fileType'] + ' has been compiled!');

}





// HELPERS
// parse file into usable cheerio object and return to be used
//
function cheerioParse(filePath) {
  var fileSrc = fs.readFileSync(filePath).toString();
  var $ = cheerio.load(fileSrc);
  return $;
}


//used to parse escaped characters in final html
function decodeHTML(htmlString) {
  var decoded_html = htmlString.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/<ektron>/g, " ").replace(/<\/ektron>/g, " ");
  return decoded_html;
}



ektronMethods[userAction]();