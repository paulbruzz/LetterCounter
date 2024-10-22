document.addEventListener('DOMContentLoaded', () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const editableTextbox = document.getElementById('editable-textbox');
    const nonEditableTextbox = document.getElementById('non-editable-textbox');
    const buttonsContainer = document.getElementById('buttons-container');
    const deleteButton = document.getElementById('delete-button');
    const letterCounts = {};
    const letterButtons = {};

    // Load saved texts from local storage if they exist
    if (localStorage.getItem('originalText')) {
        editableTextbox.value = localStorage.getItem('originalText');
        updateCharacterCounts();  // Update counts for loaded text
    }
    if (localStorage.getItem('anagrammedText')) {
        nonEditableTextbox.textContent = localStorage.getItem('anagrammedText');
    }

    // Initialize alphabet buttons
    alphabet.split('').forEach(letter => {
        letterCounts[letter] = 0;

        const button = document.createElement('button');
        button.textContent = `${letter} (0)`;
        button.style.border = '1px solid black';
        button.addEventListener('click', () => {
            if (letterCounts[letter] > 0) {
                letterCounts[letter]--;
                button.textContent = `${letter} (${letterCounts[letter]})`;
                updateButtonStyles();
                insertAtCaret(nonEditableTextbox, letter);
                saveAnagrammedText();  // Save anagrammed text to local storage
            }
        });
        buttonsContainer.appendChild(button);
        letterButtons[letter] = button;
    });

    // Add space button
    const spaceButton = document.createElement('button');
    spaceButton.textContent = 'Space';
    spaceButton.style.border = '1px solid black';
    spaceButton.addEventListener('click', () => {
        insertAtCaret(nonEditableTextbox, ' ');
        saveAnagrammedText();  // Save anagrammed text to local storage
    });
    buttonsContainer.appendChild(spaceButton);

    // Update character counts whenever the editable textbox changes
    editableTextbox.addEventListener('input', () => {
        updateCharacterCounts();
        saveOriginalText();  // Save original text to local storage
    });

    function updateCharacterCounts() {
        const text = editableTextbox.value.toUpperCase();
        Object.keys(letterCounts).forEach(letter => letterCounts[letter] = 0);
        text.split('').forEach(char => {
            if (alphabet.includes(char)) {
                letterCounts[char]++;
            }
        });
        updateButtons();
        updateButtonStyles();
    }

    function updateButtons() {
        Object.keys(letterButtons).forEach(letter => {
            letterButtons[letter].textContent = `${letter} (${letterCounts[letter]})`;
        });
    }

    // Insert text at the caret position in a contenteditable div
    function insertAtCaret(el, text) {
        el.focus();
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        range.deleteContents();
        const textNode = document.createTextNode(text);
        range.insertNode(textNode);
        range.setStartAfter(textNode);
        range.setEndAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    // Delete character from non-editable textbox at the selected position
    deleteButton.addEventListener('click', () => {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            if (!range.collapsed) {
                // Delete selected range
                const selectedText = range.toString();
                selectedText.split('').forEach(char => {
                    if (alphabet.includes(char)) {
                        letterCounts[char]++;
                    }
                });
                range.deleteContents();
            } else if (range.startOffset > 0) {
                // Delete single character at the caret position
                range.setStart(range.startContainer, range.startOffset - 1);
                const charToDelete = range.toString();
                range.deleteContents();
                if (alphabet.includes(charToDelete)) {
                    letterCounts[charToDelete]++;
                }
            }
            updateButtons();
            updateButtonStyles();
            saveAnagrammedText();  // Save updated anagrammed text after deletion
        }
    });

    // Make the non-editable textbox truly non-editable
    nonEditableTextbox.addEventListener('keydown', (e) => {
        e.preventDefault();
    });

    // Calculate pastel green color based on count
    function getGreenShade(count, maxCount) {
        if (count === 0) return '#e0e0e0'; // Light grey for 0 occurrences
        const ratio = count / maxCount;
        const greenValue = Math.round(255 - (ratio * 155)); // Darker green as count increases
        return `rgb(0, ${greenValue}, 0)`;
    }

    // Update button styles based on counts
    function updateButtonStyles() {
        const maxCount = Math.max(...Object.values(letterCounts), 1); // Ensure maxCount is at least 1
        Object.keys(letterButtons).forEach(letter => {
            const count = letterCounts[letter];
            const color = getGreenShade(count, maxCount);
            letterButtons[letter].style.backgroundColor = color;
            letterButtons[letter].style.color = count > maxCount / 2 ? 'white' : 'black';
        });
    }

    // Save original text to local storage
    function saveOriginalText() {
        localStorage.setItem('originalText', editableTextbox.value);
    }

    // Save anagrammed text to local storage
    function saveAnagrammedText() {
        localStorage.setItem('anagrammedText', nonEditableTextbox.textContent);
    }

    // Initial character count update in case of prefilled textarea
    updateCharacterCounts();
});
