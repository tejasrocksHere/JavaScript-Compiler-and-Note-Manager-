// Initialize CodeMirror
const editor = CodeMirror.fromTextArea(document.getElementById('code'), {
    mode: 'javascript',
    theme: 'dracula',
    lineNumbers: true,
    autoCloseBrackets: true,
    matchBrackets: true,
    extraKeys: {
        "Ctrl-Space": "autocomplete"
    }
});

function runCode() {
    const code = editor.getValue();
    const consoleElement = document.getElementById('console');

    // Clear previous output
    consoleElement.textContent = '';

    try {
        // Capture console.log output
        const originalConsoleLog = console.log;
        console.log = function(message) {
            consoleElement.textContent += message + '\n';
        };

        // Run the code
        new Function(code)();
    } catch (error) {
        // Handle errors
        consoleElement.textContent += 'Error: ' + error.message + '\n';
    } finally {
        // Restore original console.log
        console.log = originalConsoleLog;
    }
}

function changeTheme() {
    const theme = document.getElementById('themeSelect').value;
    editor.setOption('theme', theme);
}

function saveCode() {
    const noteName = document.getElementById('noteName').value;
    const code = editor.getValue();
    if (!noteName) {
        alert('Please enter a note name.');
        return;
    }
    localStorage.setItem(noteName, code);
    alert('Note saved!');
}

function loadCode() {
    const noteName = document.getElementById('noteName').value;
    if (!noteName) {
        alert('Please enter a note name.');
        return;
    }
    const code = localStorage.getItem(noteName);
    if (code) {
        editor.setValue(code);
    } else {
        alert('Note not found.');
    }
}

function showAllNotes() {
    const notes = Object.keys(localStorage);
    const notesList = document.getElementById('notesList');

    // Clear previous content
    notesList.innerHTML = '';

    notes.forEach(note => {
        // Create a div for each note
        const noteDiv = document.createElement('div');
        noteDiv.style.display = 'flex';
        noteDiv.style.alignItems = 'center';
        noteDiv.style.marginBottom = '10px';

        // Create a span for note name
        const noteSpan = document.createElement('span');
        noteSpan.textContent = note;
        noteSpan.style.flex = '1';
        noteSpan.style.paddingRight = '10px';

        // Create a copy button
        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy';
        copyButton.style.backgroundColor = '#007acc';
        copyButton.style.border = 'none';
        copyButton.style.color = 'white';
        copyButton.style.padding = '5px 10px';
        copyButton.style.borderRadius = '4px';
        copyButton.style.cursor = 'pointer';
        copyButton.style.fontSize = '14px';
        copyButton.style.marginLeft = '10px';

        // Add click event to copy button
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(note)
                .then(() => {
                    alert('Note name copied to clipboard!');
                })
                .catch(err => {
                    console.error('Failed to copy note name:', err);
                });
        });

        // Append elements to note div
        noteDiv.appendChild(noteSpan);
        noteDiv.appendChild(copyButton);

        // Append note div to notes list
        notesList.appendChild(noteDiv);
    });

    // Show modal
    document.getElementById('notesModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('notesModal').style.display = 'none';
}

function copyNotes() {
    const notesList = document.getElementById('notesList').textContent;
    navigator.clipboard.writeText(notesList)
        .then(() => {
            alert('Note names copied to clipboard!');
        })
        .catch(err => {
            console.error('Failed to copy notes:', err);
        });
}

// Add keyboard shortcut for running code
document.addEventListener('keydown', function(event) {
    if ((event.ctrlKey || event.metaKey) && event.key === "'") {
        event.preventDefault();
        runCode();
    }
});
