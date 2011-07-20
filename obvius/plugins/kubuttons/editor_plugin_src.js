(function() {
    tinymce.PluginManager.requireLangPack('kubuttons');

    /* Overrule the inline popup dialog height in gecko */
    tinymce.create('tinymce.KUWindowManager:tinymce.InlineWindowManager', {
	KUWindowManager : function(ed) {
		this.parent(ed);
	},

	confirm : function(txt, cb, s) {
	    var t = this, w, h = t.editor.settings.kubuttons_gecko_dialog_height || 170;
	    w = t.open({
		title : t,
		type : 'confirm',
		button_func : function(s) {
			if (cb)
				cb.call(s || t, s);

			t.close(null, w.id);
		},
		content : tinymce.DOM.encode(t.editor.getLang(txt, txt)),
		inline : 1,
		width : 400,
		height : h
	    });
	    tinymce.DOM.get(w.id + "_content").style.height = (h - 80) + "px";
	},

	alert : function(txt, cb, s) {
	    var t = this, w, h = t.editor.settings.kubuttons_gecko_dialog_height || 170;

	    w = t.open({
		title : t,
		type : 'alert',
		button_func : function(s) {
			if (cb)
				cb.call(s || t, s);

			t.close(null, w.id);
		},
		content : tinymce.DOM.encode(t.editor.getLang(txt, txt)),
		inline : 1,
		width : 400,
		height : h
	    });
	    tinymce.DOM.get(w.id + "_content").style.height = (h - 80) + "px";
	}

    });


    tinymce.create('tinymce.plugins.KUButtons', {
	init : function(ed, url) {

	    /* Enable inline popup overrulings */
	    ed.onBeforeRenderUI.add(function() {
		if(tinymce.isGecko)
		    ed.windowManager = new tinymce.KUWindowManager(ed);
	    });



	    ed.addCommand('mceKUCitat', function() {
		var html = '<div class="wrapper-quotation">';
		html += '<span class="left">';
		html += '<blockquote class="realblockquote" style="float: left; margin: 0pt 20px 10px 0pt;">';
		html += '<p>';
		html += '<span class="quote-begin">"</span>Udskift denne tekst med selve citatet. HUSK ikke at fjerne citationstegnet! ';
		html += '</p>';
		html += '<p style="display: block; font-weight: normal; font-size: 0.9em; margin: 0pt; font-style: normal;" align="right">';
		html += 'Udskift denne tekst med citatets forfatter';
		html += '</p>';
		html += '</blockquote>';
		html += '</span>';
		html += '</div>';
		html += '<p>Fortsæt almindelig tekst her.</p>';

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

	    /* kupasteword is basically the original tinymce paste button with the pastefromword icon.
	      This is have the same functionality as from the old editor when clicking the pastefromword button.
	      We expect the paste plugin to catch any actual word content and apply the neccessary filters.
	    */
	    ed.addButton('kupasteword', {
		    title : 'paste.paste_word_desc',
		    'class' : "mce_pasteword",
		    cmd : 'Paste'
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