/*
 * Generic Obvius plugin
 *
 *
 */

(function() {
	// Load plugin specific language pack
	tinymce.PluginManager.requireLangPack('obvius');

	tinymce.create('tinymce.plugins.obviusPlugin', {
		init : function(ed, url) {
	
		},

		getInfo : function() {
			return {
				longname : 'Obvius plugin',
				author : 'Ole Hejlskov',
				authorurl : 'http://magenta-aps.dk',
				infourl : '',
				version : "1.0"
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('obvius', tinymce.plugins.obviusPlugin);
})();