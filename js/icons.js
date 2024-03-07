const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        const skill = entry.target;
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
});

const hiddenIcons = document.querySelectorAll('.hidden');

hiddenIcons.forEach((el) => observer.observe(el));
