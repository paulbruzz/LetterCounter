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
                nonEditableTextbox.value += letter;
            }
        });
        buttonsContainer.appendChild(button);
        letterButtons[letter] = button;
    });

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
    }

    function updateButtons() {
        Object.keys(letterButtons).forEach(letter => {
            letterButtons[letter].textContent = `${letter} (${letterCounts[letter]})`;
        });
    }

    // Delete last character from non-editable textbox
    deleteButton.addEventListener('click', () => {
        const currentText = nonEditableTextbox.value;
        if (currentText.length > 0) {
            const lastChar = currentText[currentText.length - 1];
            nonEditableTextbox.value = currentText.slice(0, -1);
            if (alphabet.includes(lastChar)) {
                letterCounts[lastChar]++;
                updateButtons();
            }
        }
    });

    // Initial character count update in case of prefilled textarea
    updateCharacterCounts();
});
