const qpmIID = window.frameElement.id;
const qinpel = window.parent.qinpel();

const qpmRefMain = qpmInitMain();

function qpmInitMain() {
	const divBody = document.createElement("div");
	divBody.innerText = "[Release] prototype IID: " + qpmIID + ", Version: " + qinpel.version();
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
