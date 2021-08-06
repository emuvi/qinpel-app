const qpmIID = window.frameElement.id;
const qinpel = window.parent.qinpel();

const qpmRefMain = qpmInitMain();

function qpmInitMain() {
  const divBody = document.createElement("div");
  const refMain = {
    IID: qpmIID,
    divBody,
  };
  initBody();
  return refMain;

  function initBody() {
    document.body.append(divBody);
  }
}
