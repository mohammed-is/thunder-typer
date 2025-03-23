// filepath: d:\Mohammed\projects\dev-projects\web_projects\turbo_typing\static\turbo_typing\js\keyboard.js
document.addEventListener('DOMContentLoaded', function() {
    const keyboardDiv = document.getElementById('keyboard-visualization');
    if (!keyboardDiv) return;

    // Keyboard layout (English/Arabic)
    const enRows = [
        ['`','1','2','3','4','5','6','7','8','9','0','-','=','Backspace'],
        ['Tab','q','w','e','r','t','y','u','i','o','p','[',']','\\'],
        ['Caps','a','s','d','f','g','h','j','k','l',';','\'','Enter'],
        ['Shift','z','x','c','v','b','n','m',',','.','/','Shift'],
        ['Space']
    ];
    const arRows = [
        ['ذ','1','2','3','4','5','6','7','8','9','0','-','=',' Backspace '],
        [' Tab ','ض','ص','ث','ق','ف','غ','ع','ه','خ','ح','ج','د','\\', '     '],
        [' Caps  ','ش','س','ي','ب','ل','ا','ت','ن','م','ك','ط','     Enter '],
        [' Shift   ','ئ','ء','ؤ','ر','لا','ى','ة','و','ز','ظ','       Shift '],
        [' ctrl ', 'fn', '   ', ' alt ', '         Space            ', ' alt ', '   ', ' ctrl ']
    ];
    // Finger mapping (simplified)
    const fingerMap = {
        'a':'l-pinky','s':'l-ring','d':'l-middle','f':'l-index','g':'l-index',
        'h':'r-index','j':'r-index','k':'r-middle','l':'r-ring',';':'r-pinky',
        'q':'l-pinky','w':'l-ring','e':'l-middle','r':'l-index','t':'l-index',
        'y':'r-index','u':'r-index','i':'r-middle','o':'r-ring','p':'r-pinky',
        'z':'l-pinky','x':'l-ring','c':'l-middle','v':'l-index','b':'l-index',
        'n':'r-index','m':'r-index',',':'r-middle','.':'r-ring','/':'r-pinky',
        ' ':'thumb'
        // Add Arabic mapping as needed
    };

    function renderKeyboard(activeChar, lang) {
        const rows = lang === 'ar' ? arRows : enRows;
        keyboardDiv.innerHTML = '';
        rows.forEach(row => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'keyboard-row';
            row.forEach(key => {
                const keyDiv = document.createElement('div');
                keyDiv.className = 'keyboard-key';
                keyDiv.textContent = key === ' ' ? 'Space' : key;
                if (activeChar && key === activeChar) keyDiv.classList.add('active');
                rowDiv.appendChild(keyDiv);
            });
            keyboardDiv.appendChild(rowDiv);
        });
    }

    // Initial render
    renderKeyboard('','en');

    // Listen for custom event from typing.js to highlight key
    document.addEventListener('highlightKey', function(e) {
        renderKeyboard(e.detail.char, window.lessonLang);
    });
});