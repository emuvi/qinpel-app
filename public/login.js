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
        qinpel.manager.tryEnter(user, inputPass.value)
            .then(_ => {
            qinpel.frame.statusInfo("Successful entry with user " + user);
            qinpel.frame.navigate("./desk.html");
        })
            .catch(err => {
            qinpel.manager.showAlert("Problem on enter: " + err);
        });
    }
});
qinpel.utils.arm.putActionProxy(buttonEnter, [inputUser, inputPass]);

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImJ1aWxkL2xvZ2luLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IHFpbnBlbCA9IHdpbmRvdy5mcmFtZUVsZW1lbnQucWlucGVsO1xucWlucGVsLmZyYW1lLnN0YXR1c0luZm8oXCJZb3UgbXVzdCBpbmZvcm0geW91ciB1c2VyIGFuZCBwYXNzIHRvIGVudGVyLlwiKTtcbmNvbnN0IGlucHV0VXNlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9naW5Vc2VyXCIpO1xuY29uc3QgaW5wdXRQYXNzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2dpblBhc3NcIik7XG5jb25zdCBidXR0b25FbnRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9naW5FbnRlclwiKTtcbnFpbnBlbC51dGlscy5hcm0uYWRkQWN0aW9uKGJ1dHRvbkVudGVyLCAocWluRXZlbnQpID0+IHtcbiAgICBpZiAocWluRXZlbnQuaXNQcmltYXJ5KSB7XG4gICAgICAgIGNvbnN0IHVzZXIgPSBpbnB1dFVzZXIudmFsdWU7XG4gICAgICAgIHFpbnBlbC5tYW5hZ2VyLnRyeUVudGVyKHVzZXIsIGlucHV0UGFzcy52YWx1ZSlcbiAgICAgICAgICAgIC50aGVuKF8gPT4ge1xuICAgICAgICAgICAgcWlucGVsLmZyYW1lLnN0YXR1c0luZm8oXCJTdWNjZXNzZnVsIGVudHJ5IHdpdGggdXNlciBcIiArIHVzZXIpO1xuICAgICAgICAgICAgcWlucGVsLmZyYW1lLm5hdmlnYXRlKFwiLi9kZXNrLmh0bWxcIik7XG4gICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgIHFpbnBlbC5tYW5hZ2VyLnNob3dBbGVydChcIlByb2JsZW0gb24gZW50ZXI6IFwiICsgZXJyKTtcbiAgICAgICAgfSk7XG4gICAgfVxufSk7XG5xaW5wZWwudXRpbHMuYXJtLnB1dEFjdGlvblByb3h5KGJ1dHRvbkVudGVyLCBbaW5wdXRVc2VyLCBpbnB1dFBhc3NdKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWxvZ2luLmpzLm1hcCJdfQ==
