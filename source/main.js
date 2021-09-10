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
		divBody.id = "QinpelMainDivBody";
		axios.get("../../../index2")
			.then(res => { divBody.innerText = "Res:" + res.data; })
			.catch(err => { divBody.innerText = "QinpelApp problem on retrieve the menu list. - " + err; });
		document.body.append(divBody);

		function addMenu(name) {

		}
	}
}
