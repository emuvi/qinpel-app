const qinpelFrame = window.frameElement;
const qinpelRefSelf = qinpelFrame.qinpelRefSelf;
const qinpelApp = window.parent.qinpelApp();

if (!qinpelApp.isLocalHost() && !qinpelApp.hasLogged()) {
	qinpelFrame.src = "./login.html";
} else {
	qinpelInitMain();
}

function qinpelInitMain() {
	const divBody = document.createElement("div");
	initBody();

	function initBody() {
		divBody.id = "QinpelMainDivBody";
		qinpelApp.get("/list/app")
			.then(res => { for (let name of listMenu(res.data)) { tryAddMenu(name); }; })
			.catch(err => { divBody.innerText = "QinpelApp problem on retrieve the menu list. - " + err; });
		document.body.appendChild(divBody);

		function listMenu(response) {
			return response.split(/\r?\n/);
		}

		function tryAddMenu(name) {
			if (name && name != "qinpel-app") {
				qinpelApp.get("/run/app/" + name + "/title.txt")
					.then(res => {
						const title = res.data;
						const divContent = document.createElement("div");
						divContent.className = "QinpelMainDivMenuContent";
						const imgIcon = document.createElement("img");
						imgIcon.src = "../" + name + "/favicon.ico";
						const spanTitle = document.createElement("span");
						spanTitle.innerText = title;
						divContent.onmousedown = divContentClicked;
						divContent.ontouchstart = divContentClicked;
						divContent.appendChild(imgIcon);
						divContent.appendChild(spanTitle);
						addMenu(divContent);

						function divContentClicked(e) {
							qinpelApp.newFrame(title, "../" + name + "/index.html");
							return qinpelRefSelf.headClose(e);
						}
					})
					.catch(err => {
						const divError = document.createElement("div");
						divError.innerText = "Error on get " + name + " title text. - " + err;
						addMenu(divError);
					});
			}

			function addMenu(divContent) {
				const divMenu = document.createElement("div");
				divMenu.className = 'QinpelMainDivMenu';
				divMenu.appendChild(divContent);
				divBody.appendChild(divMenu);
			}
		}
	}
}