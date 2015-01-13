$(document).ready(function() {

  $.isy_update_status = function(statusxml) {
    $("node",statusxml).each( function() {
      var node = $(this);
      $('button[data-address="' + $(node).attr('id') + '"]').each( function() {
        nodestatus = $.isy_get_node_status(node);
        $(this).attr('data-status', nodestatus);
        $.isy_update_button($(this));
      });
    });
  };
  
  $.isy_get_node_status = function(node) {
    var status = $(node).children("#ST").first().attr('value');
    return status;
  };
  
  $.isy_update_button = function(button) {
    button.toggleClass('btn-success', (button.attr('data-status') > 0));
  };
  
  $.isy_refresh_all = function() {
    $.get("../../rest/status", $.isy_update_status);
  };
  
  $.isy_switch = function(address, on) {
    var restaddr = "../../rest/nodes/" + encodeURIComponent(address) + "/cmd/";
    if(on) {
      restaddr += "DON";
    } else {
      restaddr += "DOF";
    }
    
    $.get(restaddr, function() {
      setTimeout($.isy_refresh_all, 2000);
    });
  };
  
  (function refreshloop(){
    setTimeout(function(){
      $.isy_refresh_all();

      // recurse
      refreshloop();
    }, 30000);
  })();
  $.isy_refresh_all();

  $("button").click(function() {
    if ($(this).attr('data-buttontype') == 'switch') {
      if($(this).attr('data-status') > 0) {
        $.isy_switch($(this).attr('data-address'), false);
      } else {
        $.isy_switch($(this).attr('data-address'), true);
      }
    }
  });
});

