const IID = window.frameElement.id;
const qinpel = window.parent.qinpel();

document.getElementById("tst_version").innerText = "qinpel version: " + qinpel.version();
document.getElementById("tst_id").innerText = "iframe id: " + IID;

function testNewFrame() {
  qinpel.newFrame("Título", "./frame.html");
}
