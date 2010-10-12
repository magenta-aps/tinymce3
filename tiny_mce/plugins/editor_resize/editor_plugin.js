/**
 * editor_plugin_src.js
 *
 * Copyright 2009, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://tinymce.moxiecode.com/license
 * Contributing: http://tinymce.moxiecode.com/contributing
 */

(function() {
	/**
	 * Auto Resize
	 * 
	 * This plugin automatically resizes the content area to fit its content height.
	 * It will retain a minimum height, which is the height of the content area when
	 * it's initialized.
	 */
	tinymce.create('tinymce.plugins.EditorResizePlugin', {
		/**
		 * Initializes the plugin, this will be executed after the plugin has been created.
		 * This call is done before the editor instance has finished it's initialization so use the onInit event
		 * of the editor instance to intercept that event.
		 *
		 * @param {tinymce.Editor} ed Editor instance that the plugin is initialized in.
		 * @param {string} url Absolute URL to where the plugin is located.
		 */
		init : function(ed, url) {
			var t = this;

			if (ed.getParam('fullscreen_is_enabled'))
				return;

			/**
			 * This method gets executed each time the editor needs to resize.
			 */
			function resize() {};

			t.editor = ed;

			ed.onInit.add(function(ed, l) {  
			    $(".mceIframeContainer").append('<div onmousedown="return editor_resizer(this)" style="width: 100%; height: 20px; background-color: white; cursor: s-resize;" class="tinymce_resizer"></div>');    
			});



			// Register the command so that it can be invoked by using tinyMCE.activeEditor.execCommand('mceExample');
			ed.addCommand('mceEditorResize', resize);
		},

		/**
		 * Returns information about the plugin as a name/value array.
		 * The current keys are longname, author, authorurl, infourl and version.
		 *
		 * @return {Object} Name/value array containing information about the plugin.
		 */
		getInfo : function() {
			return {
				longname : 'Editor Resize',
				author : 'Moxiecode Systems AB',
				authorurl : 'http://tinymce.moxiecode.com',
				infourl : 'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/autoresize',
				version : tinymce.majorVersion + "." + tinymce.minorVersion
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('editor_resize', tinymce.plugins.EditorResizePlugin);
})();

function editor_resizer (elem) {
  var y = null;
  $(elem).parents("table").css("height", "auto");
  $(elem).parents("td").css("height", "auto");
  var old_cursor = $('body').css("cursor");
  var iframe = $(elem).siblings("iframe");
  var height = iframe.height();
  var width = iframe.width();
  var iframe_offset = iframe.offset();
  var odh = [];

  odh.push('<div id="overlaydiv" style="');
  odh.push('position:absolute;');
  odh.push('height: ' + (Math.floor(height) + 1) + 'px;');
  odh.push('width: ' + (Math.floor(width) + 1) +  'px;');
  odh.push('top:' + iframe_offset.top + "px;");
  odh.push('left:' + iframe_offset.left + "px;");
  odh.push('z-index: 100000');
  odh.push('"></div>');

  $('body').append(odh.join(''));

  var mousemove = function (ev) {
    var ydiff;
    if (y === null) {
      y = ev.pageY;
    } else {
      ydiff = ev.pageY - y;
      iframe.css('height', (height + ydiff) + "px");
      $('#overlaydiv').css('height', (height + ydiff) + "px");
    }
    return false;
  };
  var mouseup;
  mouseup = function (ev) {
    $(document).unbind('mousemove', mousemove);
    $(document).unbind('mouseup', mouseup);
    $('body').css('cursor', old_cursor == 's-resize' ? '' : old_cursor);
    $('#overlaydiv').remove();
  };
  $(document).mousemove(mousemove);
  $(document).mouseup(mouseup);
  $('body').css('cursor', 's-resize');
  return false;
}
