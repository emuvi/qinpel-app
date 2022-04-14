(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const qinpel = window.frameElement.qinpel;
qinpel.frame.statusInfo("You must inform your user and pass to enter.");
const inputUser = document.getElementById("loginUser");
const inputPass = document.getElementById("loginPass");
const buttonEnter = document.getElementById("loginEnter");
qinpel.utils.arm.addAction(buttonEnter, (qinEvent) => {
    if (qinEvent.isPrimary) {
        const user = inputUser.value;
        const pass = inputPass.value;
        qinpel.manager
            .tryEnter(user, pass)
            .then((_) => {
            qinpel.frame.statusInfo("Successful entry with user " + user);
            qinpel.frame.navigate("./desk.html");
        })
            .catch((err) => {
            qinpel.manager.showAlert("Problem on enter: " + err);
        });
    }
});
qinpel.utils.arm.putActionProxy(buttonEnter, [inputUser, inputPass]);

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImJ1aWxkL2xvZ2luLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBxaW5wZWwgPSB3aW5kb3cuZnJhbWVFbGVtZW50LnFpbnBlbDtcbnFpbnBlbC5mcmFtZS5zdGF0dXNJbmZvKFwiWW91IG11c3QgaW5mb3JtIHlvdXIgdXNlciBhbmQgcGFzcyB0byBlbnRlci5cIik7XG5jb25zdCBpbnB1dFVzZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvZ2luVXNlclwiKTtcbmNvbnN0IGlucHV0UGFzcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9naW5QYXNzXCIpO1xuY29uc3QgYnV0dG9uRW50ZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvZ2luRW50ZXJcIik7XG5xaW5wZWwudXRpbHMuYXJtLmFkZEFjdGlvbihidXR0b25FbnRlciwgKHFpbkV2ZW50KSA9PiB7XG4gICAgaWYgKHFpbkV2ZW50LmlzUHJpbWFyeSkge1xuICAgICAgICBjb25zdCB1c2VyID0gaW5wdXRVc2VyLnZhbHVlO1xuICAgICAgICBjb25zdCBwYXNzID0gaW5wdXRQYXNzLnZhbHVlO1xuICAgICAgICBxaW5wZWwubWFuYWdlclxuICAgICAgICAgICAgLnRyeUVudGVyKHVzZXIsIHBhc3MpXG4gICAgICAgICAgICAudGhlbigoXykgPT4ge1xuICAgICAgICAgICAgcWlucGVsLmZyYW1lLnN0YXR1c0luZm8oXCJTdWNjZXNzZnVsIGVudHJ5IHdpdGggdXNlciBcIiArIHVzZXIpO1xuICAgICAgICAgICAgcWlucGVsLmZyYW1lLm5hdmlnYXRlKFwiLi9kZXNrLmh0bWxcIik7XG4gICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgcWlucGVsLm1hbmFnZXIuc2hvd0FsZXJ0KFwiUHJvYmxlbSBvbiBlbnRlcjogXCIgKyBlcnIpO1xuICAgICAgICB9KTtcbiAgICB9XG59KTtcbnFpbnBlbC51dGlscy5hcm0ucHV0QWN0aW9uUHJveHkoYnV0dG9uRW50ZXIsIFtpbnB1dFVzZXIsIGlucHV0UGFzc10pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bG9naW4uanMubWFwIl19
