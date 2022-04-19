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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImJ1aWxkL2xvZ2luLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgcWlucGVsID0gd2luZG93LmZyYW1lRWxlbWVudC5xaW5wZWw7XHJcbnFpbnBlbC5mcmFtZS5zdGF0dXNJbmZvKFwiWW91IG11c3QgaW5mb3JtIHlvdXIgdXNlciBhbmQgcGFzcyB0byBlbnRlci5cIik7XHJcbmNvbnN0IGlucHV0VXNlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9naW5Vc2VyXCIpO1xyXG5jb25zdCBpbnB1dFBhc3MgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvZ2luUGFzc1wiKTtcclxuY29uc3QgYnV0dG9uRW50ZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvZ2luRW50ZXJcIik7XHJcbnFpbnBlbC51dGlscy5hcm0uYWRkQWN0aW9uKGJ1dHRvbkVudGVyLCAocWluRXZlbnQpID0+IHtcclxuICAgIGlmIChxaW5FdmVudC5pc1ByaW1hcnkpIHtcclxuICAgICAgICBjb25zdCB1c2VyID0gaW5wdXRVc2VyLnZhbHVlO1xyXG4gICAgICAgIGNvbnN0IHBhc3MgPSBpbnB1dFBhc3MudmFsdWU7XHJcbiAgICAgICAgcWlucGVsLm1hbmFnZXJcclxuICAgICAgICAgICAgLnRyeUVudGVyKHVzZXIsIHBhc3MpXHJcbiAgICAgICAgICAgIC50aGVuKChfKSA9PiB7XHJcbiAgICAgICAgICAgIHFpbnBlbC5mcmFtZS5zdGF0dXNJbmZvKFwiU3VjY2Vzc2Z1bCBlbnRyeSB3aXRoIHVzZXIgXCIgKyB1c2VyKTtcclxuICAgICAgICAgICAgcWlucGVsLmZyYW1lLm5hdmlnYXRlKFwiLi9kZXNrLmh0bWxcIik7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICAgICAgcWlucGVsLm1hbmFnZXIuc2hvd0FsZXJ0KFwiUHJvYmxlbSBvbiBlbnRlcjogXCIgKyBlcnIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59KTtcclxucWlucGVsLnV0aWxzLmFybS5wdXRBY3Rpb25Qcm94eShidXR0b25FbnRlciwgW2lucHV0VXNlciwgaW5wdXRQYXNzXSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWxvZ2luLmpzLm1hcCJdfQ==
