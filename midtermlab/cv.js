var heads = document.querySelectorAll('.cv-head');

heads.forEach(function(h) {
    h.onclick = function () {
        var box = h.parentElement;
        box.classList.toggle('open');
    };
});
