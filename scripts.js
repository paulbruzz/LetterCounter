document.addEventListener('DOMContentLoaded', () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const editableTextbox = document.getElementById('editable-textbox');
    const nonEditableTextbox = document.getElementById('non-editable-textbox');
    const buttonsContainer = document.getElementById('buttons-container');
    const deleteButton = document.getElementById('delete-button');
    const letterCounts = {};
    const letterButtons = {};

    // Initialize alphabet buttons
    alphabet.split('').forEach(letter => {
        letterCounts[letter] = 0;

        const button = document.createElement('button');
        button.textContent = `${letter} (0)`;
        button.addEventListener('click', () => {
            if (letterCounts[letter] > 0) {
                letterCounts[letter]--;
                button.textContent = `${letter} (${letterCounts[letter]})`;
                updateButtonStyles();
                insertAtCaret(nonEditableTextbox, letter);
            }
        });
        buttonsContainer.appendChild(button);
        letterButtons[letter] = button;
    });

    // Add space button
    const spaceButton = document.createElement('button');
    spaceButton.textContent = 'Space';
    spaceButton.addEventListener('click', () => {
        insertAtCaret(nonEditableTextbox, ' ');
    });
    buttonsContainer.appendChild(spaceButton);

    // Update character counts whenever the editable textbox changes
    editableTextbox.addEventListener('input', () => {
        updateCharacterCounts();
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
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(text));
        range.collapse(false);

        // Move caret to after the inserted text
        selection.removeAllRanges();
        selection.addRange(range);
        el.focus();
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
        }
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
        const maxCount = Math.max(...Object.values(letterCounts));
        Object.keys(letterButtons).forEach(letter => {
            const count = letterCounts[letter];
            const color = getGreenShade(count, maxCount);
            letterButtons[letter].style.backgroundColor = color;
            letterButtons[letter].style.color = count > maxCount / 2 ? 'white' : 'black';
        });
    }

    // Initial character count update in case of prefilled textarea
    updateCharacterCounts();
});
