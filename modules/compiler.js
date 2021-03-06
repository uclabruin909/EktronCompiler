var fs = require('fs');
var assetObj = require('../assetFile.json');
var beautify = require('js-beautify').html;

var helper = require('./helper.js');
var templatesModule = require('./templatesModule.js');



var compileMethods = {

    dropzone : compileDropZone,
    //for ek-type = * compile methods
    type : {
      content : compileContent,
      contentblock : compileContentBlock,
      contenttitle : compileContentTitle,
      formblock : compileFormBlock,
      globalfooter1 : compileGlobalFooter1,
      globalfooter2 : compileGlobalFooter2,
      headerlogo : compileHeaderLogo,
      footerlogo: compileFooterLogo,
      globalheader1 : compileGlobalHeader1,
      globalheader2 : compileGlobalHeader2,
      topnav : compileTopNav,
      disclaimer : compileDisclaimer,
      relatedarticles : compileRelatedArticles,
    },

    source : {
      link : compileSourceLink,
      script : compileSourceScript,
    },

    asset : compileAsset,

};



/*COMPILE METHODS START*/

function  compileRelatedArticles($el, $cheerio) {

  var $ = $cheerio;

  var $related_articles_section = $el;
  var compiled_related_articles_section = templatesModule.render('relatedarticles');


  //insert $ektron_wrap before the $content_block,
  //insert text value of compiled_content_block into the ektron wrap
  //remove original $content_block element
  var $ektron_wrap = $('<ektron>').text(compiled_related_articles_section + '\n');
  $ektron_wrap.insertBefore($related_articles_section);
  $related_articles_section.remove();

}



function compileAsset($el) {

  var el_src = $el.attr('src');

  var asset_key = $el.attr('ek-asset');



  // retrieve asset id from assetObj
  var asset_id = assetObj[asset_key];
  //retreive asset type eg jpg, png, etc
  var asset_type = getAssetType(el_src);

  //create compiled src path//
  var compiled_src_path = 'assets/' + asset_id + '.' + asset_type;

  //assign compiled src path to the element
  $el.attr('src', compiled_src_path);

  //remove ek-asset attribute
  $el.removeAttr('ek-asset');


  function getAssetType(srcPath) {
    //eg images/temp/file.jpg ---> file.jpg
    var baseFileArray = srcPath.split('/');
    //get last array element --> file.jpg
    var baseFileName = baseFileArray[baseFileArray.length-1];
    var assetType = baseFileName.split('.')[1];

    return assetType;
  }



}



//function compile dropzone row wraps
//eg <div ek-dropzone="1" > =====> <div id="Row1" runat="server">
  function compileDropZone($el, $cheerio) {
    var $ = $cheerio;
    var $dropZone = $el;
    var dropZone_row = $dropZone.attr('ek-dropzone');
    var $dropAreas = $dropZone.find(' [ek-droparea] ');


    if ( dropZone_row === 'full' ) {

      //if no $dropAreas, compile full dropzone and make it the HTML of $dropZone
      if ( $dropAreas.length < 1 ) {
        createImmediateFullDropZone();
      }

      $dropZone.attr({
        "id" : "Row1",
        "runat" : "server",
      })
      .removeAttr("ek-dropzone");

      $dropAreas.each(function(index, el) {
        var $this = $(this);
        // eg : div ek-droparea = "1";
        var dropAreaIndex = $this.attr('ek-droparea');
        //remove ek-droparea attribute
        $this.removeAttr('ek-droparea');
        var compiledDropArea= templatesModule.render('dropzoneFull');
        $this.text(compiledDropArea + '\n');
      });
    }
    else {

      //if no $dropAreas, compile full dropzone and make it the HTML of $dropZone
      if ( $dropAreas.length < 1 ) {
        createImmediateDropZone();
      }


      $dropZone.attr({
        "id" : "Row" + dropZone_row,
        "runat" : "server",
      })
      .removeAttr("ek-dropzone");

      $dropAreas.each(function(index, el) {
        var $this = $(this);
        // eg : div ek-droparea = "1";
        var dropAreaIndex = $this.attr('ek-droparea');
        //remove ek-droparea attribute
        $this.removeAttr('ek-droparea');

        var dropZone_template_obj = {
          dropZoneRow: dropZone_row,
          dropZoneIndex: dropAreaIndex,
        };
        var compiledDropArea= templatesModule.render('dropzone', dropZone_template_obj);
        $this.text(compiledDropArea + '\n');
      });
    }


    // function used to create FULL dropzone immediately after the wrap
    function createImmediateFullDropZone() {
      //assign proper attributes
      $dropZone.attr({
        "id" : "Row1",
        "runat" : "server",
      })
      .removeAttr('ek-dropzone');

      var template_obj = {
        dropZoneRow: 1,
        dropZoneIndex: 1,
      };

      var compiled_dropZone = templatesModule.render('dropzoneFull');
      $dropZone.text(compiled_dropZone + '\n');
      return true;
    }

    // function used to create dropzone immediately after the wrap
    function createImmediateDropZone() {
      //assign proper attributes
      $dropZone.attr({
        "id" : "Row1",
        "runat" : "server",
      })
      .removeAttr('ek-dropzone');

      var template_obj = {
        dropZoneRow: dropZone_row,
        dropZoneIndex: 1,
      };

      var compiled_dropZone = templatesModule.render('dropzone', template_obj);
      $dropZone.text(compiled_dropZone + '\n');
      return false;
    }

  }




function compileContent($el) {
  var complete_HTML = extractCompleteHTML($el);
  var content_name = $el.attr('ek-name');

  //create content with the createContentFile function
  createContentFile(content_name, complete_HTML);
  $el.remove();
}


function compileContentBlock($el, $cheerio) {
  var $ = $cheerio;

  var $content_block = $el;
  var content_block_name = $content_block.attr('ek-name');
  var $content_block_html = extractCompleteHTML($content_block);
  var compiled_content_block = templatesModule.render('contentblock', {name : content_block_name} );
  //create the content file in Content directory
  createContentFile(content_block_name, $content_block_html);

  //insert $ektron_wrap before the $content_block,
  //insert text value of compiled_content_block into the ektron wrap
  //remove original $content_block element
  var $ektron_wrap = $('<ektron>').text(compiled_content_block + '\n');
  $ektron_wrap.insertBefore($content_block);
  $content_block.remove();

}


function compileFormBlock($el, $cheerio) {

  var $ = $cheerio;
  var $form_block = $el;
  var form_block_name = $form_block.attr('ek-name');
  var $form_block_html = extractCompleteHTML($form_block);
  var compiled_form_block = templatesModule.render('formblock', {name : form_block_name} );
  //create the content file in Content directory
  createContentFile(form_block_name, compiled_form_block);

  //insert $ektron_wrap before the $form_block,
  //insert text value of compiled_form_block into the ektron wrap
  //remove original $form_block element
  var $ektron_wrap = $('<ektron>').text(compiled_form_block + '\n');
  $ektron_wrap.insertBefore($form_block);
  $form_block.remove();

}


function compileGlobalFooter1($el, $cheerio) {
  var $ = $cheerio;
  var $global_footer_el = $el;
  var compiled_global_footer = templatesModule.render('globalfooter1');
  var $global_footer_html = extractCompleteHTML($global_footer_el);
  //create the content file in Content directory
  createContentFile('globalFooter1', $global_footer_html);
    //insert $ektron_wrap before the $global_footer_el,
  //insert text value of compiled_global_footer into the ektron wrap
  //remove original $global_footer_el element
  var $ektron_wrap = $('<ektron>').text(compiled_global_footer + '\n');
  $ektron_wrap.insertBefore($global_footer_el);
  $global_footer_el.remove();

}

function compileGlobalFooter2($el, $cheerio) {
  var $ = $cheerio;
  var $global_footer_el = $el;
  var compiled_global_footer = templatesModule.render('globalfooter2');
  var $global_footer_html = extractCompleteHTML($global_footer_el);
  //create the content file in Content directory
  createContentFile('globalFooter2', $global_footer_html);
    //insert $ektron_wrap before the $global_footer_el,
  //insert text value of compiled_global_footer into the ektron wrap
  //remove original $global_footer_el element
  var $ektron_wrap = $('<ektron>').text(compiled_global_footer + '\n');
  $ektron_wrap.insertBefore($global_footer_el);
  $global_footer_el.remove();

}

// add attributes {visible : "false", "id" : "SiteSmallLogo_1", "runat" : "server"}
function compileHeaderLogo($el, $cheerio) {

  $el.attr({
    "visible" : "false",
    "id" : "SiteSmallLogo_1",
    "runat" : "server",
  })
  .removeAttr('ek-type');

}

// add attributes {visible : "false", "id" : "SiteFooterLogo_1", "runat" : "server"}
function compileFooterLogo($el, $cheerio) {

  $el.attr({
    "visible" : "false",
    "id" : "SiteFooterLogo_1",
    "runat" : "server",
  })
  .removeAttr('ek-type');

}


function compileGlobalHeader1($el, $cheerio) {

  var $ = $cheerio;
  var $global_header_el = $el;
  var compiled_global_header = templatesModule.render('globalheader1');
  var $global_header_html = extractCompleteHTML($global_header_el);
  //create the content file in Content directory
  createContentFile('globalFooter1', $global_header_html);
    //insert $ektron_wrap before the $global_header_el,
  //insert text value of compiled_global_header into the ektron wrap
  //remove original $global_header_el element
  var $ektron_wrap = $('<ektron>').text(compiled_global_header + '\n');
  $ektron_wrap.insertBefore($global_header_el);
  $global_header_el.remove();

}


function compileGlobalHeader2($el, $cheerio) {

  var $ = $cheerio;
  var $global_header_el = $el;
  var compiled_global_header = templatesModule.render('globalheader2');
  var $global_header_html = extractCompleteHTML($global_header_el);
  //create the content file in Content directory
  createContentFile('globalFooter1', $global_header_html);
    //insert $ektron_wrap before the $global_header_el,
  //insert text value of compiled_global_header into the ektron wrap
  //remove original $global_header_el element
  var $ektron_wrap = $('<ektron>').text(compiled_global_header + '\n');
  $ektron_wrap.insertBefore($global_header_el);
  $global_header_el.remove();

}


function compileTopNav($el, $cheerio) {
  var $ = $cheerio;
  var $top_nav_el = $el;
  // topnav template requires obj {projectName: projectName}
  var template_obj = {
    projectName: helper.getProjectName(),
  };

  var compiled_top_nav = templatesModule.render('topnav', template_obj);
  //create the content file in Content directory
  var $top_nav_html = extractCompleteHTML($top_nav_el);
  createContentFile('topNav', $top_nav_html);
    //insert $ektron_wrap before the $top_nav_el,
  //insert text value of compiled_top_nav into the ektron wrap
  //remove original $top_nav_el element
  var $ektron_wrap = $('<ektron>').text(compiled_top_nav + '\n');
  $ektron_wrap.insertBefore($top_nav_el);
  $top_nav_el.remove();

}


//<link rel="stylesheet" href="/Templates/Smarsh/Master/ST_www_pyawaltman_com_01/path.css">
function compileSourceLink($el) {
  var href = $el.attr('href');
  var projectName = helper.getProjectName();
  var base = '/Templates/Smarsh/Master/';

  var newBase = base + projectName + '/' + href;
  $el.attr('href', newBase);
  $el.removeAttr('ek-source');

}

  //<script src="/Templates/Smarsh/Master/ST_www_pyawaltman_com_01/dist/js/main.js">
function compileSourceScript($el) {
  var src = $el.attr('src');
  var projectName = helper.getProjectName();
  var base = '/Templates/Smarsh/Master/';

  var newSrc = base + projectName + '/' + src;
  $el.attr('src', newSrc);
  $el.removeAttr('ek-source');

}



function compileContentTitle($el) {
  var $headerEl = $el;
  // Content Header element attributes {id="ContentTitle", runat="server"}
  $headerEl.attr({
    "id" : "ContentTitle",
    "runat" : "server",
  })
  .removeAttr('ek-type')
  .text('');

}


function compileDisclaimer($el) {

  var compiled_disclaimer = templatesModule.render('disclaimer');
  $el.text(compiled_disclaimer + '\n');
  //remove ek-type attribute
  $el.removeAttr('ek-type');
}





  /*HELPER FUNCTIONS*/

function createContentFile(contentName, contentHTML) {
  //retrieve Content Folder path
  var contentDirPath = helper.getPathOf('Content');
  var newContentPath = contentDirPath + '/' + contentName + '.html';
  fs.writeFileSync(newContentPath, beautify(contentHTML, { indent_size: 2 }) );
}


function extractCompleteHTML($el) {

  var $this = $el,
    $clonedEl,
    $extractWrap,
    complete_HTML; //extracted HTML that will be returned


    //clone the target element ($el)
    $clonedEl = $this.clone();
    $clonedEl.removeAttr('ek-name');
    $clonedEl.removeAttr('ek-type');


    //remove ek-attributes
    $extractWrap = $this.append(' <div id="extractWrap"></div> ').find('#extractWrap');
    // append cloned el it to the $extractWrap and extract html
    $extractWrap.append($clonedEl);

    complete_HTML = $extractWrap.html();

    return complete_HTML;


}

module.exports = {
  compile : compileMethods,
};

