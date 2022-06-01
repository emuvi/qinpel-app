(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const qinpel = window.frameElement.qinpel;
qinpel.jobbed.statusInfo("You must inform your user and pass to enter.", "{qinpel-app}(ErrCode-000003)");
const inputUser = document.getElementById("loginUser");
const inputPass = document.getElementById("loginPass");
const buttonEnter = document.getElementById("loginEnter");
qinpel.our.soul.arms.addActions([inputUser, inputPass, buttonEnter], (qinEvent) => {
    function isActionTrigger() {
        if (qinEvent.fromOrigin == inputUser || qinEvent.fromOrigin == inputPass) {
            return qinEvent.isMainKey;
        }
        else {
            return qinEvent.isMain;
        }
    }
    if (isActionTrigger()) {
        const user = inputUser.value;
        const pass = inputPass.value;
        qinpel.chief
            .tryEnter(user, pass)
            .then((_) => {
            qinpel.jobbed.statusInfo("Successfully entry with user " + user, "{qinpel-app}(ErrCode-000004)");
            qinpel.jobbed.navigate("./desk.html");
        })
            .catch((err) => {
            qinpel.jobbed.showAlert("Problem on enter: " + err);
        });
    }
});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImJ1aWxkL2xvZ2luLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBxaW5wZWwgPSB3aW5kb3cuZnJhbWVFbGVtZW50LnFpbnBlbDtcclxucWlucGVsLmpvYmJlZC5zdGF0dXNJbmZvKFwiWW91IG11c3QgaW5mb3JtIHlvdXIgdXNlciBhbmQgcGFzcyB0byBlbnRlci5cIiwgXCJ7cWlucGVsLWFwcH0oRXJyQ29kZS0wMDAwMDMpXCIpO1xyXG5jb25zdCBpbnB1dFVzZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvZ2luVXNlclwiKTtcclxuY29uc3QgaW5wdXRQYXNzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2dpblBhc3NcIik7XHJcbmNvbnN0IGJ1dHRvbkVudGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2dpbkVudGVyXCIpO1xyXG5xaW5wZWwub3VyLnNvdWwuYXJtcy5hZGRBY3Rpb25zKFtpbnB1dFVzZXIsIGlucHV0UGFzcywgYnV0dG9uRW50ZXJdLCAocWluRXZlbnQpID0+IHtcclxuICAgIGZ1bmN0aW9uIGlzQWN0aW9uVHJpZ2dlcigpIHtcclxuICAgICAgICBpZiAocWluRXZlbnQuZnJvbU9yaWdpbiA9PSBpbnB1dFVzZXIgfHwgcWluRXZlbnQuZnJvbU9yaWdpbiA9PSBpbnB1dFBhc3MpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHFpbkV2ZW50LmlzTWFpbktleTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBxaW5FdmVudC5pc01haW47XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKGlzQWN0aW9uVHJpZ2dlcigpKSB7XHJcbiAgICAgICAgY29uc3QgdXNlciA9IGlucHV0VXNlci52YWx1ZTtcclxuICAgICAgICBjb25zdCBwYXNzID0gaW5wdXRQYXNzLnZhbHVlO1xyXG4gICAgICAgIHFpbnBlbC5jaGllZlxyXG4gICAgICAgICAgICAudHJ5RW50ZXIodXNlciwgcGFzcylcclxuICAgICAgICAgICAgLnRoZW4oKF8pID0+IHtcclxuICAgICAgICAgICAgcWlucGVsLmpvYmJlZC5zdGF0dXNJbmZvKFwiU3VjY2Vzc2Z1bGx5IGVudHJ5IHdpdGggdXNlciBcIiArIHVzZXIsIFwie3FpbnBlbC1hcHB9KEVyckNvZGUtMDAwMDA0KVwiKTtcclxuICAgICAgICAgICAgcWlucGVsLmpvYmJlZC5uYXZpZ2F0ZShcIi4vZGVzay5odG1sXCIpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgIHFpbnBlbC5qb2JiZWQuc2hvd0FsZXJ0KFwiUHJvYmxlbSBvbiBlbnRlcjogXCIgKyBlcnIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59KTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bG9naW4uanMubWFwIl19
