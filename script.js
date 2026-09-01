/* ==========================================================================
   Gravel Calculator — script.js
   Handles: mobile navigation, calculator logic, unit conversion,
   waste percentage, validation, results rendering, reset.
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
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
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
    var factor = Math.pow(10, decimals);
    return Math.round((value + Number.EPSILON) * factor) / factor;
  }

  /* ---------- Calculator ---------- */
  function initCalculator() {
    var form = document.getElementById("gravel-calculator-form");
    if (!form) return;

    var lengthInput = document.getElementById("length");
    var widthInput = document.getElementById("width");
    var depthInput = document.getElementById("depth");
    var unitSelect = document.getElementById("unit");
    var wasteSelect = document.getElementById("waste");

    var errorBox = document.getElementById("calc-error");
    var resultsBox = document.getElementById("calc-results");

    var areaOut = document.getElementById("result-area");
    var cubicFeetOut = document.getElementById("result-cubic-feet");
    var cubicYardsOut = document.getElementById("result-cubic-yards");
    var wasteOut = document.getElementById("result-waste");

    function showError(message) {
      errorBox.textContent = message;
      errorBox.hidden = false;
      resultsBox.hidden = true;
    }

    function clearError() {
      errorBox.textContent = "";
      errorBox.hidden = true;
    }

    function validateNumber(raw, label) {
      var value = parseFloat(raw);
      if (raw === "" || raw === null || isNaN(value)) {
        return { valid: false, message: "Please enter a valid number for " + label + "." };
      }
      if (value <= 0) {
        return { valid: false, message: label + " must be greater than zero." };
      }
      return { valid: true, value: value };
    }

    function handleSubmit(event) {
      event.preventDefault();
      clearError();

      var lengthCheck = validateNumber(lengthInput.value, "length");
      if (!lengthCheck.valid) return showError(lengthCheck.message);

      var widthCheck = validateNumber(widthInput.value, "width");
      if (!widthCheck.valid) return showError(widthCheck.message);

      var depthCheck = validateNumber(depthInput.value, "depth");
      if (!depthCheck.valid) return showError(depthCheck.message);

      var unit = unitSelect.value;
      var wastePercent = parseFloat(wasteSelect.value) || 0;

      var lengthFt = toFeet(lengthCheck.value, unit);
      var widthFt = toFeet(widthCheck.value, unit);
      var depthFt = toFeet(depthCheck.value, unit);

      var area = lengthFt * widthFt;
      var cubicFeet = area * depthFt;
      var cubicYards = cubicFeet / 27;

      var adjustedCubicFeet = cubicFeet * (1 + wastePercent / 100);
      var adjustedCubicYards = adjustedCubicFeet / 27;

      areaOut.textContent = round(area, 2) + " sq ft";
      cubicFeetOut.textContent = round(adjustedCubicFeet, 2) + " ft\u00B3";
      cubicYardsOut.textContent = round(adjustedCubicYards, 2) + " yd\u00B3";
      wasteOut.textContent = wastePercent + "%";

      resultsBox.hidden = false;
      resultsBox.setAttribute("tabindex", "-1");
      resultsBox.focus({ preventScroll: false });
    }

    function handleReset() {
      clearError();
      resultsBox.hidden = true;
      form.reset();
      wasteSelect.value = "10";
      lengthInput.focus();
    }

    form.addEventListener("submit", handleSubmit);

    var resetBtn = document.getElementById("calc-reset");
    if (resetBtn) {
      resetBtn.addEventListener("click", handleReset);
    }
  }

  /* ---------- Footer year ---------- */
  function initYear() {
    var el = document.getElementById("current-year");
    if (el) el.textContent = new Date().getFullYear();
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initCalculator();
    initYear();
  });
})();
