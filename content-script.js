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

const _cssCodeDefault = {
    lineHeight: '1',
    fontSize: '1rem',
    fontFamily: 'Consolas',
}

const _cssApa7thDefault = {
    color: 'black',
    lineHeight: '2',
    fontSize: '1rem',
    display: 'block',
    fontFamily: 'Times New Roman',
}   

const __cssStylesHeadingLevel1 = {
    fontWeight: 'bold',
    textAlign: 'center',
}

const __cssStylesHeadingLevel2 = {
    fontWeight: 'bold',
    textAlign: 'left',
}

const __cssStylesHeadingLevel3 = {
    fontStyle: 'italic',
    textAlign: 'left',
}

const __cssStylesHeadingLevel4 = {   
    textIndent: '3rem',
    textAlign: 'left',
}

const __cssStylesParagraph = {
    textIndent: '3rem',
    textAlign: 'left',
}

const __cssStylesCitationParagraph = {
    paddingLeft: '3rem',
    textAlign: 'left',
}

const __cssStylesReferenceParagraph = {
    textIndent: '-3rem',
    paddingLeft: '3rem',    
    textAlign: 'left',
}

window.__ContextMenuIsActivated = true;
window.__ContextMenuUseCtrl = false;

window.addEventListener('load', async function () {

    tryFindEditableElements(0);

    window.__ContextMenuIsActivated = await getChromeStorageAsync('ContextMenuIsActivated', true);
    window.__ContextMenuUseCtrl = await getChromeStorageAsync('ContextMenuUseCtrl', true);
    
});

async function getChromeStorageAsync(key, defaultValue)
{
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(key, (data) => {
            if (data[key] == undefined) {
                resolve(defaultValue);
            } else {
                resolve(data[key]);
            }
        });
    });
}

function tryFindEditableElements(tentativa) {
    
    const editableElements = this.document.querySelectorAll('[contenteditable="true"]');

    if (!editableElements.length  ) {

        if(tentativa > 10){
            console.log(`Editable elements not found `);
            return;
        }
        setTimeout(() => {
            tryFindEditableElements(tentativa + 1);
        }, 1000);
        return;
    }

    if (editableElements.length > 0) {
        
        addMenuContext();
       
        for (const element of editableElements) {

            element.classList.add('sn-message-editable');   
            element.addEventListener('contextmenu', function (e) {

                if(!window.__ContextMenuIsActivated) return;
                if(window.__ContextMenuUseCtrl && !e.ctrlKey) return;

                const selection = window.getSelection();
                if (!selection.rangeCount || selection.toString().trim() == "") return;

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
    
        addMenuContextItemTitle(menu, 'APA Style 7th');

        addMenuContextItem(menu, 'Paragraph', formatarParagraph);
        addMenuContextItem(menu, 'Reference Paragraph', formatarReferenceParagraph);
        addMenuContextItem(menu, 'Citation Paragraph ', formatarCitationParagraph);
        addMenuContextItem(menu, 'Heading Level 1', formatarHeading1);
        addMenuContextItem(menu, 'Heading Level 2', formatarHeading2);
        addMenuContextItem(menu, 'Heading Level 3', formatarHeading3);
        addMenuContextItem(menu, 'Heading Level 4', formatarHeading4);
        addMenuContextItemTitle(menu, 'Code');
        addMenuContextItem(menu, 'Format code', formatCode);
        // addMenuContextItem(menu, 'Format code (Python)', formatCode.bind(null, 'python'));
        // addMenuContextItem(menu, 'Format code (C#)', formatCode.bind(null, 'csharp'));
        // addMenuContextItem(menu, 'Format code (Java)', formatCode.bind(null, 'java'));
        // addMenuContextItem(menu, 'Format code (HTML)', formatCode.bind(null, 'html'));
        // addMenuContextItem(menu, 'Format code (CSS)', formatCode.bind(null, 'css'));
        // addMenuContextItem(menu, 'Format code (Javascript)', formatCode.bind(null, 'javascript'));
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

function formatCode(language, e) {
    
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    
    const range = selection.getRangeAt(0);
    const selectedText = selection.toString();

    const preElement = document.createElement("pre");
    const codeElement = document.createElement("code");
    // codeElement.classList.add(`language-${language}`);
    codeElement.textContent = selectedText;
    preElement.appendChild(codeElement);

    hljs.highlightBlock(codeElement);

    applyStyles(preElement, _cssCodeDefault);

    applyInlineStyles(preElement);

    range.deleteContents();
    range.insertNode(preElement);
    selection.removeAllRanges

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

        const newElement = document.createElement("p");
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