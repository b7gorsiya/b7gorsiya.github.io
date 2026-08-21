document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. PORTFOLIO FILTERING LOGIC
    // ==========================================
    const filterButtons = document.querySelectorAll(".filter-btn");
    const cards = document.querySelectorAll("#project-grid .card");

    function filterProjects(filter) {
        cards.forEach(card => {
            const categories = card.getAttribute("data-category") || "";
            if (filter === "all" || categories.includes(filter)) {
                card.style.display = "flex"; // Changed from 'block' to 'flex' to match card css
            } else {
                card.style.display = "none";
                // Force pause videos when the card is hidden by the filter
                pauseVideoInCard(card);
            }
        });
    }

    // Run filter initially for "recent"
    filterProjects("recent");

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            const filterValue = button.getAttribute("data-filter");
            filterProjects(filterValue);
        });
    });

    // Helper function to pause media inside a specific card when filtered out
    function pauseVideoInCard(card) {
        try {
            const video = card.querySelector('video');
            const iframe = card.querySelector('iframe');
            
            if (video) {
                video.pause();
            }
            if (iframe && iframe.src.includes('youtube.com')) {
                iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
            }
        } catch (e) {
            console.warn("Could not pause video:", e);
        }
    }


    // ==========================================
    // 2. VIDEO AUTOPLAY ON SCROLL LOGIC
    // ==========================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5 // Triggers when 50% of the video is visible on screen
    };

    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const target = entry.target;
            
            try {
                if (entry.isIntersecting) {
                    // Video is on screen -> Play
                    if (target.tagName.toLowerCase() === 'video') {
                        target.play().catch(() => {}); // Catch play errors silently
                    } else if (target.tagName.toLowerCase() === 'iframe' && target.src.includes('youtube.com')) {
                        target.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                    }
                } else {
                    // Video scrolled out of view -> Pause
                    if (target.tagName.toLowerCase() === 'video') {
                        target.pause();
                    } else if (target.tagName.toLowerCase() === 'iframe' && target.src.includes('youtube.com')) {
                        target.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                    }
                }
            } catch (error) {
                console.warn("Media interaction blocked:", error);
            }
        });
    }, observerOptions);

    // Find all HTML5 video tags and observe them
    document.querySelectorAll('video').forEach(video => {
        videoObserver.observe(video);
    });

    // Find all YouTube iframes, ensure they have the API enabled, and observe them
    document.querySelectorAll('iframe').forEach(iframe => {
        if (iframe.src.includes('youtube.com') && !iframe.src.includes('enablejsapi=1')) {
            const separator = iframe.src.includes('?') ? '&' : '?';
            iframe.src += separator + 'enablejsapi=1&mute=1';
        }
        videoObserver.observe(iframe);
    });

});
