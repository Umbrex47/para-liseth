import { audio } from './audio.js';

export class Typewriter {
  constructor(options = {}) {
    this.container = options.container || null;
    this.scrollContainer = options.scrollContainer || null;
    this.onComplete = options.onComplete || (() => {});
    this.onChar = options.onChar || (() => {});
    this.activeTimeouts = [];
    this.isTyping = false;
    this.paragraphs = [];
    this.currentParagraphIndex = 0;
    this.currentCharIndex = 0;
    this.cursorEl = null;
  }

  start(paragraphs = [], container, scrollContainer, onComplete) {
    this.stop();
    this.paragraphs = paragraphs;
    this.container = container || this.container;
    this.scrollContainer = scrollContainer || this.scrollContainer;
    this.onComplete = onComplete || this.onComplete;
    this.isTyping = true;
    this.currentParagraphIndex = 0;
    this.currentCharIndex = 0;

    if (!this.container) return;

    // Reset container
    this.container.innerHTML = '';

    // Create cursor element
    this.cursorEl = document.createElement('span');
    this.cursorEl.className = 'cursor';

    // Start with the first paragraph
    this.typeNextChar();
  }

  typeNextChar() {
    if (!this.isTyping) return;

    if (this.currentParagraphIndex >= this.paragraphs.length) {
      this.finish();
      return;
    }

    const currentPText = this.paragraphs[this.currentParagraphIndex];

    // Ensure current <p> exists in container
    let pElements = this.container.querySelectorAll('p');
    let p = pElements[this.currentParagraphIndex];
    if (!p) {
      p = document.createElement('p');
      this.container.appendChild(p);
    }

    if (this.currentCharIndex < currentPText.length) {
      const char = currentPText[this.currentCharIndex];

      // Remove cursor from wherever it was, add text, re-attach cursor
      if (this.cursorEl.parentNode) {
        this.cursorEl.remove();
      }

      p.appendChild(document.createTextNode(char));
      p.appendChild(this.cursorEl);

      // Keystroke sound
      audio.playTypewriterKey(char);

      // Auto-scroll when needed (keep newest typed text in view)
      if (this.scrollContainer && (char === ' ' || char === '\n' || this.currentCharIndex % 4 === 0)) {
        this.scrollContainer.scrollTop = this.scrollContainer.scrollHeight;
      }

      this.currentCharIndex++;

      // Natural pause calculation
      let delay = 26 + Math.floor(Math.random() * 16); // 26 - 42ms base
      if (char === '.' || char === '!' || char === '?') {
        delay = 340 + Math.floor(Math.random() * 60);
      } else if (char === ',' || char === ';' || char === ':') {
        delay = 160 + Math.floor(Math.random() * 40);
      } else if (char === '«' || char === '»' || char === '"') {
        delay = 180 + Math.floor(Math.random() * 40);
      } else if (char === '…') {
        delay = 400;
      }

      const timeoutId = setTimeout(() => {
        this.typeNextChar();
      }, delay);
      this.activeTimeouts.push(timeoutId);
    } else {
      // Completed current paragraph, pause before starting the next
      this.currentParagraphIndex++;
      this.currentCharIndex = 0;

      if (this.scrollContainer) {
        this.scrollContainer.scrollTop = this.scrollContainer.scrollHeight;
      }

      const paragraphDelay = 380;
      const timeoutId = setTimeout(() => {
        this.typeNextChar();
      }, paragraphDelay);
      this.activeTimeouts.push(timeoutId);
    }
  }

  skip() {
    if (!this.isTyping) return;
    this.stopTimeouts();

    if (!this.container) return;

    this.container.innerHTML = '';
    this.paragraphs.forEach(text => {
      const p = document.createElement('p');
      p.textContent = text;
      this.container.appendChild(p);
    });

    // Re-attach cursor to last paragraph
    const lastP = this.container.querySelector('p:last-of-type');
    if (lastP) {
      lastP.appendChild(this.cursorEl);
    }

    if (this.scrollContainer) {
      this.scrollContainer.scrollTop = this.scrollContainer.scrollHeight;
    }

    this.finish();
  }

  finish() {
    this.isTyping = false;
    this.stopTimeouts();
    if (this.scrollContainer) {
      this.scrollContainer.scrollTop = this.scrollContainer.scrollHeight;
    }
    if (this.onComplete) {
      this.onComplete();
    }
  }

  stopTimeouts() {
    this.activeTimeouts.forEach(id => clearTimeout(id));
    this.activeTimeouts = [];
  }

  stop() {
    this.isTyping = false;
    this.stopTimeouts();
    if (this.cursorEl && this.cursorEl.parentNode) {
      this.cursorEl.remove();
    }
  }
}
