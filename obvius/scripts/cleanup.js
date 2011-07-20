// Make changes to HTML after it has been loaded from the CMS
function obvius_tinymce_cleanup_after_set(editor, o) {
    if(o.load) {
        obvius_tinymce_cleanup_after_load(editor, o)
    }
}

function obvius_tinymce_cleanup_after_load(editor, o) {
    // Convert onclick="this.target='_whatever'" to target="_whatever"
    var targetRegEx = new RegExp("^this.target='([^']+)'$");
    tinymce.each(editor.dom.select('a'), function(a) {
        var onclick = editor.dom.getAttrib(a, 'onclick');
        var match = targetRegEx.exec(onclick);
        if(match && match.length > 1) {
            editor.dom.setAttrib(a, 'onclick', null);
            editor.dom.setAttrib(a, 'target', match[1]);
        }
    })

    // Convert <div class="indent"></div> to padding-left on contained
    // elements.
    if(editor.getParam('obvius_convert_indentation_to_divs')) {
        var indentation = editor.getParam('indentation') || '30px';

        var indent_unit = indentation.substr(indentation.length - 2, 2) || '';
        if(indent_unit != "pt")
            indent_unit = "px";
        
        indentation = parseInt(indentation);
        
        var rootChildren = editor.dom.getRoot().childNodes;
        for(var i = rootChildren.length-1;i>=0;i--) {
            elem = rootChildren[i];

            if(!elem.tagName || elem.tagName.toLowerCase() != 'div')
                continue;

            if(!editor.dom.hasClass(elem, "indent"))
                continue;
            
            var indent_amount = indentation;
            

            var currentDiv = elem;
            
            var done = false;
            
            while(! done) {
                var indentChildren = tinymce.grep(currentDiv.childNodes, function(elem) {
                    if(!elem.tagName || elem.tagName.toLowerCase() != 'div')
                        return false;
                    return editor.dom.hasClass(elem, "indent");
                });

                if(indentChildren.length > 0) {
                    indent_amount += indentation;
                    currentDiv = indentChildren[0];
                } else {
                    done = true;
                }
            }

            var children = currentDiv.childNodes;
            for(var j=children.length - 1;j>=0;j--) {
                var child = children[j];
                currentDiv.removeChild(child);
                if(child.tagName)
                    editor.dom.setStyle(child, "padding-left", indent_amount + indent_unit);
                editor.dom.insertAfter(child, elem); // elem is the original top div
            }

            editor.dom.remove(elem);
        };
    }    
}


function obvius_tinymce_cleanup_before_get(editor, o) {
    if(o.save) {
        obvius_tinymce_cleanup_before_save(editor, o);
    }
}

function obvius_tinymce_cleanup_before_save(editor, o) {
    // Convert target="_whatever" to onclick="this.target='_whatever'"
    tinymce.each(editor.dom.select('a'), function(a) {
        var target = editor.dom.getAttrib(a, "target");
        if(target) {
            editor.dom.setAttrib(a, "target", null);
            editor.dom.setAttrib(a, "onclick", "this.target='" + target + "'");
        }
    })
    
    // Convert padding-left indentation to nested <div class="indent">
    // </div> 
    if(editor.getParam('obvius_convert_indentation_to_divs')) {
        var indentation = parseInt(editor.getParam('indentation') || '30px');
        var rootChildren = editor.dom.getRoot().childNodes;
        tinymce.each(rootChildren, function(elem) {
            var indent_value;
            if(editor.dom.getAttrib(elem, 'style')) // Need this check to avoid getStyle error >_<
                indent_value = editor.dom.getStyle(elem, "padding-left") || '';
            if(indent_value) {
                indent_value = parseInt(indent_value);
    
                var divsToCreate = Math.ceil(indent_value / indentation);
    
                if(divsToCreate > 0) {
                    editor.dom.setStyle(elem, "padding-left", null);
                    
                    // Create the innermost div
                    var innerDiv = editor.dom.create('div');
                    editor.dom.addClass(innerDiv, "indent");
    
                    // Add the original element to the innermost div:
                    innerDiv.appendChild(elem.cloneNode(true));
    
                    var current = innerDiv;
    
                    // create the rest of the divs
                    for(var i=1;i<divsToCreate;i++) {
                        var div = editor.dom.create('div');
                        editor.dom.addClass(div, "indent");
                        div.appendChild(current);
                        current = div;
                    }
    
                    editor.dom.replace(current, elem);    
                }
            }
    
        });
    }
    
    // Remove <p> tags inside table captions
    var captions = editor.dom.select('caption');
    if(captions) {
        for(var i=0;i<captions.length;i++) {
            var caption = captions[i];
            var paragraphs = caption.getElementsByTagName('p');
            if(paragraphs) {
                for(var j=0;j<paragraphs.length;j++) {
                    var paragraph = paragraphs[j];
                    for(var k=0;k<paragraph.childNodes.length;k++) {
                        paragraph.parentNode.insertBefore(paragraph.childNodes[k].cloneNode(true), paragraph);
                    }
                    paragraph.parentNode.removeChild(paragraph);
                }
            }
        }
    }    
}


function obvius_tinymce_cleanup_on_get(editor, o) {
    if(o.cleanup && editor.plugins.paste && !o.wordcleaned) {
        var pp = editor.plugins.paste;
        pp.onPreProcess.dispatch(pp, o);
        o.node = editor.dom.create('div', 0, o.content);
        pp.onPostProcess.dispatch(pp, o);
        o.content = editor.serializer.serialize(o.node, {getInner : 1});
        o.wordcleaned = true;
    }

    o.content = obvius_tinymce_fix_missing_embed_end_tags(o.content);
}

function obvius_tinymce_pasteword_cleanup_dom(editor, o) {
    // Fixup <li> items that start with a <br />
    var lis = o.node.getElementsByTagName('li');
    for(var i=0;i<lis.length;i++) {
        var li = lis[i];
        if(li.firstChild && li.firstChild.tagName && li.firstChild.tagName.toLowerCase() == 'br')
            li.removeChild(li.firstChild);
    }
    
    var tables = o.node.getElementsByTagName('table');
    for(var i=0;i<tables.length;i++) {
        var t = tables[i];
        if(t.border) t.border=0;
    }
}

function obvius_tinymce_fix_missing_embed_end_tags(content) {
        content = content.replace(/<embed(.*?)\s*\/>/mgi, '<embed$1>');
        content = content.replace(/<embed(.*?)\s*>/mgi, '<embed$1/>');
        content = content.replace(/<\/embed\s*>/gi, '');
        content = content.replace(/<embed(.*?)\s*\/>/mgi, '<embed$1></embed>');
    return content;
}
