// Make changes to HTML after it has been loaded from the CMS
function obvius_tinymce_onload(editor, o) {
    if(o.load) {
        console.log("Content done loading");
        editor.dom.removeClass(editor.dom.select('p'), 'myclass');
        console.log("Html i editoren: " + editor.dom.getRoot().innerHTML);
    }
}

function obvius_tinymce_onsave(editor, o) {
    if(o.save) {
        console.log("Starting to save content");
        editor.dom.addClass(editor.dom.select('p'), 'myclass');
        console.log("Html i editoren: " + editor.dom.getRoot().innerHTML);
    }
}

