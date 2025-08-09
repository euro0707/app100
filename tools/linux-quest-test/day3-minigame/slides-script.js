// Day3 Pre-learning Slides JavaScript

let currentSlide = 1;
const totalSlides = 3;

// Initialize slides when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateSlideDisplay();
    updateNavigationButtons();
    updateIndicators();
});

// Navigation functions
function nextSlide() {
    if (currentSlide < totalSlides) {
        currentSlide++;
        updateSlideDisplay();
        updateNavigationButtons();
        updateIndicators();
    }
}

function previousSlide() {
    if (currentSlide > 1) {
        currentSlide--;
        updateSlideDisplay();
        updateNavigationButtons();
        updateIndicators();
    }
}

function goToSlide(slideNumber) {
    if (slideNumber >= 1 && slideNumber <= totalSlides) {
        currentSlide = slideNumber;
        updateSlideDisplay();
        updateNavigationButtons();
        updateIndicators();
    }
}

// Update slide visibility
function updateSlideDisplay() {
    // Hide all slides
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Show current slide
    const currentSlideElement = document.getElementById(`slide-${currentSlide}`);
    if (currentSlideElement) {
        currentSlideElement.classList.add('active');
    }
}

// Update navigation button states
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
        prevBtn.disabled = currentSlide === 1;
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentSlide === totalSlides;
        // Hide next button on last slide
        if (currentSlide === totalSlides) {
            nextBtn.style.visibility = 'hidden';
        } else {
            nextBtn.style.visibility = 'visible';
        }
    }
}

// Update slide indicators
function updateIndicators() {
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        if (index + 1 === currentSlide) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

// Start minigame function
function startMinigame() {
    // Save progress that user completed pre-learning slides
    localStorage.setItem('day3-slides-completed', 'true');
    
    // Show confirmation message
    const confirmed = confirm('事前学習を完了しました！\n\nミニゲームを開始しますか？');
    
    if (confirmed) {
        // Redirect to the main minigame
        window.location.href = 'index.html';
    }
}

// Keyboard navigation
document.addEventListener('keydown', function(event) {
    switch(event.key) {
        case 'ArrowLeft':
            previousSlide();
            break;
        case 'ArrowRight':
            nextSlide();
            break;
        case 'Enter':
            if (currentSlide === totalSlides) {
                startMinigame();
            } else {
                nextSlide();
            }
            break;
        case 'Escape':
            // Go back to main hub
            const goBack = confirm('事前学習を中断してメインハブに戻りますか？');
            if (goBack) {
                window.location.href = '../index.html';
            }
            break;
    }
});

// Auto-advance slides (optional feature)
let autoAdvanceEnabled = false;
let autoAdvanceTimer = null;

function enableAutoAdvance(intervalSeconds = 30) {
    if (autoAdvanceEnabled) return;
    
    autoAdvanceEnabled = true;
    autoAdvanceTimer = setInterval(() => {
        if (currentSlide < totalSlides) {
            nextSlide();
        } else {
            disableAutoAdvance();
        }
    }, intervalSeconds * 1000);
}

function disableAutoAdvance() {
    if (autoAdvanceTimer) {
        clearInterval(autoAdvanceTimer);
        autoAdvanceTimer = null;
    }
    autoAdvanceEnabled = false;
}

// Progress tracking
function trackSlideProgress() {
    const progress = {
        currentSlide: currentSlide,
        totalSlides: totalSlides,
        timestamp: new Date().toISOString(),
        day: 3
    };
    
    localStorage.setItem('slide-progress-day3', JSON.stringify(progress));
}

// Load previous progress if available
function loadSlideProgress() {
    const savedProgress = localStorage.getItem('slide-progress-day3');
    if (savedProgress) {
        try {
            const progress = JSON.parse(savedProgress);
            if (progress.currentSlide && progress.currentSlide <= totalSlides) {
                currentSlide = progress.currentSlide;
                updateSlideDisplay();
                updateNavigationButtons();
                updateIndicators();
            }
        } catch (error) {
            console.log('Progress loading failed, starting from beginning');
        }
    }
}

// Save progress when slide changes
function saveProgressOnSlideChange() {
    const originalNextSlide = nextSlide;
    const originalPreviousSlide = previousSlide;
    const originalGoToSlide = goToSlide;
    
    nextSlide = function() {
        originalNextSlide();
        trackSlideProgress();
    };
    
    previousSlide = function() {
        originalPreviousSlide();
        trackSlideProgress();
    };
    
    goToSlide = function(slideNumber) {
        originalGoToSlide(slideNumber);
        trackSlideProgress();
    };
}

// Initialize progress tracking
document.addEventListener('DOMContentLoaded', function() {
    loadSlideProgress();
    saveProgressOnSlideChange();
});

// Add smooth scrolling for better UX
function smoothScrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Call smooth scroll when slide changes
const originalUpdateSlideDisplay = updateSlideDisplay;
updateSlideDisplay = function() {
    originalUpdateSlideDisplay();
    smoothScrollToTop();
};

// Accessibility features
function initializeAccessibility() {
    // Add ARIA labels
    const slides = document.querySelectorAll('.slide');
    slides.forEach((slide, index) => {
        slide.setAttribute('aria-label', `スライド ${index + 1} / ${totalSlides}`);
        slide.setAttribute('role', 'tabpanel');
    });
    
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        indicator.setAttribute('aria-label', `スライド ${index + 1} に移動`);
        indicator.setAttribute('role', 'button');
        indicator.setAttribute('tabindex', '0');
        
        // Add keyboard support for indicators
        indicator.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                goToSlide(index + 1);
            }
        });
    });
    
    // Add ARIA live region for screen readers
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.style.position = 'absolute';
    liveRegion.style.left = '-10000px';
    liveRegion.style.top = 'auto';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.overflow = 'hidden';
    document.body.appendChild(liveRegion);
    
    // Update live region when slide changes
    const originalUpdateSlideDisplayWithA11y = updateSlideDisplay;
    updateSlideDisplay = function() {
        originalUpdateSlideDisplayWithA11y();
        liveRegion.textContent = `スライド ${currentSlide} / ${totalSlides}`;
    };
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', initializeAccessibility);

// Performance optimization: Preload next slide content
function preloadNextSlide() {
    if (currentSlide < totalSlides) {
        const nextSlideElement = document.getElementById(`slide-${currentSlide + 1}`);
        if (nextSlideElement) {
            // Trigger any lazy-loaded content
            const images = nextSlideElement.querySelectorAll('img[data-src]');
            images.forEach(img => {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
            });
        }
    }
}

// Call preload when slide changes
const originalNextSlideWithPreload = nextSlide;
nextSlide = function() {
    originalNextSlideWithPreload();
    preloadNextSlide();
};

// Error handling
window.addEventListener('error', function(event) {
    console.error('Slide system error:', event.error);
    // Fallback: ensure at least slide 1 is visible
    if (!document.querySelector('.slide.active')) {
        const firstSlide = document.getElementById('slide-1');
        if (firstSlide) {
            firstSlide.classList.add('active');
            currentSlide = 1;
            updateNavigationButtons();
            updateIndicators();
        }
    }
});

// Export functions for potential integration with other systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        nextSlide,
        previousSlide,
        goToSlide,
        startMinigame,
        getCurrentSlide: () => currentSlide,
        getTotalSlides: () => totalSlides
    };
}