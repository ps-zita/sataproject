
document.addEventListener("DOMContentLoaded", function() {
    const navLinks = document.querySelectorAll("nav .nav-link");

    navLinks.forEach(link => {
        link.addEventListener('mouseover', () => {
            // Remove active from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active to the hovered link
            link.classList.add('active');
        });
        link.addEventListener('mouseout', () => {
            link.classList.remove('active');
        });
    });

    // Re-apply active based on scroll
    window.addEventListener('scroll', () => {
        let current = "";
        document.querySelectorAll("section").forEach((section) => {
            const sectionTop = section.offsetTop;
            if (scrollY >= sectionTop - 50) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
});
