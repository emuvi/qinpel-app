(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const qinpel = window.frameElement.qinpel;
qinpel.frame.statusInfo("You must inform your user and pass to enter.");
const inputUser = document.getElementById("loginUser");
const inputPass = document.getElementById("loginPass");
const buttonEnter = document.getElementById("loginEnter");
qinpel.utils.arm.addAction(buttonEnter, (qinEvent) => {
    if (qinEvent.isPrimary()) {
        const user = inputUser.value;
        qinpel.manager.tryEnter(user, inputPass.value)
            .then(_ => {
            qinpel.frame.statusInfo("Successful entry with user " + user);
            qinpel.frame.navigate("./menu.html");
        })
            .catch(err => {
            qinpel.manager.showAlert("Problem on enter: " + err);
        });
    }
});
qinpel.utils.arm.putActionProxy(buttonEnter, [inputUser, inputPass]);

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImJ1aWxkL2xvZ2luLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBxaW5wZWwgPSB3aW5kb3cuZnJhbWVFbGVtZW50LnFpbnBlbDtcclxucWlucGVsLmZyYW1lLnN0YXR1c0luZm8oXCJZb3UgbXVzdCBpbmZvcm0geW91ciB1c2VyIGFuZCBwYXNzIHRvIGVudGVyLlwiKTtcclxuY29uc3QgaW5wdXRVc2VyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2dpblVzZXJcIik7XHJcbmNvbnN0IGlucHV0UGFzcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9naW5QYXNzXCIpO1xyXG5jb25zdCBidXR0b25FbnRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9naW5FbnRlclwiKTtcclxucWlucGVsLnV0aWxzLmFybS5hZGRBY3Rpb24oYnV0dG9uRW50ZXIsIChxaW5FdmVudCkgPT4ge1xyXG4gICAgaWYgKHFpbkV2ZW50LmlzUHJpbWFyeSgpKSB7XHJcbiAgICAgICAgY29uc3QgdXNlciA9IGlucHV0VXNlci52YWx1ZTtcclxuICAgICAgICBxaW5wZWwubWFuYWdlci50cnlFbnRlcih1c2VyLCBpbnB1dFBhc3MudmFsdWUpXHJcbiAgICAgICAgICAgIC50aGVuKF8gPT4ge1xyXG4gICAgICAgICAgICBxaW5wZWwuZnJhbWUuc3RhdHVzSW5mbyhcIlN1Y2Nlc3NmdWwgZW50cnkgd2l0aCB1c2VyIFwiICsgdXNlcik7XHJcbiAgICAgICAgICAgIHFpbnBlbC5mcmFtZS5uYXZpZ2F0ZShcIi4vbWVudS5odG1sXCIpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgICAgICAgICBxaW5wZWwubWFuYWdlci5zaG93QWxlcnQoXCJQcm9ibGVtIG9uIGVudGVyOiBcIiArIGVycik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0pO1xyXG5xaW5wZWwudXRpbHMuYXJtLnB1dEFjdGlvblByb3h5KGJ1dHRvbkVudGVyLCBbaW5wdXRVc2VyLCBpbnB1dFBhc3NdKTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bG9naW4uanMubWFwIl19
