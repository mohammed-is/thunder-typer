document.addEventListener('DOMContentLoaded', function () {
    const content = window.lessonContent || '';
    const textBox = document.getElementById('text-box');
    const restartBtn = document.getElementById('restart-btn');
    const nextBtn = document.getElementById('next-btn');
    const wpmSpan = document.getElementById('wpm');
    const accuracySpan = document.getElementById('accuracy');
    const timerSpan = document.getElementById('timer');

    if (!textBox) {
        console.error('Error: #text-box element not found in the DOM.');
        return;
    }

    let userInput = [];
    let startTime = null;
    let timerInterval = null;
    let finished = false;

    function renderContent() {
        let correct;
        if (!content || content.length === 0) {
            console.error('Error: Lesson content is undefined or empty.');
            return;
        }
        let html = '';
        for (let i = 0; i < content.length; i++) {
            let charClass = '';
            if (userInput[i] !== undefined) {
                if (userInput[i] === content[i]) {
                    charClass = 'char-correct';
                    correct = true;
                } else if (userInput[i] === null) {
                    charClass = 'char-corrected';
                } else {
                    charClass = 'char-wrong';
                }
            }
            if (i === userInput.length && !finished) {
                charClass += ' char-current';
            }
            html += `<span class="char ${charClass}">${content[i] === ' ' ? '&nbsp;' : content[i]}</span>`;
        }
        textBox.innerHTML = html;
        // Highlight keyboard
        const currentChar = content[userInput.length] || '';
        document.dispatchEvent(new CustomEvent('highlightKey', {detail: {char: currentChar}}));
        // Auto-scroll
        const currentSpan = textBox.querySelector('.char-current');
        if (currentSpan) currentSpan.scrollIntoView({block:'nearest'});
        if (correct && userInput.length === content.length) finishTyping();
    }

    function startTimer() {
        startTime = Date.now();
        timerInterval = setInterval(() => {
            let elapsed = Math.floor((Date.now() - startTime) / 1000);
            timerSpan.textContent = `Time: ${elapsed}s`;
        }, 1000);
    }

    function updateStats() {
        let elapsed = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
        let words = userInput.join('').trim().split(/\s+/).length;
        let wpm = Math.round(words / (elapsed / 60));
        let correct = 0;
        for (let i = 0; i < content.length; i++) {
            if (userInput[i] === content[i]) correct++;
        }
        let accuracy = Math.round((correct / content.length) * 100);
        wpmSpan.textContent = `WPM: ${wpm}`;
        accuracySpan.textContent = `Accuracy: ${accuracy}%`;
    }

    function handleKey(e) {
        if (finished) return;
        if (!startTime) startTimer();
        if (e.key === 'Backspace') {
            if (userInput.length > 0) {
                if (userInput[userInput.length - 1] !== content[userInput.length - 1]) {
                    userInput[userInput.length - 1] = null;
                } else {
                    userInput.pop();
                }
            }
        } else if (e.key.length === 1) {
            userInput[userInput.length] = e.key;
        }
        renderContent();
        updateStats();
    }

    function finishTyping() {
        clearInterval(timerInterval);
        finished = true;
        restartBtn.hidden = true;
        nextBtn.hidden = null;
        nextBtn.focus();
    }

    function resetTyping() {
        userInput = [];
        finished = false;
        startTime = null;
        clearInterval(timerInterval);
        timerSpan.textContent = 'Time: 0s';
        wpmSpan.textContent = 'WPM: 0';
        accuracySpan.textContent = 'Accuracy: 100%';
        renderContent();
        textBox.focus();
    }

    textBox.setAttribute('tabindex', '0');
    textBox.addEventListener('keydown', handleKey);
    textBox.addEventListener('click', function () { textBox.focus(); });
    nextBtn.addEventListener('click', function () {
        if (window.lessonOrder < window.lessonCount) window.location = `/lesson/${window.lessonId + 1}/`;
    });
    restartBtn.addEventListener('click', resetTyping);
    renderContent();
    resetTyping();
});