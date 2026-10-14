import { gsap } from 'gsap';
import confetti from 'canvas-confetti';
import { questionsData } from './data/questions.js';
import { audio } from './utils/audio.js';
import { Typewriter } from './utils/typewriter.js';

class CosmicApp {
  constructor() {
    this.currentQuestionIndex = 0;
    this.typewriter = null;
    this.isModalOpen = false;
    this.isQuestionsPanelOpen = false;
    this.btnReadFloatingTween = null;

    // DOM Elements
    this.btnAudio = document.getElementById('audiobutton');
    this.btnRead = document.getElementById('btn-read');
    this.questionsPanel = document.getElementById('questions-panel');
    this.btnHideQuestions = document.getElementById('btn-hide-questions');
    this.questionCards = document.querySelectorAll('.question-card');

    this.modalOverlay = document.getElementById('modal-overlay');
    this.modalDialog = document.getElementById('modal-dialog');
    this.modalChapter = document.getElementById('modal-chapter');
    this.modalQuestionTitle = document.getElementById('modal-question-title');
    this.typewriterText = document.getElementById('typewriter-text');
    this.modalBody = document.querySelector('.modal-body');
    this.modalSignature = document.getElementById('modal-signature');
    this.signatureQuote = document.getElementById('signature-quote');

    this.btnCloseModal = document.getElementById('btn-close-modal');
    this.btnSoundToggle = document.getElementById('btn-sound-toggle');
    this.btnSkipTyping = document.getElementById('btn-skip-typing');
    this.btnPrevQuestion = document.getElementById('btn-prev-question');
    this.btnNextQuestion = document.getElementById('btn-next-question');
    this.navDots = document.querySelectorAll('.nav-indicators .dot');

    this.scene = document.querySelector('.scene');

    this.init();
  }

  init() {
    this.generateCosmicParticles();
    this.initTypewriter();
    this.initParallax();
    this.initEventListeners();
    this.playEntranceAnimation();
  }

  /**
   * Generates dynamic startails and planets if not already rendered
   */
  generateCosmicParticles() {
    const isMobile = window.innerWidth <= 680;
    const startailCount = isMobile ? 35 : 65;
    const planetCount = isMobile ? 15 : 30;

    const startails = document.querySelector('.startails');
    if (startails && startails.children.length === 0) {
      const fragment = document.createDocumentFragment();
      for (let i = 0; i < startailCount; i++) {
        const div = document.createElement('div');
        div.style.setProperty('--x', Math.random().toFixed(4));
        div.style.setProperty('--y', Math.random().toFixed(4));
        div.style.setProperty('--x2', (Math.random() - 0.5).toFixed(4));
        div.style.setProperty('--y2', (Math.random() - 0.5).toFixed(4));
        div.style.setProperty('--delay', Math.random().toFixed(4));
        fragment.appendChild(div);
      }
      startails.appendChild(fragment);
    }

    const planets2 = document.querySelector('.planets-2');
    if (planets2 && planets2.children.length === 0) {
      const fragment = document.createDocumentFragment();
      for (let i = 0; i < planetCount; i++) {
        const div = document.createElement('div');
        div.style.setProperty('--x', Math.random().toFixed(4));
        div.style.setProperty('--y', Math.random().toFixed(4));
        div.style.setProperty('--x2', (Math.random() - 0.5).toFixed(4));
        div.style.setProperty('--y2', (Math.random() - 0.5).toFixed(4));
        div.style.setProperty('--delay', Math.random().toFixed(4));
        fragment.appendChild(div);
      }
      planets2.appendChild(fragment);
    }
  }

  /**
   * Initializes the typewriter engine
   */
  initTypewriter() {
    this.typewriter = new Typewriter({
      container: this.typewriterText,
      scrollContainer: this.modalBody,
      onComplete: () => this.onTypingCompleted()
    });
  }

  /**
   * Soft 3D Parallax on mouse movement with requestAnimationFrame throttling
   */
  initParallax() {
    if (!this.scene) return;

    let ticking = false;
    let targetX = 0;
    let targetY = 0;

    const render = () => {
      gsap.to(this.scene, {
        rotateY: targetX,
        rotateX: targetY,
        duration: 1.2,
        ease: 'power1.out',
        overwrite: 'auto'
      });
      ticking = false;
    };

    window.addEventListener('mousemove', (e) => {
      if (this.isModalOpen) return;

      targetX = ((e.clientX / window.innerWidth) - 0.5) * 8;
      targetY = -((e.clientY / window.innerHeight) - 0.5) * 6;

      if (!ticking) {
        requestAnimationFrame(render);
        ticking = true;
      }
    }, { passive: true });

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', (e) => {
        if (this.isModalOpen || !e.gamma || !e.beta) return;
        const normX = Math.max(-1, Math.min(1, e.gamma / 30));
        const normY = Math.max(-1, Math.min(1, (e.beta - 40) / 30));

        targetX = normX * 6;
        targetY = -normY * 5;

        if (!ticking) {
          requestAnimationFrame(render);
          ticking = true;
        }
      }, { passive: true });
    }
  }

  /**
   * Entrance Animation with GSAP
   */
  playEntranceAnimation() {
    const header = document.querySelector('.liseth-header');
    const audioBtn = document.getElementById('audiobutton');

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo('.scene-container', { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 2 })
      .fromTo(header, { opacity: 0, y: -25 }, { opacity: 1, y: 0, duration: 1.2 }, '-=1.2')
      .fromTo(audioBtn, { opacity: 0, scale: 0.8 }, { opacity: 0.75, scale: 1, duration: 0.8 }, '-=0.8')
      .fromTo(this.btnRead, { opacity: 0, y: 35, scale: 0.9 }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: 'back.out(1.4)',
        onComplete: () => this.startFloatingCta()
      }, '-=0.5');
  }

  /**
   * Floating tween for "Leer respuestas" CTA button
   */
  startFloatingCta() {
    if (this.btnReadFloatingTween) this.btnReadFloatingTween.kill();
    this.btnReadFloatingTween = gsap.to(this.btnRead, {
      y: '-=6',
      duration: 2.2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  }

  /**
   * Event listeners
   */
  initEventListeners() {
    // Audio button
    this.btnAudio.addEventListener('click', () => {
      audio.toggleMusic();
    });

    // "Leer respuestas" button
    this.btnRead.addEventListener('click', () => {
      if (!audio.isMusicPlaying) {
        audio.startCelestialMusic();
      }
      this.revealQuestions();
    });

    // Hide questions button
    this.btnHideQuestions.addEventListener('click', () => {
      this.hideQuestions();
    });

    // Question card clicks
    this.questionCards.forEach((card, idx) => {
      card.addEventListener('click', () => {
        this.openModal(idx);
      });
    });

    // Modal controls
    this.btnCloseModal.addEventListener('click', () => this.closeModal());
    this.modalOverlay.addEventListener('click', (e) => {
      if (e.target === this.modalOverlay) {
        this.closeModal();
      }
    });

    // Sound toggle (no emojis)
    this.btnSoundToggle.addEventListener('click', () => {
      const enabled = audio.toggleTypewriterSound();
      this.btnSoundToggle.textContent = enabled ? 'Sonido' : 'Silencio';
    });

    // Skip typing
    this.btnSkipTyping.addEventListener('click', () => {
      if (this.typewriter) {
        this.typewriter.skip();
      }
    });

    // Navigation buttons
    this.btnPrevQuestion.addEventListener('click', () => {
      if (this.currentQuestionIndex > 0) {
        this.switchQuestion(this.currentQuestionIndex - 1);
      }
    });

    this.btnNextQuestion.addEventListener('click', () => {
      if (this.currentQuestionIndex < questionsData.length - 1) {
        this.switchQuestion(this.currentQuestionIndex + 1);
      } else {
        this.triggerStarCelebration();
        this.closeModal();
      }
    });

    // Navigation dots
    this.navDots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        if (idx !== this.currentQuestionIndex) {
          this.switchQuestion(idx);
        }
      });
    });

    // Keyboard shortcuts
    window.addEventListener('keydown', (e) => {
      if (!this.isModalOpen) return;

      if (e.key === 'Escape') {
        this.closeModal();
      } else if (e.key === 'ArrowRight' && this.currentQuestionIndex < questionsData.length - 1) {
        this.switchQuestion(this.currentQuestionIndex + 1);
      } else if (e.key === 'ArrowLeft' && this.currentQuestionIndex > 0) {
        this.switchQuestion(this.currentQuestionIndex - 1);
      }
    });
  }

  /**
   * GSAP: Reveal Question Cards
   */
  revealQuestions() {
    this.isQuestionsPanelOpen = true;
    if (this.btnReadFloatingTween) this.btnReadFloatingTween.kill();

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to(this.btnRead, {
      opacity: 0,
      scale: 0.85,
      y: 15,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        this.btnRead.style.display = 'none';
        this.questionsPanel.style.visibility = 'visible';
      }
    });

    tl.to(this.questionsPanel, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.35
    });

    tl.fromTo(this.questionCards, {
      opacity: 0,
      y: 30,
      scale: 0.95
    }, {
      opacity: 1,
      y: 0,
      scale: 1,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.15');

    tl.fromTo(this.btnHideQuestions, {
      opacity: 0,
      y: 8
    }, {
      opacity: 1,
      y: 0,
      duration: 0.35
    }, '-=0.25');
  }

  /**
   * GSAP: Hide Question Cards and restore CTA
   */
  hideQuestions() {
    this.isQuestionsPanelOpen = false;

    const tl = gsap.timeline({ defaults: { ease: 'power2.in' } });

    tl.to(this.questionCards, {
      opacity: 0,
      y: 20,
      scale: 0.96,
      stagger: 0.05,
      duration: 0.25
    })
    .to(this.btnHideQuestions, { opacity: 0, y: 8, duration: 0.15 }, '-=0.15')
    .to(this.questionsPanel, {
      opacity: 0,
      y: 15,
      scale: 0.98,
      duration: 0.25,
      onComplete: () => {
        this.questionsPanel.style.visibility = 'hidden';
        this.btnRead.style.display = 'inline-flex';
      }
    });

    tl.fromTo(this.btnRead, {
      opacity: 0,
      y: 20,
      scale: 0.9
    }, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: 'back.out(1.4)',
      onComplete: () => this.startFloatingCta()
    });
  }

  /**
   * Open Modal & Begin Typewriter Sequence
   */
  openModal(index) {
    this.currentQuestionIndex = index;
    this.isModalOpen = true;

    const q = questionsData[index];

    // Populate Modal Content
    if (this.modalChapter) {
      this.modalChapter.textContent = q.chapter;
    }
    this.modalQuestionTitle.textContent = q.title;
    this.signatureQuote.textContent = q.signature;

    // Reset Signature completely so it cannot be visible or occupy space while typing
    gsap.killTweensOf(this.modalSignature);
    this.modalSignature.style.display = 'none';
    gsap.set(this.modalSignature, { clearProps: 'all' });
    this.modalSignature.classList.remove('is-visible');

    this.typewriterText.innerHTML = '';
    if (this.modalBody) {
      this.modalBody.scrollTop = 0;
    }

    // Update Navigation UI
    this.updateModalNavigation();

    // Show Overlay & Dialog with GSAP
    this.modalOverlay.style.visibility = 'visible';
    this.modalOverlay.classList.add('is-open');

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to(this.modalOverlay, {
      opacity: 1,
      duration: 0.35
    })
    .fromTo(this.modalDialog, {
      opacity: 0,
      y: 40,
      scale: 0.95
    }, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.55,
      ease: 'power3.out'
    }, '-=0.2');

    // Start Typewriter
    setTimeout(() => {
      this.typewriter.start(q.paragraphs, this.typewriterText, this.modalBody, () => this.onTypingCompleted());
    }, 400);
  }

  /**
   * Smoothly switch between questions in the modal
   */
  switchQuestion(newIndex) {
    if (newIndex === this.currentQuestionIndex) return;

    this.typewriter.stop();
    this.currentQuestionIndex = newIndex;
    const q = questionsData[newIndex];

    gsap.to('.modal-body', {
      opacity: 0,
      y: -8,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        if (this.modalChapter) {
          this.modalChapter.textContent = q.chapter;
        }
        this.modalQuestionTitle.textContent = q.title;
        this.signatureQuote.textContent = q.signature;

        // Reset Signature completely
        gsap.killTweensOf(this.modalSignature);
        this.modalSignature.style.display = 'none';
        gsap.set(this.modalSignature, { clearProps: 'all' });
        this.modalSignature.classList.remove('is-visible');

        this.typewriterText.innerHTML = '';
        if (this.modalBody) {
          this.modalBody.scrollTop = 0;
        }
        this.updateModalNavigation();

        gsap.to('.modal-body', {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: 'power2.out',
          onComplete: () => {
            this.typewriter.start(q.paragraphs, this.typewriterText, this.modalBody, () => this.onTypingCompleted());
          }
        });
      }
    });
  }

  /**
   * Updates Prev/Next buttons and dot indicators
   */
  updateModalNavigation() {
    this.btnPrevQuestion.disabled = this.currentQuestionIndex === 0;

    if (this.currentQuestionIndex === questionsData.length - 1) {
      this.btnNextQuestion.innerHTML = `<span>Finalizar</span>`;
    } else {
      this.btnNextQuestion.innerHTML = `<span>Siguiente</span> <span>→</span>`;
    }

    this.navDots.forEach((dot, idx) => {
      if (idx === this.currentQuestionIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  /**
   * Triggered when typewriter finishes writing the answer
   */
  onTypingCompleted() {
    this.modalSignature.style.display = 'block';
    this.modalSignature.classList.add('is-visible');

    const scrollToBottom = () => {
      if (this.modalBody) {
        this.modalBody.scrollTo({
          top: this.modalBody.scrollHeight,
          behavior: 'smooth'
        });
      }
    };

    // Immediate autoscroll right when typing finishes
    scrollToBottom();

    gsap.fromTo(
      this.modalSignature,
      { opacity: 0, y: 14 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        onUpdate: () => scrollToBottom(),
        onComplete: () => scrollToBottom()
      }
    );

    this.triggerStarCelebration();

    gsap.fromTo(this.btnNextQuestion, { scale: 1 }, {
      scale: 1.08,
      duration: 0.35,
      yoyo: true,
      repeat: 3,
      ease: 'power1.inOut'
    });
  }

  /**
   * Starburst celestial celebration
   */
  triggerStarCelebration() {
    try {
      confetti({
        particleCount: 30,
        spread: 55,
        origin: { y: 0.72 },
        colors: ['#ffffff', '#f2e3c6', '#cbb4d4', '#e8e8ed'],
        shapes: ['circle'],
        scalar: 0.75,
        ticks: 140,
        gravity: 0.65
      });
    } catch (e) {
      // safe fallback
    }
  }

  /**
   * Close Modal with GSAP
   */
  closeModal() {
    this.isModalOpen = false;
    this.typewriter.stop();

    gsap.killTweensOf(this.modalSignature);
    this.modalSignature.style.display = 'none';
    gsap.set(this.modalSignature, { clearProps: 'all' });
    this.modalSignature.classList.remove('is-visible');

    const tl = gsap.timeline({
      defaults: { ease: 'power2.in' },
      onComplete: () => {
        this.modalOverlay.classList.remove('is-open');
        this.modalOverlay.style.visibility = 'hidden';
      }
    });

    tl.to(this.modalDialog, {
      opacity: 0,
      y: 30,
      scale: 0.96,
      duration: 0.25
    })
    .to(this.modalOverlay, {
      opacity: 0,
      duration: 0.25
    }, '-=0.1');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new CosmicApp();
});
