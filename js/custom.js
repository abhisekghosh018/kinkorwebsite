// menu-active.js
document.addEventListener("DOMContentLoaded", function () {
  const navLinks = Array.from(
    document.querySelectorAll(".navbar-nav .nav-link")
  );

  if (!navLinks.length) return;

  // Utility: normalize a pathname (remove trailing slash, use 'index.html' for root)
  function normalizePathname(pathname) {
    if (!pathname) return "/";
    // Remove query and hash if somehow present
    pathname = pathname.split("?")[0].split("#")[0];
    // Remove trailing slash except for root
    if (pathname !== "/" && pathname.endsWith("/"))
      pathname = pathname.slice(0, -1);
    // Convert root to index.html to compare file names easily
    if (pathname === "/") return "/index.html";
    return pathname;
  }

  // Get current page normalized path and filename
  const currentPath = normalizePathname(window.location.pathname);
  const currentFile = currentPath.split("/").pop().toLowerCase();

  // Remove any existing .active classes (safe)
  function clearActive() {
    navLinks.forEach((l) => l.classList.remove("active"));
  }

  // Try to match a link with the current location
  function matchAndActivate() {
    clearActive();

    // Strategy in order:
    // 1) If link has data-page and it matches current (full or filename)
    // 2) If link href pathname equals currentPath
    // 3) If link filename equals currentFile
    // 4) If link href is just a hash and the page contains that element (optional)
    // Activate the first matching link.
    for (const link of navLinks) {
      const dataPage = (link.getAttribute("data-page") || "")
        .toLowerCase()
        .trim();
      const href = link.getAttribute("href") || "";
      // Build absolute URL to parse pathname (handles relative links)
      let linkUrl;
      try {
        linkUrl = new URL(href, window.location.origin);
      } catch (e) {
        linkUrl = null;
      }

      const linkPath = linkUrl ? normalizePathname(linkUrl.pathname) : null;
      const linkFile = linkPath ? linkPath.split("/").pop().toLowerCase() : "";

      // 1) data-page explicit match (useful if you want robust control)
      if (dataPage) {
        if (
          dataPage === currentPath ||
          dataPage === currentFile ||
          dataPage === window.location.pathname
        ) {
          link.classList.add("active");
          return;
        }
      }

      // 2) exact pathname match
      if (linkPath && linkPath === currentPath) {
        link.classList.add("active");
        return;
      }

      // 3) filename match (e.g., contact.html)
      if (linkFile && linkFile === currentFile) {
        link.classList.add("active");
        return;
      }

      // 4) anchor/hash match on same page (href="#about")
      if (href.startsWith("#")) {
        const hash = href.slice(1);
        if (hash && document.getElementById(hash)) {
          // If on a multipage layout you might want to only match anchors when on the same page
          // We treat anchors as not-global: only activate if pathname is the same as link's (or both index)
          if (!linkUrl || normalizePathname(linkUrl.pathname) === currentPath) {
            link.classList.add("active");
            return;
          }
        }
      }
    }
  }

  // Run once on load
  matchAndActivate();

  // If you navigate within the site via JS, you might want to re-run:
  // Example: catch clicks on nav links and re-run matching (optional)
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      // small timeout to allow browser to update location on same-page navigation
      setTimeout(matchAndActivate, 50);
    });
  });
});
