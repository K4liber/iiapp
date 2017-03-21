var page = 1;

function loadPage(href){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", href, false);
    xmlhttp.send();
    return xmlhttp.responseText;
}

/*
window.addEventListener('keydown', function(event) {
  switch (event.keyCode) {
    case 37: // Left
      page--;
      reloadContent();
    break;
    case 39: 
      page++;
      reloadContent();
    break;
  }
}, false);
*/

function loadContent(id) {
  var d = new Date();
  var n = d.getTime();
  return loadPage('/resources/' + id + '.html?co=' + n);
}

function showImage(id, src) {
  $("#imageBox").css( "display", "inline" );
  $("#fullImage").attr("src", src);
}

function newTypeset(){
  MathJax.Hub.Typeset();
}

function whiteColor() {
  $("body").css("background-color",'white');
  $("body").css("color",'black');
  $("#changeColor").css("background-color",'black');
  $("#changeColor").css("border-color",'white');
  $(".iconLogo").css("background-color",'transparent');
  $(".menu").css("background-color",'black');
}

function blackColor() {
  $("body").css("background-color",'black');
  $("body").css("color",'white');
  $("#changeColor").css("background-color",'white');
  $("#changeColor").css("border-color",'black');
  $(".iconLogo").css("background-color",'black');
  $(".menu").css("background-color",'white');
}

function loadMem(id) {
  $("#contentRight").html("<p>"+id+"</p>");
}

window.onload = function () {
  whiteColor();
  $("span").click(function() {
    $("#contentRight").html(loadContent($(this).attr('id')));
    newTypeset();
  });
  $(".imageLeft").click(function() {
    showImage($(this).attr('id'), $(this).attr('src'));
  });
  $(".imageRight").click(function() {
    showImage($(this).attr('id'), $(this).attr('src'));
  });
  $("#xIcon").click(function() {
   $("#imageBox").css( "display", "none" );
  });
  $(".mem").click(function() {
   loadMem($(this).attr('id'));
  });
  $("#changeColor").click(function() {
    var bgcolor = $("body").css("background-color");
    if ( bgcolor == 'rgb(0, 0, 0)' || bgcolor == 'black') {
      whiteColor();
    } else {
      blackColor();
    }
  });
  var iconBgColor;
  $(".iconLogo").on(
    {
      mouseenter: function() {  
        iconBgColor = $(this).css("background-color");
        $(this).css("background-color", "orange");
      },
      mouseleave: function() {
        $(this).css("background-color", iconBgColor);
      }
    }
  );
  $(".mem").on(
    {
      mouseenter: function() {  
        $("#" + $(this).attr('id') + "Leaf").css( "display", "inline" );
      },
      mouseleave: function() {
        $("#" + $(this).attr('id') + "Leaf").css( "display", "none" );
      }
    }
  );
}
   




