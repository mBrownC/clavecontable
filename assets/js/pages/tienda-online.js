/* ==========================================
   Landing Tienda Online: botones "Copiar"
   ========================================== */

document.querySelectorAll('.copy[data-copy]').forEach(function (b) {
  b.addEventListener('click', function () {
    var v = b.getAttribute('data-copy');
    var done = function () { b.textContent = 'Copiado'; setTimeout(function () { b.textContent = 'Copiar'; }, 1600); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(v).then(done, function () { select(b); });
    } else { select(b); }
  });
});
function select(b) {
  var t = b.parentNode.querySelector('b');
  var r = document.createRange(); r.selectNodeContents(t);
  var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
}
