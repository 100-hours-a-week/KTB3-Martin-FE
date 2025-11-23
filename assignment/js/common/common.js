

function loadScript(src) {
  document.write(`<script src="${src}"></script>`);
}

// 순서대로 불러옴
loadScript("../js/common/session.js");
loadScript("../js/common/loadUser.js");
loadScript("../js/common/dropdown.js");
