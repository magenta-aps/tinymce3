// Functions for integrating TinyMCE in Obvius

function obvius_tinymce_navigator_callback(field_name, url, type, win) {
  var nav_features = ('toolbar=0,location=0,directories=0,status=0,'
      +'menubar=0,scrollbars=1,resizable=1,copyhistory=0,'
      +'width=750,height=550');

  return obvius_tinymce_navigator_callback_p(field_name, url, type, 'obvius_op=navigator', nav_features, win);
}

/* This function performs the same task as the one above, only for the
   new administration system. Notice that Tiny MCE passes the
   window-object of the opening window as the last argument. (This is
   because window.opener is an odd thing, referring to the window that
   loaded the javascript that called open, not to the window that called
   the function that called open(!)) */
function obvius_tinymce_new_navigator_callback(field_name, url, type, win) {
  return obvius_tinymce_navigator_callback_p(field_name, url, type, 'obvius_app_navigator=1', 'width=700, height=432, status=yes, scrollbars=1, resizable=1', win); /* See mason/admin/portal/util/navigator_link_start */
}

function obvius_tinymce_navigator_callback_p(field_name, url, type, arg, options, win) {


    var start_url = tinyMCE.activeEditor.getParam('document_base_url');


    // Make URL relative to /
    start_url = start_url.replace(/^https?:\/\/[^\/]+/, "");

    if(url && url.charAt(0) == '/') {
        start_url = url;
        // Remove query string:
        start_url = start_url.replace(/\?.*$/, "");
        // Add last /:
        if(! url.match(/\/$/)) {
            start_url += "/";
        }
    }

    var doctype_extra = '';
    if(type == 'image') {
        doctype_extra = "&doctype=Image&prefix=/admin";
    }

    /* The win argument - window object of the opening window - is
       optional for compability with the previous use of Tiny MCE in
       Obvius: */
    if (!win) {
      win=window;
    }

  var obvius_navigator_argument = "?obvius_app_ruby_navigator=1" + doctype_extra + '&fieldname=' + field_name + "&path=" + start_url;

  var url = "/admin/" + obvius_navigator_argument;
  win = win.open(url, '', options);

  return false;

}

