(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const qinpel = window.frameElement.qinpel;
qinpel.frame.statusInfo("You must inform your user and pass to enter.");
const inputUser = document.getElementById("loginUser");
const inputPass = document.getElementById("loginPass");
const buttonEnter = document.getElementById("loginEnter");
qinpel.utils.arm.addAction(buttonEnter, (qinEvent) => {
    console.log("oi");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImJ1aWxkL2xvZ2luLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IHFpbnBlbCA9IHdpbmRvdy5mcmFtZUVsZW1lbnQucWlucGVsO1xyXG5xaW5wZWwuZnJhbWUuc3RhdHVzSW5mbyhcIllvdSBtdXN0IGluZm9ybSB5b3VyIHVzZXIgYW5kIHBhc3MgdG8gZW50ZXIuXCIpO1xyXG5jb25zdCBpbnB1dFVzZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvZ2luVXNlclwiKTtcclxuY29uc3QgaW5wdXRQYXNzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2dpblBhc3NcIik7XHJcbmNvbnN0IGJ1dHRvbkVudGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2dpbkVudGVyXCIpO1xyXG5xaW5wZWwudXRpbHMuYXJtLmFkZEFjdGlvbihidXR0b25FbnRlciwgKHFpbkV2ZW50KSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhcIm9pXCIpO1xyXG4gICAgaWYgKHFpbkV2ZW50LmlzUHJpbWFyeSkge1xyXG4gICAgICAgIGNvbnN0IHVzZXIgPSBpbnB1dFVzZXIudmFsdWU7XHJcbiAgICAgICAgcWlucGVsLm1hbmFnZXIudHJ5RW50ZXIodXNlciwgaW5wdXRQYXNzLnZhbHVlKVxyXG4gICAgICAgICAgICAudGhlbihfID0+IHtcclxuICAgICAgICAgICAgcWlucGVsLmZyYW1lLnN0YXR1c0luZm8oXCJTdWNjZXNzZnVsIGVudHJ5IHdpdGggdXNlciBcIiArIHVzZXIpO1xyXG4gICAgICAgICAgICBxaW5wZWwuZnJhbWUubmF2aWdhdGUoXCIuL2Rlc2suaHRtbFwiKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcclxuICAgICAgICAgICAgcWlucGVsLm1hbmFnZXIuc2hvd0FsZXJ0KFwiUHJvYmxlbSBvbiBlbnRlcjogXCIgKyBlcnIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59KTtcclxucWlucGVsLnV0aWxzLmFybS5wdXRBY3Rpb25Qcm94eShidXR0b25FbnRlciwgW2lucHV0VXNlciwgaW5wdXRQYXNzXSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWxvZ2luLmpzLm1hcCJdfQ==
