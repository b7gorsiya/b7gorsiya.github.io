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
                card.style.display = "block";
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

    // Helper function to pause media inside a specific card
    function pauseVideoInCard(card) {
        const video = card.querySelector('video');
        const iframe = card.querySelector('iframe');
        
        if (video) {
            video.pause();
        }
        if (iframe && iframe.src.includes('youtube.com')) {
            iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
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

            if (entry.isIntersecting) {
                // Video is on screen -> Play
                if (target.tagName.toLowerCase() === 'video') {
                    target.play().catch(e => console.log("Autoplay prevented by browser:", e));
                } else if (target.tagName.toLowerCase() === 'iframe') {
                    target.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                }
            } else {
                // Video scrolled out of view -> Pause
                if (target.tagName.toLowerCase() === 'video') {
                    target.pause();
                } else if (target.tagName.toLowerCase() === 'iframe') {
                    target.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                }
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
