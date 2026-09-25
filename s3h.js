    const menuButton = document.querySelector(".menu-toggle");
    const navigation = document.querySelector(".main-nav");

    if (menuButton && navigation) {
      menuButton.addEventListener("click", () => {
        const isOpen = menuButton.getAttribute("aria-expanded") === "true";
        menuButton.setAttribute("aria-expanded", String(!isOpen));
        navigation.classList.toggle("is-open");
      });

      navigation.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          menuButton.setAttribute("aria-expanded", "false");
          navigation.classList.remove("is-open");
        });
      });
    }

    const filterButtons = document.querySelectorAll(".filter-button");
    const matchCards = document.querySelectorAll(".match-card");
    const visibleMatchCount = document.querySelector("#visibleMatchCount");

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.dataset.filter;
        let visible = 0;

        filterButtons.forEach((item) => item.classList.remove("is-active"));
        button.classList.add("is-active");

        matchCards.forEach((card) => {
          const matches =
            filter === "all" ||
            card.dataset.result === filter ||
            card.dataset.location === filter;

          card.hidden = !matches;

          if (matches) {
            visible += 1;
          } else {
            const openLineup = card.querySelector("details[open]");
            if (openLineup) openLineup.open = false;
          }
        });

        visibleMatchCount.textContent = visible;
      });
    });

    document.querySelectorAll(".lineup-toggle").forEach((details) => {
      const action = details.querySelector(".summary-action");

      details.addEventListener("toggle", () => {
        if (action) action.textContent = details.open ? "Luk" : "Åbn";
      });
    });

    const ticker = document.querySelector(".sponsor-ticker");
    const tickerTrack = document.querySelector(".ticker-track");
    const tickerGroup = document.querySelector(".ticker-group");

    if (ticker && tickerTrack && tickerGroup) {
      const clone = tickerGroup.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");

      clone.querySelectorAll("a").forEach((link) => {
        link.setAttribute("tabindex", "-1");
      });

      tickerTrack.appendChild(clone);

      let pointerIsDown = false;
      let isDragging = false;
      let blockNextClick = false;
      let startX = 0;
      let startScrollLeft = 0;

      ticker.addEventListener("pointerdown", (event) => {
        if (event.pointerType === "mouse" && event.button !== 0) return;

        pointerIsDown = true;
        isDragging = false;
        blockNextClick = false;
        startX = event.clientX;
        startScrollLeft = ticker.scrollLeft;
      });

      ticker.addEventListener("pointermove", (event) => {
        if (!pointerIsDown) return;

        const distance = event.clientX - startX;

        if (!isDragging && Math.abs(distance) > 18) {
          isDragging = true;
          blockNextClick = true;
          ticker.classList.add("is-dragging");

          if (ticker.setPointerCapture) {
            ticker.setPointerCapture(event.pointerId);
          }
        }

        if (!isDragging) return;

        event.preventDefault();
        ticker.scrollLeft = startScrollLeft - distance;
      });

      const stopDragging = (event) => {
        pointerIsDown = false;
        isDragging = false;
        ticker.classList.remove("is-dragging");

        if (
          event.pointerId !== undefined &&
          ticker.hasPointerCapture &&
          ticker.hasPointerCapture(event.pointerId)
        ) {
          ticker.releasePointerCapture(event.pointerId);
        }
      };

      ticker.addEventListener("pointerup", stopDragging);
      ticker.addEventListener("pointercancel", stopDragging);
      window.addEventListener("pointerup", stopDragging);

      ticker.addEventListener("click", (event) => {
        if (blockNextClick) {
          event.preventDefault();
          event.stopPropagation();
        }

        blockNextClick = false;
      }, true);

      ticker.addEventListener("wheel", (event) => {
        if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
          event.preventDefault();
          ticker.scrollLeft += event.deltaY;
        }
      }, { passive: false });
    }