/* ==========================================================================
   Gravel Calculator — script.js
   Handles: mobile navigation, calculator logic, unit conversion,
   waste percentage, validation, results rendering, reset,
   quick-pick buttons, waste option cards.
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- Mobile Navigation ---------- */
  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("main-nav");

    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");

      toggle.setAttribute(
        "aria-expanded",
        isOpen ? "true" : "false"
      );
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");

        toggle.setAttribute(
          "aria-expanded",
          "false"
        );
      });
    });
  }


  /* ---------- Unit Conversion ---------- */

  // Converts a given measurement value into feet.
  function toFeet(value, unit) {

    switch (unit) {

      case "feet":
        return value;

      case "meters":
        return value * 3.280839895;

      case "inches":
        return value / 12;

      case "centimeters":
        return value / 30.48;

      default:
        return value;
    }
  }


  function round(value, decimals) {

    var factor = Math.pow(
      10,
      decimals
    );

    return Math.round(
      (value + Number.EPSILON) * factor
    ) / factor;
  }


  /* ---------- Calculator ---------- */

  function initCalculator() {

    var form = document.getElementById(
      "gravel-calculator-form"
    );

    if (!form) return;


    var lengthInput =
      document.getElementById("length");

    var widthInput =
      document.getElementById("width");

    var depthInput =
      document.getElementById("depth");

    var unitSelect =
      document.getElementById("unit");

    var wasteSelect =
      document.getElementById("waste");


    var errorBox =
      document.getElementById("calc-error");

    var resultsBox =
      document.getElementById("calc-results");


    var areaOut =
      document.getElementById("result-area");

    var cubicFeetOut =
      document.getElementById("result-cubic-feet");

    var cubicYardsOut =
      document.getElementById("result-cubic-yards");

    var wasteOut =
      document.getElementById("result-waste");


    /* =====================================================
       ERROR HANDLING
       ===================================================== */

    function showError(message) {

      errorBox.textContent = message;

      errorBox.hidden = false;

      resultsBox.hidden = true;
    }


    function clearError() {

      errorBox.textContent = "";

      errorBox.hidden = true;
    }


    /* =====================================================
       VALIDATION
       ===================================================== */

    function validateNumber(raw, label) {

      var value = parseFloat(raw);


      if (
        raw === "" ||
        raw === null ||
        isNaN(value)
      ) {

        return {
          valid: false,

          message:
            "Please enter a valid number for " +
            label +
            "."
        };
      }


      if (value <= 0) {

        return {
          valid: false,

          message:
            label +
            " must be greater than zero."
        };
      }


      return {
        valid: true,
        value: value
      };
    }


    /* =====================================================
       CALCULATE
       ===================================================== */

    function handleSubmit(event) {

      event.preventDefault();

      clearError();


      /* ---------- Validate Length ---------- */

      var lengthCheck =
        validateNumber(
          lengthInput.value,
          "length"
        );


      if (!lengthCheck.valid) {

        return showError(
          lengthCheck.message
        );
      }


      /* ---------- Validate Width ---------- */

      var widthCheck =
        validateNumber(
          widthInput.value,
          "width"
        );


      if (!widthCheck.valid) {

        return showError(
          widthCheck.message
        );
      }


      /* ---------- Validate Depth ---------- */

      var depthCheck =
        validateNumber(
          depthInput.value,
          "depth"
        );


      if (!depthCheck.valid) {

        return showError(
          depthCheck.message
        );
      }


      /* ---------- Get Options ---------- */

      var unit =
        unitSelect.value;

      var wastePercent =
        parseFloat(
          wasteSelect.value
        ) || 0;


      /* ---------- Convert To Feet ---------- */

      var lengthFt =
        toFeet(
          lengthCheck.value,
          unit
        );

      var widthFt =
        toFeet(
          widthCheck.value,
          unit
        );

      var depthFt =
        toFeet(
          depthCheck.value,
          unit
        );


      /* ---------- Calculate Area ---------- */

      var area =
        lengthFt *
        widthFt;


      /* ---------- Calculate Volume ---------- */

      var cubicFeet =
        area *
        depthFt;


      var cubicYards =
        cubicFeet / 27;


      /* ---------- Apply Waste ---------- */

      var adjustedCubicFeet =
        cubicFeet *
        (
          1 +
          wastePercent / 100
        );


      var adjustedCubicYards =
        adjustedCubicFeet / 27;


      /* ---------- Display Results ---------- */

      areaOut.textContent =
        round(area, 2) +
        " sq ft";


      cubicFeetOut.textContent =
        round(adjustedCubicFeet, 2) +
        " ft³";


      cubicYardsOut.textContent =
        round(adjustedCubicYards, 2) +
        " yd³";


      wasteOut.textContent =
        wastePercent +
        "%";


      resultsBox.hidden = false;


      resultsBox.setAttribute(
        "tabindex",
        "-1"
      );


      resultsBox.focus({
        preventScroll: false
      });
    }


    /* =====================================================
       RESET
       ===================================================== */

    function handleReset() {

      clearError();

      resultsBox.hidden = true;


      form.reset();


      /*
       * Keep the original default waste
       * at 10%.
       */

      wasteSelect.value = "10";


      /*
       * Remove selected state
       * from Quick Pick buttons.
       */

      document
        .querySelectorAll(".quick-value")
        .forEach(function (button) {

          button.classList.remove(
            "active"
          );

        });


      /*
       * Reset visible waste cards.
       */

      document
        .querySelectorAll(
          '.waste-option input'
        )
        .forEach(function (radio) {

          radio.checked =
            radio.value === "10";

        });


      lengthInput.focus();
    }


    /* =====================================================
       EXISTING FORM EVENTS
       ===================================================== */

    form.addEventListener(
      "submit",
      handleSubmit
    );


    var resetBtn =
      document.getElementById(
        "calc-reset"
      );


    if (resetBtn) {

      resetBtn.addEventListener(
        "click",
        handleReset
      );
    }


    /* =====================================================
       QUICK PICK BUTTONS
       ===================================================== */

    var quickButtons =
      document.querySelectorAll(
        ".quick-value"
      );


    quickButtons.forEach(
      function (button) {

        button.addEventListener(
          "click",
          function () {

            var targetId =
              button.getAttribute(
                "data-target"
              );


            var value =
              button.getAttribute(
                "data-value"
              );


            var targetInput =
              document.getElementById(
                targetId
              );


            if (!targetInput) {
              return;
            }


            /* Put value into input */

            targetInput.value =
              value;


            /* Clear other quick-pick
               selections for this field */

            quickButtons.forEach(
              function (otherButton) {

                if (
                  otherButton.getAttribute(
                    "data-target"
                  ) === targetId
                ) {

                  otherButton.classList.remove(
                    "active"
                  );
                }

              }
            );


            /* Highlight clicked button */

            button.classList.add(
              "active"
            );


            /* Remove validation error */

            clearError();


            /* Move focus to input */

            targetInput.focus();
          }
        );
      }
    );


    /* =====================================================
       WASTE OPTION CARDS
       ===================================================== */

    var wasteRadios =
      document.querySelectorAll(
        ".waste-option input"
      );


    wasteRadios.forEach(
      function (radio) {

        radio.addEventListener(
          "change",
          function () {

            /*
             * Keep the original select
             * synchronized.
             */

            wasteSelect.value =
              radio.value;


            /*
             * Remove selected state
             * from all cards.
             */

            wasteRadios.forEach(
              function (otherRadio) {

                var card =
                  otherRadio.parentElement
                    .querySelector(
                      ".waste-card"
                    );


                if (card) {

                  card.classList.remove(
                    "active"
                  );
                }
              }
            );


            /*
             * Highlight the selected
             * waste card.
             */

            var selectedCard =
              radio.parentElement
                .querySelector(
                  ".waste-card"
                );


            if (selectedCard) {

              selectedCard.classList.add(
                "active"
              );
            }


            clearError();
          }
        );
      }
    );


    /* =====================================================
       INITIAL WASTE CARD STATE
       ===================================================== */

    wasteRadios.forEach(
      function (radio) {

        if (radio.checked) {

          var selectedCard =
            radio.parentElement
              .querySelector(
                ".waste-card"
              );


          if (selectedCard) {

            selectedCard.classList.add(
              "active"
            );
          }
        }
      }
    );
  }


  /* ---------- Footer Year ---------- */

  function initYear() {

    var el =
      document.getElementById(
        "current-year"
      );


    if (el) {

      el.textContent =
        new Date().getFullYear();
    }
  }


  /* ---------- Initialize ---------- */

  document.addEventListener(
    "DOMContentLoaded",
    function () {

      initNav();

      initCalculator();

      initYear();
    }
  );

})();