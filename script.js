document.addEventListener("DOMContentLoaded", () => {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const cards = document.querySelectorAll("#project-grid .card");

    function filterProjects(filter) {
        cards.forEach(card => {
            const categories = card.getAttribute("data-category") || "";
            if (filter === "all" || categories.includes(filter)) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
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
});
