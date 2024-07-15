/*
APA 7th edition style 
Leve1 text center bold
Level 2 text left bold
Level 3 text left italic
Level 4 paragraph indent 2rem
Level 5 paragraph indent 2rem italic
Paragraph indent 2rem
Paragraph Citation padding left 2rem
Paragraph Reference hanging indent 2rem
*/

_cssCodeDefault = {
    lineHeight: '1',
    fontSize: '1rem',
    fontFamily: 'Consolas',
}

_cssApa7thDefault = {
    fontFamily: 'Times New Roman',
    color: 'black',
    lineHeight: '2',
    fontSize: '1rem',
    display: 'block',
}   

__cssStylesHeadingLevel1 = {
    fontWeight: 'bold',
    textAlign: 'center',
}

__cssStylesHeadingLevel2 = {
    fontWeight: 'bold',
    textAlign: 'left',
}

__cssStylesHeadingLevel3 = {
    fontStyle: 'italic',
    textAlign: 'left',
}

__cssStylesHeadingLevel4 = {   
    textIndent: '3rem',
    textAlign: 'left',
}

__cssStylesParagraph = {
    textIndent: '3rem',
    textAlign: 'left',
}

__cssStylesCitationParagraph = {
    paddingLeft: '3rem',
    textAlign: 'left',
}

__cssStylesReferenceParagraph = {
    textIndent: '-3rem',
    paddingLeft: '3rem',    
    textAlign: 'left',
}


window.addEventListener('load', function () {

    tryFindEditableElements(0);
});

function tryFindEditableElements(tentativa) {
    
    const editableElements = this.document.querySelectorAll('[contenteditable="true"]');

    if (!editableElements.length  ) {

        if(tentativa > 10){
            alert(`Editable elements not found `);
            return;
        }
        setTimeout(() => {
            tryFindEditableElements(tentativa + 1);
        }, 1000);
        return;
    }

    if (editableElements.length > 0) {
        
        addMenuContext();

        this.alert(`Editable elements found: ${editableElements.length} hljs: ${hljs} v:${hljs?.version}`);

        for (const element of editableElements) {

            element.classList.add('sn-message-editable');   
            element.addEventListener('contextmenu', function (e) {

                const selection = window.getSelection();
                if (!selection.rangeCount || selection.toString() == "") return;

                const menu = document.getElementById('sn-context-menu');
                if (menu != null) {
                    menu.style.display = 'block';
                    menu.style.left = e.clientX + 'px';
                    menu.style.top = e.clientY + 'px';
                    e.preventDefault();
                }
            });
        }
    }
}

window.addEventListener('mouseup', function (e) {
    const menu = document.getElementById('sn-context-menu');
    if (menu != null) {
        menu.style.display = 'none';
    }
});

function addMenuContext() {

    if (document.getElementById('sn-context') == null) {

        const menu = document.createElement('div');
        menu.id = 'sn-context-menu';
        menu.style.display = 'none';
        menu.classList.add('sn-context-menu');

        addMenuContextItemTitle(menu, 'Code');
        addMenuContextItem(menu, 'Paste code', formatarPasteCode);
        addMenuContextItem(menu, 'Format selection', formatCode);
        addMenuContextItemTitle(menu, 'APA 7th');
        addMenuContextItem(menu, 'Heading Level 1', formatarHeading1);
        addMenuContextItem(menu, 'Heading Level 2', formatarHeading2);
        addMenuContextItem(menu, 'Heading Level 3', formatarHeading3);
        addMenuContextItem(menu, 'Heading Level 4', formatarHeading4);
        addMenuContextItem(menu, 'Paragraph', formatarParagraph);
        addMenuContextItem(menu, 'Citation Paragraph ', formatarCitationParagraph);
        addMenuContextItem(menu, 'Reference Paragraph', formatarReferenceParagraph);

        document.body.appendChild(menu);
    }
}

function addMenuContextItemTitle(menu, text) {   

    const item = document.createElement('div');
    item.classList.add('sn-context-menu-item-title');
    item.innerText = text;
    menu.appendChild(item);

}

function addMenuContextItem(menu, text, func) {
    const item = document.createElement('div');
    item.classList.add('sn-context-menu-item');
    item.innerText = text;
    item.addEventListener('mousedown', func);
    menu.appendChild(item);
}

function formatCode(e) {
    
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    
    const range = selection.getRangeAt(0);
    const selectedText = selection.toString();

    const preElement = document.createElement("pre");
    const codeElement = document.createElement("code");
    codeElement.classList.add("language-python");
    codeElement.textContent = selectedText;
    preElement.appendChild(codeElement);

    hljs.highlightBlock(codeElement);

    applyStyles(preElement, _cssCodeDefault);

    applyInlineStyles(preElement);

    range.deleteContents();
    range.insertNode(preElement);
    selection.removeAllRanges

}

function formatarPasteCode(e) {

}


function formatarHeading1(e) {
    formatContent(e, __cssStylesHeadingLevel1);
}

function formatarHeading2(e) {
    formatContent(e, __cssStylesHeadingLevel2);
}

function formatarHeading3(e) {
    formatContent(e, __cssStylesHeadingLevel3);
}

function formatarHeading4(e) {
    formatContent(e, __cssStylesHeadingLevel4);
}

function formatarParagraph(e) {
    formatContent(e, __cssStylesParagraph);
}

function formatarCitationParagraph(e) {
    formatContent(e, __cssStylesCitationParagraph);
}

function formatarReferenceParagraph(e) {
    formatContent(e, __cssStylesReferenceParagraph);
}

/**
 * 
 * @param {MouseEvent} e 
 * @param {Partial<CSSStyleDeclaration>} cssStyles
 */
function formatContent(e, cssStyles) {

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    if (e.button == 0) {

        const selection = window.getSelection();
        if (!selection.rangeCount) return;
        const range = selection.getRangeAt(0);
        const selectedText = selection.toString();

        const newElement = document.createElement("apa-format");
        newElement.textContent = selectedText;

        applyStyles(newElement, _cssApa7thDefault);
        applyStyles(newElement, cssStyles);
 
        range.deleteContents();
        range.insertNode(newElement);
        selection.removeAllRanges
    }
}

function applyStyles(element, styles) {
    for (const style in styles) {
        element.style[style] = styles[style];
    }
}


function applyInlineStyles(element) {
    const keywords = element.querySelectorAll('.hljs-keyword');
    keywords.forEach(token => {
        token.style.color = 'blue';
        token.style.fontWeight = 'bold';
    });

    const strings = element.querySelectorAll('.hljs-string');
    strings.forEach(token => {
        token.style.color = 'green';
    });

    const builtIns = element.querySelectorAll('.hljs-built_in');
    builtIns.forEach(token => {
        token.style.color = 'purple';
    });

    const comments = element.querySelectorAll('.hljs-comment');
    comments.forEach(token => {
        token.style.color = 'gray';
        token.style.fontStyle = 'italic';
    });

    const numbers = element.querySelectorAll('.hljs-number');
    numbers.forEach(token => {
        token.style.color = 'orange';
    });

    const titles = element.querySelectorAll('.hljs-title');
    titles.forEach(token => {
        token.style.color = 'brown';
    });

    const functions = element.querySelectorAll('.hljs-function');
    functions.forEach(token => {
        token.style.color = 'red';
    });

    const params = element.querySelectorAll('.hljs-params');
    params.forEach(token => {
        token.style.color = 'darkblue';
    });

    const symbols = element.querySelectorAll('.hljs-symbol');
    symbols.forEach(token => {
        token.style.color = 'darkred';
    });

    const classes = element.querySelectorAll('.hljs-class');
    classes.forEach(token => {
        token.style.color = 'darkgreen';
    });

    const attrs = element.querySelectorAll('.hljs-attr');
    attrs.forEach(token => {
        token.style.color = 'darkorange';
    });
}