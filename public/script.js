/**
 * ING OMaaP AI Assistant Proposal - Interactive Scripts
 * HCLTech 2025
 */

// ==========================================
// Scroll Progress Indicator
// ==========================================
function updateScrollProgress() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    const progressBar = document.getElementById('scroll-progress');
    if (progressBar) {
        progressBar.style.width = scrolled + '%';
    }
}

window.addEventListener('scroll', updateScrollProgress);

// ==========================================
// Smooth Scrolling for Anchor Links
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// ==========================================
// Animated Number Counters
// ==========================================
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16); // 60 FPS
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Intersection Observer for triggering animations
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');
            const text = entry.target.textContent;
            const number = parseInt(text.replace(/[^0-9]/g, ''));

            if (!isNaN(number)) {
                entry.target.textContent = '0';
                setTimeout(() => {
                    animateCounter(entry.target, number);
                }, 200);
            }
        }
    });
}, observerOptions);

// Observe all stat numbers (excluding timeline stats and business context stats which have text)
document.addEventListener('DOMContentLoaded', function() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        // Only animate if parent is not timeline-stat or stat-row
        if (!stat.closest('.timeline-stat') && !stat.closest('.stat-row')) {
            counterObserver.observe(stat);
        }
    });
});

// ==========================================
// Fade-in Animation on Scroll
// ==========================================
const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-visible');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

document.addEventListener('DOMContentLoaded', function() {
    const fadeElements = document.querySelectorAll('.executive-card, .context-card, .objective-card, .metric-card, .discovery-card, .stage-card, .challenge-card, .team-member');
    fadeElements.forEach(element => {
        element.classList.add('fade-in');
        fadeInObserver.observe(element);
    });
});

// ==========================================
// Interactive Comparison Table Highlighting
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const comparisonRows = document.querySelectorAll('.comparison-row');
    comparisonRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#f8f9ff';
        });
        row.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
        });
    });
});

// ==========================================
// Sticky Navigation (if implemented)
// ==========================================
let lastScrollTop = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Add shadow to header on scroll
    if (scrollTop > 50) {
        if (header) header.classList.add('scrolled');
    } else {
        if (header) header.classList.remove('scrolled');
    }

    lastScrollTop = scrollTop;
});

// ==========================================
// Tooltip for Abbreviations
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const abbreviations = {
        'OMaaP': 'Order Management as a Platform',
        'PSS': 'Payment Services System',
        'RAG': 'Retrieval Augmented Generation',
        'RBAC': 'Role-Based Access Control',
        'GDPR': 'General Data Protection Regulation',
        'PCI DSS': 'Payment Card Industry Data Security Standard',
        'ELK': 'Elasticsearch, Logstash, Kibana',
        'MVP': 'Minimum Viable Product',
        'POC': 'Proof of Concept',
        'FTE': 'Full-Time Equivalent',
        'SOW': 'Statement of Work',
        'KPI': 'Key Performance Indicator',
        'NFR': 'Non-Functional Requirement',
        'IAM': 'Identity and Access Management',
        'PII': 'Personally Identifiable Information',
        'M365': 'Microsoft 365'
    };

    // Find all text nodes and wrap abbreviations with tooltips
    function addTooltips(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            let text = node.textContent;
            let modified = false;

            Object.keys(abbreviations).forEach(abbr => {
                const regex = new RegExp(`\\b${abbr}\\b`, 'g');
                if (regex.test(text) && !node.parentElement.classList.contains('tooltip')) {
                    modified = true;
                    text = text.replace(regex, `<span class="tooltip" title="${abbreviations[abbr]}">${abbr}</span>`);
                }
            });

            if (modified) {
                const span = document.createElement('span');
                span.innerHTML = text;
                node.parentElement.replaceChild(span, node);
            }
        } else if (node.nodeType === Node.ELEMENT_NODE &&
                   node.tagName !== 'SCRIPT' &&
                   node.tagName !== 'STYLE') {
            Array.from(node.childNodes).forEach(addTooltips);
        }
    }

    // Apply tooltips to main content (avoiding header/footer)
    const mainContent = document.querySelector('body');
    if (mainContent) {
        // addTooltips(mainContent); // Disabled by default to avoid text manipulation
    }
});

// ==========================================
// Print Optimization
// ==========================================
window.addEventListener('beforeprint', function() {
    // Expand all collapsed sections before printing
    document.querySelectorAll('.collapsible-content').forEach(content => {
        content.style.display = 'block';
    });
});

// ==========================================
// Checklist Interactivity (for demo purposes)
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const label = this.nextElementSibling;
            if (this.checked) {
                label.style.textDecoration = 'line-through';
                label.style.opacity = '0.6';
            } else {
                label.style.textDecoration = 'none';
                label.style.opacity = '1';
            }
        });
    });
});

// ==========================================
// Section Navigation Highlight
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.section');
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Could be used to highlight navigation items
                console.log('Section in view:', entry.target.id || entry.target.className);
            }
        });
    }, {
        threshold: 0.3
    });

    sections.forEach(section => {
        navObserver.observe(section);
    });
});

// ==========================================
// Dynamic Timeline Progress
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateX(-20px)';

                setTimeout(() => {
                    entry.target.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 100);
            }
        });
    }, {
        threshold: 0.5
    });

    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });
});

// ==========================================
// Gantt Chart Animation
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const ganttBars = document.querySelectorAll('.gantt-bar');
    const ganttObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                entry.target.style.width = '0';

                setTimeout(() => {
                    const targetWidth = entry.target.getAttribute('data-width') || entry.target.style.width;
                    entry.target.style.transition = 'width 1s ease';
                    entry.target.style.width = targetWidth;
                }, index * 200);
            }
        });
    }, {
        threshold: 0.5
    });

    ganttBars.forEach(bar => {
        const width = bar.style.width;
        bar.setAttribute('data-width', width);
        ganttObserver.observe(bar);
    });
});

// ==========================================
// Card Hover Effects Enhancement
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.executive-card, .objective-card, .metric-card, .stage-card, .team-member');

    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });
});

// ==========================================
// Lazy Loading for Performance
// ==========================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.addEventListener('DOMContentLoaded', function() {
        const lazyImages = document.querySelectorAll('img.lazy');
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    });
}

// ==========================================
// Export/Share Functionality
// ==========================================
function shareProposal() {
    if (navigator.share) {
        navigator.share({
            title: 'ING OMaaP AI-Powered Onboarding Assistant Proposal',
            text: 'Discovery, Assessment & MVP Delivery Proposal by HCLTech',
            url: window.location.href
        }).catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback: Copy URL to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('Proposal URL copied to clipboard!');
        });
    }
}

// ==========================================
// Performance Monitoring
// ==========================================
if ('PerformanceObserver' in window) {
    const perfObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
            console.log('Performance:', entry.name, entry.duration);
        });
    });

    perfObserver.observe({ entryTypes: ['measure', 'navigation'] });
}

// ==========================================
// Console Welcome Message
// ==========================================
console.log(
    '%c ING OMaaP AI Assistant Proposal ',
    'background: linear-gradient(135deg, #2C00FF, #8F00FF); color: white; font-size: 16px; padding: 10px; border-radius: 5px;'
);
console.log(
    '%c Prepared by HCLTech | Lead: Thomas | Tech Lead: Chitra ',
    'color: #0066FF; font-size: 12px;'
);
console.log('For technical inquiries, contact: thomas@hcltech.com');

// ==========================================
// Sticky Navigation & Section Navigation
// ==========================================

// Array of all sections in order
const sections = [
    'executive-summary',
    'problem-solution',
    'scope',
    'timeline',
    'technology',
    'success-criteria',
    'squad',
    'dependencies',
    'roadmap',
    'next-steps'
];

let currentSectionIndex = 0;

// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
});

// Highlight current section in navigation
const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            currentSectionIndex = sections.indexOf(id);

            // Update navigation links
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('current');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('current');
                }
            });

            // Update navigation arrows visibility
            updateNavigationArrows();
        }
    });
}, {
    threshold: 0.3,
    rootMargin: '-100px 0px -50% 0px'
});

// Observe all sections
document.addEventListener('DOMContentLoaded', function() {
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            navObserver.observe(section);
        }
    });
});

// ==========================================
// Floating Navigation Arrows
// ==========================================

function updateNavigationArrows() {
    const upArrow = document.getElementById('nav-arrow-up');
    const downArrow = document.getElementById('nav-arrow-down');

    // Show/hide up arrow
    if (currentSectionIndex > 0) {
        upArrow.classList.add('visible');
    } else {
        upArrow.classList.remove('visible');
    }

    // Show/hide down arrow
    if (currentSectionIndex < sections.length - 1) {
        downArrow.classList.add('visible');
    } else {
        downArrow.classList.remove('visible');
    }
}

// Navigate to previous section
document.addEventListener('DOMContentLoaded', function() {
    const upArrow = document.getElementById('nav-arrow-up');
    if (upArrow) {
        upArrow.addEventListener('click', function() {
            if (currentSectionIndex > 0) {
                const prevSection = sections[currentSectionIndex - 1];
                const element = document.getElementById(prevSection);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    }
});

// Navigate to next section
document.addEventListener('DOMContentLoaded', function() {
    const downArrow = document.getElementById('nav-arrow-down');
    if (downArrow) {
        downArrow.addEventListener('click', function() {
            if (currentSectionIndex < sections.length - 1) {
                const nextSection = sections[currentSectionIndex + 1];
                const element = document.getElementById(nextSection);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    }
});

// ==========================================
// Scroll to Top Button
// ==========================================

const scrollToTopBtn = document.getElementById('scroll-to-top');

window.addEventListener('scroll', function() {
    if (scrollToTopBtn) {
        if (window.pageYOffset > 500) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    }

    // Update sticky nav style on scroll
    const stickyNav = document.getElementById('sticky-nav');
    if (stickyNav) {
        if (window.pageYOffset > 100) {
            stickyNav.classList.add('scrolled');
        } else {
            stickyNav.classList.remove('scrolled');
        }
    }
});

// Scroll to top functionality
document.addEventListener('DOMContentLoaded', function() {
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

// ==========================================
// Keyboard Navigation
// ==========================================

document.addEventListener('keydown', function(e) {
    // Don't trigger if user is typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
    }

    // Page Up / Arrow Up - previous section
    if (e.key === 'PageUp' || (e.shiftKey && e.key === 'ArrowUp')) {
        e.preventDefault();
        if (currentSectionIndex > 0) {
            const prevSection = sections[currentSectionIndex - 1];
            const element = document.getElementById(prevSection);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }

    // Page Down / Arrow Down - next section
    if (e.key === 'PageDown' || (e.shiftKey && e.key === 'ArrowDown')) {
        e.preventDefault();
        if (currentSectionIndex < sections.length - 1) {
            const nextSection = sections[currentSectionIndex + 1];
            const element = document.getElementById(nextSection);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }

    // Home - scroll to top
    if (e.key === 'Home' && !e.ctrlKey) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // End - scroll to bottom
    if (e.key === 'End' && !e.ctrlKey) {
        e.preventDefault();
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
});

// ==========================================
// Navigation Progress Indicator (Optional)
// ==========================================

function updateNavigationProgress() {
    const totalSections = sections.length;
    const progress = ((currentSectionIndex + 1) / totalSections) * 100;
    
    const progressBar = document.querySelector('.nav-progress');
    if (progressBar) {
        progressBar.style.width = progress + '%';
    }
}

// Update progress on scroll
window.addEventListener('scroll', function() {
    updateNavigationProgress();
});

// ==========================================
// URL Hash Navigation
// ==========================================

// Handle initial hash on page load
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            setTimeout(() => {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }
});

// Update hash when navigating
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href.startsWith('#')) {
            history.pushState(null, null, href);
        }
    });
});

console.log('Navigation system initialized with', sections.length, 'sections');
