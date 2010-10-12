function obvius_tinymce_html_cleanup(type, content) {
    console.log("Calling html cleanup with type: " + type);
    switch (type) {
        case "insert_to_editor":
            // Called when loading content on startup
        case "setup_content":
            content = obvius_tinymce_remove_word_leftover(content);
            content = obvius_tinymce_fix_empty_border_attributes_in_content(content);
            content = obvius_tinymce_fix_missing_embed_end_tags(content);
            break;
        case "insert_to_editor_dom":
        case "setup_content_dom":
            obvius_tinymce_replaceWordParagraphs(content);
            obvius_tinymce_fix_caption_p_tags(content);
            obvius_tinymce_insert_img_prefix(content);
            cleanupFormatingStyles(content);
            break;
        case "get_from_editor":
        case "submit_content":
            break;
        case "get_from_editor_dom":
            // Used when transfering HTML to the edit HTML dialog
        case "submit_content_dom":
            obvius_tinymce_remove_img_prefix(content);
            cleanupFormatingStyles(content);
            break;
    }
    return content;
    console.log("Calling html cleanup with type: " + type);
}

String.prototype.startsWith = function(s) { return this.indexOf(s)==0; };

function obvius_tinymce_insert_img_prefix(rootElement) {
    obvius_tinymce_insert_or_remove_all_img_prefix(rootElement, true);
}

function obvius_tinymce_remove_img_prefix(rootElement) {
  obvius_tinymce_insert_or_remove_all_img_prefix(rootElement, false);
}

function obvius_tinymce_insert_or_remove_all_img_prefix(rootElement, insertPrefix) {
    var tmpArray = rootElement.getElementsByTagName("img");
    for (var i = (tmpArray.length - 1); i >= 0; i--) {
        var srcAttribute = tmpArray[i].getAttribute("src");
        var newSrcAttribute = obvius_tinymce_insert_or_remove_img_prefix(srcAttribute, insertPrefix);
        if (srcAttribute != newSrcAttribute) {
                tmpArray[i].setAttribute("src", newSrcAttribute);
        }
    }
}

function obvius_remove_trailing_slash(string) {
    return string.replace(/\/+$/,"");
}

function obvius_add_trailing_slash(string) {
    if (!string.match(/\/$/)) {
        return string + "/";
    } else {
        return string;
    }
}

function obvius_tinymce_insert_or_remove_img_prefix(srcAttribute, insertPrefix) {
    var obvius_img_url_prefix = tinyMCE.getParam("obvius_img_url_prefix", "");
    if (obvius_img_url_prefix.length > 0) {
        if (insertPrefix) {
            if ((srcAttribute.startsWith("/") && !srcAttribute.startsWith("/" + obvius_img_url_prefix)) || (srcAttribute.startsWith("\\") && !srcAttribute.startsWith("\\" + obvius_img_url_prefix))) {
                var ret =  obvius_remove_trailing_slash("/" + obvius_img_url_prefix + srcAttribute);
                return ret;
            }
        } else {
            if (srcAttribute.startsWith("/" + obvius_img_url_prefix) || srcAttribute.startsWith("\\" + obvius_img_url_prefix)) {
                var ret = obvius_add_trailing_slash(srcAttribute.substring(obvius_img_url_prefix.length + 1));
                return ret;
            }
        }
    }
    return srcAttribute;
}


/* DOM-based: HTML cleaup helpers */
function obvius_tinymce_replaceWordParagraphs(rootElem)
{
    /* Word has a nasty habit of using <P> of some class instead of the correct
        HTML tag. This method tries to do something about it.
    */
    var classMap = new Object();
    classMap = {
        Hoved1: "h1",
        Hoved2: "h2",
        Hoved3: "h3",
        Hoved4: "h4",
        Citat: "cite"
    };

    tmpArray = rootElem.getElementsByTagName("P");

    //Walk backwards through the array since we are modifying it as we go along
    for(i = tmpArray.length-1; i>=0 ; i--) {
        if (classMap[tmpArray[i].className] != null) {
            var newElem = document.createElement(classMap[tmpArray[i].className]);

            //Add all descendants of the old node to the new node
            var children = tmpArray[i].childNodes;
            for (n=0;n<children.length;n++) {
                nNode = children[n].cloneNode(true); //We need to clone the child because its removed later on
                newElem.appendChild(nNode);
            }

            tmpArray[i].parentNode.replaceChild(newElem, tmpArray[i]);
        }
    }
}

function obvius_tinymce_fix_caption_p_tags(rootElem) {
    var captions = rootElem.getElementsByTagName('caption');
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


function getStyleArray(e) {
    var stylesArray = tinyMCE.DOM.parseStyle(tinymce.DOM.getAttrib(e, "style"));
    tinymce.dom.DOMUtils.compressStyle(stylesArray, "border", "-width", "border-width");
    return stylesArray;
}

function cleanupFormatingStyles(rootElement) {
    replaceFormatingStylesWithTags(rootElement, "font-weight", "bold", "strong");
    replaceFormatingStylesWithTags(rootElement, "font-style", "italic", "em");
    replaceFormatingStylesWithTags(rootElement, "text-decoration", "underline", "u");
    replaceFormatingStylesWithTags(rootElement, "text-decoration", "line-through", "strike");
}

function replaceFormatingStylesWithTags(rootElement, styleAttribute, styleValue, tagName) {
    var tmpArray = rootElement.getElementsByTagName("SPAN");
    for (var i = (tmpArray.length - 1); i >= 0; i--) {
        var spanElement = tmpArray[i];
        var spanStyles = tinymce.DOM.getAttrib(spanElement, "style");
        var spanStyleRE = new RegExp(styleAttribute + ":[^;\"']*?" + styleValue + "[^;\"']*?;?\\s*", "mgi");
        var emptySpanTagRE = new RegExp("<span>", "mgi");
        var styleValueRE = new RegExp("\\s*" + styleValue + "\\s*", "mgi");
        if (spanStyleRE.test(spanStyles)) {
            var newElement = document.createElement(tagName);
            var stylesArray = tinyMCE.DOM.parseStyle(spanStyles);
            stylesArray[styleAttribute] = stylesArray[styleAttribute].replace(styleValueRE, '');
            tinyMCE.DOM.setAttrib(spanElement, "style", tinyMCE.DOM.serializeStyle(stylesArray));
            var tmpElement = document.createElement("div");
            tmpElement.appendChild(spanElement.cloneNode(false));
                if (emptySpanTagRE.test(tmpElement.innerHTML)) {
                    for (var j = 0; j < spanElement.childNodes.length; j++) {
                        newElement.appendChild(spanElement.childNodes[j].cloneNode(true));
                    }
                } else {
                    newElement.appendChild(spanElement.cloneNode(true));
                }
            spanElement.parentNode.replaceChild(newElement, spanElement);
        }
    }
}


/* String-based: HTML cleanup helpers */

function obvius_tinymce_remove_word_leftover(content){
  content = content.replace(/<\?xml.*\/>/g,'');
  content = content.replace(/\s*mso-[^;"]*;*(\n|\r)*/g,'');
  content = content.replace(/\s*page-break-after[^;]*;/g,'');
  content = content.replace(/\s*tab-interval:[^'"]*['"]/g,'');
  content = content.replace(/\s*tab-stops:[^'";]*;?/g,'');
  content = content.replace(/\s*LETTER-SPACING:[^\s'";]*;?/g,'');
  content = content.replace(/\s*class=MsoNormal/g,'');
  content = content.replace(/\s*class=MsoBodyText[2345678]?/g,'');

  content = content.replace(/<o:p>/g,'');
  content = content.replace(/<\/o:p>/g,'');

  content = content.replace(/<v:[^>]*>/g,'');
  content = content.replace(/<\/v:[^>]*>/g,'');

  content = content.replace(/<w:[^>]*>/g,'');
  content = content.replace(/<\/w:[^>]*>/g,'');

  return content;
}

function obvius_tinymce_fix_empty_border_attributes_in_content(content) {
    return content.replace(/border\s*=\s*[\"|\']\s*[\"|\']/mgi, 'border="0"');
}

function obvius_tinymce_fix_missing_embed_end_tags(content) {
        content = content.replace(/<embed(.*?)\s*\/>/mgi, '<embed$1>');
        content = content.replace(/<embed(.*?)\s*>/mgi, '<embed$1/>');
        content = content.replace(/<\/embed\s*>/gi, '');
        content = content.replace(/<embed(.*?)\s*\/>/mgi, '<embed$1></embed>');
    return content;
}
