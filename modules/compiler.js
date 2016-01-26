var fs = require('fs');
var helper = require('./helper.js');
var templatesModule = require('./templatesModule.js');



var compileMethods = {

    dropzone : compileDropZone,
    //for ek-type = * compile methods
    types : {
      content : compileContent,
      contentblock : compileContentBlock,
      contenttitle : compileContentTitle,
      formblock : compileFormBlock,
      globalfooter1 : compileGlobalFooter1,
      globalfooter2 : compileGlobalFooter2,
      headerlogo : compileHeaderLogo,
      globalheader1 : compileGlobalHeader1,
      globalheader1 : compileGlobalHeader2,
      topnav : compileTopNav,

    },

    assets : {
      link : compileAssetLink,
      script : compileAssetScript,
    },

};



/*COMPILE METHODS START*/


//function compile dropzone row wraps
//eg <div ek-dropzone="1" > =====> <div id="Row1" runat="server">
  function compileDropZone($el) {
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
        var compiledDropArea= templatesModule.render('dropzoneFull');
        $this.text(compiledDropArea + '\n\n');
      });
    }
    else {

      //if no $dropAreas, compile full dropzone and make it the HTML of $dropZone
      if ( $dropAreas.length < 1 ) {
        createImmediateFullDropZone();
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
        var dropZone_template_obj = {
          dropZoneRow: dropZone_row,
          dropZoneIndex: dropAreaIndex,
        };
        var compiledDropArea= templatesModule.render('dropzone', dropZone_template_obj);
        $this.text(compiledDropArea + '\n\n');
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
      $dropZone.text(compiled_dropZone + '\n\n');
      return;
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
        dropZoneRow: 1,
        dropZoneIndex: 1,
      };

      var compiled_dropZone = templatesModule.render('dropzone', template_obj);
      $dropZone.text(compiled_dropZone + '\n\n');
      return;
    }

  }




function compileContent($el) {
  var complete_HTML = extractCompleteHTML($el);
  var content_name = $el.attr('ek-name');
  //create content with the createContentFile function
  createContentFile(content_name, complete_HTML);
  $el.remove();
}


function compileContentBlock($el) {
  var $content_block = $el;
  var content_block_name = $content_block.attr('ek-name');
  var $content_block_html = extractCompleteHTML($content_block);
  var compiled_content_block = templatesModule.render('contentblock', {name : content_block_name} );
  //create the content file in Content directory
  createContentFile(content_block_name, $content_block_html);

  //insert $ektron_wrap before the $content_block,
  //insert text value of compiled_content_block into the ektron wrap
  //remove original $content_block element
  var $ektron_wrap = $('<ektron>').text(compiled_content_block + '\n\n');
  $ektron_wrap.insertBefore($content_block);
  $content_block.remove();

}


function compileFormBlock($el) {

  var $form_block = $el;
  var form_block_name = $form_block.attr('ek-name');
  var $form_block_html = extractCompleteHTML($form_block);
  var compiled_form_block = templatesModule.render('formblock', {name : form_block_name} );
  //create the content file in Content directory
  createContentFile(form_block_name, compiled_form_block);

  //insert $ektron_wrap before the $form_block,
  //insert text value of compiled_form_block into the ektron wrap
  //remove original $form_block element
  var $ektron_wrap = $('<ektron>').text(compiled_form_block + '\n\n');
  $ektron_wrap.insertBefore($form_block);
  $form_block.remove();

}


function compileGlobalFooter1($el) {
  var $global_footer_el = $el;
  var compiled_global_footer = templatesModule.render('globalfooter1');
  var $global_footer_html = extractCompleteHTML($global_footer_el);
  //create the content file in Content directory
  createContentFile('globalFooter1', $global_footer_html);
    //insert $ektron_wrap before the $global_footer_el,
  //insert text value of compiled_global_footer into the ektron wrap
  //remove original $global_footer_el element
  var $ektron_wrap = $('<ektron>').text(compiled_global_footer + '\n\n');
  $ektron_wrap.insertBefore($global_footer_el);
  $global_footer_el.remove();

}

function compileGlobalFooter2($el) {
  var $global_footer_el = $el;
  var compiled_global_footer = templatesModule.render('globalfooter2');
  var $global_footer_html = extractCompleteHTML($global_footer_el);
  //create the content file in Content directory
  createContentFile('globalFooter2', $global_footer_html);
    //insert $ektron_wrap before the $global_footer_el,
  //insert text value of compiled_global_footer into the ektron wrap
  //remove original $global_footer_el element
  var $ektron_wrap = $('<ektron>').text(compiled_global_footer + '\n\n');
  $ektron_wrap.insertBefore($global_footer_el);
  $global_footer_el.remove();

}

// add attributes {visible : "false", "id" : "SiteSmallLogo_1", "runat" : "server"}
function compileHeaderLogo($el) {

  $el.attr({
    "visible" : "false",
    "id" : "SiteSmallLogo_1",
    "runat" : "server",
  });

}


function compileGlobalHeader1($el) {

  var $global_header_el = $el;
  var compiled_global_header = templatesModule.render('globalheader1');
  var $global_header_html = extractCompleteHTML($global_header_el);
  //create the content file in Content directory
  createContentFile('globalFooter1', $global_header_html);
    //insert $ektron_wrap before the $global_header_el,
  //insert text value of compiled_global_header into the ektron wrap
  //remove original $global_header_el element
  var $ektron_wrap = $('<ektron>').text(compiled_global_header + '\n\n');
  $ektron_wrap.insertBefore($global_header_el);
  $global_header_el.remove();

}


function compileGlobalHeader2($el) {

  var $global_header_el = $el;
  var compiled_global_header = templatesModule.render('globalheader2');
  var $global_header_html = extractCompleteHTML($global_header_el);
  //create the content file in Content directory
  createContentFile('globalFooter1', $global_header_html);
    //insert $ektron_wrap before the $global_header_el,
  //insert text value of compiled_global_header into the ektron wrap
  //remove original $global_header_el element
  var $ektron_wrap = $('<ektron>').text(compiled_global_header + '\n\n');
  $ektron_wrap.insertBefore($global_header_el);
  $global_header_el.remove();

}


function compileTopNav($el) {

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
  var $ektron_wrap = $('<ektron>').text(compiled_top_nav + '\n\n');
  $ektron_wrap.insertBefore($top_nav_el);
  $top_nav_el.remove();

}


//<link rel="stylesheet" href="/Templates/Smarsh/Master/ST_www_pyawaltman_com_01/path.css">
function compileAssetLink($el) {
  var href = $el.attr('href');
  var projectName = helper.getProjectName();
  var base = '/Templates/Smarsh/Master/';

  var newBase = base + projectName + '/' + href;
  $el.attr('href', newBase);
  $el.removeAttr('ek-asset');

}

  //<script src="/Templates/Smarsh/Master/ST_www_pyawaltman_com_01/dist/js/main.js">
function compileAssetScript($el) {
  var src = $el.attr('src');
  var projectName = helper.getProjectName();
  var base = '/Templates/Smarsh/Master/';

  var newSrc = base + projectName + '/' + src;
  $el.attr('src', newSrc);
  $el.removeAttr('ek-asset');

}



function compileContentTitle($el) {
  var $headerEl = $el;
  // Content Header element attributes {id="ContentTitle", runat="server"}
  $headerEl.attr({
    "id" : "ContentTitle",
    "runat" : "server",
  });

}





  /*HELPER FUNCTIONS*/

function createContentFile(contentName, contentHTML) {
  //retrieve Content Folder path
  var contentDirPath = helper.getPathOf('Content');
  var newContentPath = contentDirPath + '/' + contentName + '.html';

  fs.writeFileSync(newContentPath, contentHTML);
}


function extractCompleteHTML($el) {

  var $this = $el,
    $clonedEl,
    $extractWrap,
    complete_HTML; //extracted HTML that will be returned

    //clone the target element ($el)
    $clonedEl = $this.clone();
    $extractWrap = $this.append(' <div id="extractWrap"></div> ').find('#extractWrap');
    // append cloned el it to the $extractWrap and extract html
    $extractWrap.append($clonedEl);

    complete_HTML = $extractWrap.html();

    return complete_HTML;


}

