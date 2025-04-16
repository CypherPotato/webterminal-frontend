const terminal = function (wrapperElement) {
    const terminalComponent =
        el("div.terminal-wrapper");

    wrapperElement.appendChild(terminalComponent);
    wrapperElement.classList.add("terminal");

    var currentInput = null;
    var inputHistoryArrowIndex = 0;
    const inputHistory = [];
    const readEventListeners = [];

    function focusInput() {
        currentInput?.focus();
    }

    function _appendText(text, type) {
        terminalComponent.appendChild(
            el("span.terminal-text", text, { classList: [type] }));
    }

    function _beginRead() {
        const input = el("span.terminal-read-input", {
            onKeyDown(event) {
                if (event.key === "Enter" && !event.shiftKey) {
                    const text = event.target.textContent;

                    if (text.length > 0) {
                        inputHistory.push(text);
                        inputHistoryArrowIndex = inputHistory.length;
                    }

                    for (const listener of readEventListeners)
                        listener(text);

                    terminalComponent.appendChild(
                        el("span.terminal-text.user-input", text + "\n"));

                    _endRead();

                } else if (event.key === "ArrowUp" && !event.shiftKey) {
                    inputHistoryArrowIndex--;
                    event.target.textContent = inputHistory[Math.max(0, Math.min(inputHistory.length - 1, inputHistoryArrowIndex))];

                } else if (event.key === "ArrowDown" && !event.shiftKey) {
                    inputHistoryArrowIndex++;
                    event.target.textContent = inputHistory[Math.max(0, Math.min(inputHistory.length - 1, inputHistoryArrowIndex))];
                }
            },
            contenteditable: "true",
            spellcheck: 'false'
        });
        terminalComponent.appendChild(input);
        input.focus();
        currentInput = input;
    }

    function _endRead() {
        terminalComponent.querySelector(".terminal-read-input")?.remove();
        currentInput = null;
    }

    terminalComponent.addEventListener("dblclick", event => {
        focusInput();
    });

    return {
        appendText(text, type) {
            _appendText(text, type);
        },
        beginRead() {
            _beginRead();
        },
        endRead() {
            _endRead();
        },
        clear() {
            terminalComponent.innerHTML = "";
        },
        onRead(listener) {
            readEventListeners.push(listener);
        }
    };
}