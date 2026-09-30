/* Copy buttons for the citation block. Without JavaScript the text can be selected by hand. */
document.addEventListener("click", function (e) {
  var b = e.target.closest && e.target.closest("button.copy");
  if (!b) return;
  var src = document.getElementById(b.getAttribute("data-copy"));
  if (!src || !navigator.clipboard) return;
  var label = b.textContent;
  navigator.clipboard.writeText(src.textContent.trim()).then(function () {
    b.textContent = "Copied";
    setTimeout(function () { b.textContent = label; }, 1500);
  });
});
