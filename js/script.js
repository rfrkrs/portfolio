document.addEventListener("DOMContentLoaded", () => {
  const backToTop = document.querySelector(".back-to-top");
  const navLinks = [...document.querySelectorAll(".nav-link")];
  const sections = [...document.querySelectorAll("main section[id]")];
  const filterButtons = document.querySelectorAll(".filter-btn");
  const activityGrid = document.getElementById("activityGrid");
  const modal = document.getElementById("activityModal");
  const modalImage = document.getElementById("modalImg");
  const modalPlaceholder = document.getElementById("modalPlaceholder");
  const modalTitle = document.getElementById("activityModalLabel");

  const activities = [
    {
      type: "quizzes",
      category: "Quiz",
      title: "Quiz #1",
      date: "August 25, 2026",
      dateIcon: "bi-calendar",
      score: "16 / 20",
      status: "Completed",
      statusClass: "status-completed",
      image: "assets/images/tasks/quizzes/quiz-1.jpg",
      icon: "bi-journal-text",
    },
    {
      type: "quizzes",
      category: "Quiz",
      title: "Quiz #2",
      date: "To be completed",
      dateIcon: "bi-hourglass",
      status: "Not Yet Available",
      statusClass: "status-pending",
      image: "",
      icon: "bi-journal-text",
    },
    {
      type: "quizzes",
      category: "Quiz",
      title: "Quiz #3",
      date: "To be completed",
      dateIcon: "bi-hourglass",
      status: "Not Yet Available",
      statusClass: "status-pending",
      image: "",
      icon: "bi-journal-text",
    },
    {
      type: "activities",
      category: "Activity",
      title: "Activity #1",
      date: "To be completed",
      dateIcon: "bi-hourglass",
      status: "Not Yet Available",
      statusClass: "status-pending",
      image: "",
      icon: "bi-journal-text",
    },
    {
      type: "midterms",
      category: "Midterms",
      title: "Midterms",
      date: "To be completed",
      dateIcon: "bi-hourglass",
      status: "Not Yet Available",
      statusClass: "status-pending",
      image: "",
      icon: "bi-journal-text",
    },
    {
      type: "finals",
      category: "Finals",
      title: "Finals",
      date: "To be completed",
      dateIcon: "bi-hourglass",
      status: "Not Yet Available",
      statusClass: "status-pending",
      image: "",
      icon: "bi-journal-text",
    },
  ];

  const safeImageUrl = (imagePath) => (imagePath ? encodeURI(imagePath) : "");

  const getActivityMediaMarkup = (activity) => {
    if (activity.image) {
      return `
        <div class="activity-media">
          <img src="${safeImageUrl(activity.image)}" alt="${activity.title} proof" />
        </div>
      `;
    }

    return `
      <div class="activity-media activity-placeholder">
        <i class="bi bi-image"></i>
        <span>Proof Not Yet Available</span>
      </div>
    `;
  };

  const renderActivities = (filter = "all") => {
    const visibleActivities = activities.filter(
      (activity) => filter === "all" || activity.type === filter,
    );

    activityGrid.innerHTML = visibleActivities
      .map((activity) => {
        const hasScore = Boolean(activity.score);
        const hasImage = Boolean(activity.image);

        return `
          <div class="col-md-6 col-lg-4 activity-item" data-type="${activity.type}">
            <article class="activity-card h-100">
              ${getActivityMediaMarkup(activity)}

              <div class="activity-content">
                <div class="activity-header">
                  <span class="activity-category"><i class="bi ${activity.icon}"></i> ${activity.category}</span>
                  <span class="activity-status ${activity.statusClass}">${activity.status}</span>
                </div>

                <h3>${activity.title}</h3>
                <p class="activity-date"><i class="bi ${activity.dateIcon}"></i> ${activity.date}</p>

                ${hasScore ? `<strong class="activity-score">Score: ${activity.score}</strong>` : ""}

                ${hasImage ? `
                  <button
                    class="btn btn-outline-accent btn-sm activity-button"
                    data-bs-toggle="modal"
                    data-bs-target="#activityModal"
                    data-title="${activity.title}"
                    data-image="${safeImageUrl(activity.image)}"
                  >
                    <i class="bi bi-eye"></i> View Proof
                  </button>
                ` : ""}
              </div>
            </article>
          </div>
        `;
      })
      .join("");
  };

  window.addEventListener(
    "scroll",
    () => {
      backToTop.classList.toggle("visible", window.scrollY > 500);
    },
    { passive: true },
  );

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const menu = document.getElementById("navbarNav");
      if (menu.classList.contains("show")) {
        bootstrap.Collapse.getOrCreateInstance(menu).hide();
      }
    });
  });

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) =>
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${entry.target.id}`,
            ),
          );
        }
      });
    },
    { rootMargin: "-35% 0px -55%", threshold: 0 },
  );
  sections.forEach((section) => sectionObserver.observe(section));

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      filterButtons.forEach((btn) => btn.classList.toggle("active", btn === button));
      renderActivities(filter);
    });
  });

  modal.addEventListener("show.bs.modal", (event) => {
    const trigger = event.relatedTarget;
    const title = trigger.dataset.title || "Activity";
    const image = trigger.dataset.image || "";

    if (image) {
      modalImage.src = safeImageUrl(image);
      modalImage.alt = `${title} proof`;
      modalImage.style.display = "block";
      modalPlaceholder.style.display = "none";
    } else {
      modalImage.removeAttribute("src");
      modalImage.style.display = "none";
      modalPlaceholder.style.display = "flex";
    }

    modalTitle.textContent = title;
  });

  renderActivities();
});
