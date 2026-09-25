    /* ================================
       MOBILMENU
    ================================ */

    const menuButton = document.querySelector(".menu-toggle");
    const navigation = document.querySelector(".main-nav");

    if (menuButton && navigation) {
      menuButton.addEventListener("click", () => {
        const isOpen =
          menuButton.getAttribute("aria-expanded") === "true";

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


    /* ================================
       SPONSORSLIDER
    ================================ */

    const ticker = document.querySelector(".sponsor-ticker");
    const tickerTrack = document.querySelector(".ticker-track");
    const tickerGroup = document.querySelector(".ticker-group");

    if (ticker && tickerTrack && tickerGroup) {
      /*
        Kopierer sponsorgruppen én gang, så slideren
        kan køre som en ubrudt animation.
      */
      const groupCount =
        tickerTrack.querySelectorAll(".ticker-group").length;

      if (groupCount === 1) {
        const clone = tickerGroup.cloneNode(true);

        clone.setAttribute("aria-hidden", "true");

        clone.querySelectorAll("a").forEach((link) => {
          link.setAttribute("tabindex", "-1");
        });

        tickerTrack.appendChild(clone);
      }

      let pointerIsDown = false;
      let isDragging = false;
      let blockNextClick = false;

      let startX = 0;
      let startScrollLeft = 0;

      ticker.addEventListener("pointerdown", (event) => {
        /*
          Kun venstre museknap må starte træk.
          Højreklik og midterklik ignoreres.
        */
        if (event.pointerType === "mouse" && event.button !== 0) {
          return;
        }

        pointerIsDown = true;
        isDragging = false;
        blockNextClick = false;

        startX = event.clientX;
        startScrollLeft = ticker.scrollLeft;
      });

      ticker.addEventListener("pointermove", (event) => {
        if (!pointerIsDown) return;

        const distance = event.clientX - startX;

        /*
          Slideren registrerer først træk efter 18 pixels.
          Små bevægelser ved et normalt klik bliver derfor
          ikke opfattet som træk.
        */
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
        if (!pointerIsDown && !isDragging) return;

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

      /*
        Forhindrer browserens normale træk af billeder og links.
      */
      ticker.addEventListener("dragstart", (event) => {
        event.preventDefault();
      });

      /*
        Sponsorlinket stoppes kun, hvis brugeren faktisk
        har trukket slideren. Et normalt klik åbner linket.
      */
      ticker.addEventListener(
        "click",
        (event) => {
          if (blockNextClick) {
            event.preventDefault();
            event.stopPropagation();
          }

          blockNextClick = false;
        },
        true
      );

      /*
        Musehjulet kan bruges til vandret navigation.
      */
      ticker.addEventListener(
        "wheel",
        (event) => {
          if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
            event.preventDefault();
            ticker.scrollLeft += event.deltaY;
          }
        },
        { passive: false }
      );
    }