(function() {
    tinymce.PluginManager.requireLangPack('kubuttons');

    tinymce.create('tinymce.plugins.KUButtons', {
	init : function(ed, url) {
	    ed.addCommand('mceKUCitat', function() {
		var html = '<div class="wrapper-quotation">';
		html += '<span class="left">';
		html += '<blockquote class="realblockquote" style="float: left; margin: 0pt 20px 10px 0pt;">';
		html += '<p>';
		html += '<span class="quote-begin">"</span>Udskift denne tekst med selve citatet. HUSK at ikke slette citationstegnene.<span class="quote-end">"</span> ';
		html += '</p>';
		html += '<p style="display: block; font-weight: normal; font-size: 0.9em; margin: 0pt; font-style: normal;" align="right">';
		html += 'Udskift denne tekst med citatets forfatter';
		html += '</p>';
		html += '</blockquote>';
		html += '</span>';
		html += '</div>';

		ed.execCommand('mceInsertContent', false, html)
	    });

	    ed.addButton('kucitat', {
		    title : 'kubuttons.citat_desc',
		    cmd : 'mceKUCitat',
		    image : url + '/img/citat.gif'
	    });

	    ed.addCommand('mceKUTilTop', function() {
		ed.execCommand("mceInsertContent", null, "<a href=\"#top\" title=\"Til toppen\" style=\"float: right;\"><img src=\"" + url + '/img/addtoplink.gif' + "\" alt=\"Til toppen\" style=\"border: 0px;\" /></a>");
	    });

	    ed.addButton('kutiltop', {
		    title : 'kubuttons.tiltop_desc',
		    cmd : 'mceKUTilTop',
		    image : url + '/img/addtoplink.gif'
	    });


	},

	getInfo : function() {
	    return {
		    longname : 'KU buttons plugin: Special buttons for the editor used by Copenhagen University',
		    author : 'Jørgen Ulrik B. Krag <jubk@magenta-aps.dk>',
		    authorurl : 'http://www.magenta-aps.dk/',
		    infourl : '',
		    version : "1.0"
	    };
	}
    });

    // Register plugin
    tinymce.PluginManager.add('kubuttons', tinymce.plugins.KUButtons);
})();