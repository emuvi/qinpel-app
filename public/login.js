(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const qinpel = window.frameElement.qinpel;
qinpel.jobbed.statusInfo(qinpel.tr("You must inform your user and pass to enter."), "{qinpel-app}(ErrCode-000003)");
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
            qinpel.jobbed.statusInfo(qinpel.tr("Successfully entry with user ") + user, "{qinpel-app}(ErrCode-000004)");
            qinpel.jobbed.navigate("./desk.html");
        })
            .catch((err) => {
            qinpel.jobbed.showAlert(qinpel.tr("Problem on enter: ") + err);
        });
    }
});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL1VzZXJzL2VtdXZpL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImJ1aWxkL2xvZ2luLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBxaW5wZWwgPSB3aW5kb3cuZnJhbWVFbGVtZW50LnFpbnBlbDtcclxucWlucGVsLmpvYmJlZC5zdGF0dXNJbmZvKHFpbnBlbC50cihcIllvdSBtdXN0IGluZm9ybSB5b3VyIHVzZXIgYW5kIHBhc3MgdG8gZW50ZXIuXCIpLCBcIntxaW5wZWwtYXBwfShFcnJDb2RlLTAwMDAwMylcIik7XHJcbmNvbnN0IGlucHV0VXNlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9naW5Vc2VyXCIpO1xyXG5jb25zdCBpbnB1dFBhc3MgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvZ2luUGFzc1wiKTtcclxuY29uc3QgYnV0dG9uRW50ZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvZ2luRW50ZXJcIik7XHJcbnFpbnBlbC5vdXIuc291bC5hcm1zLmFkZEFjdGlvbnMoW2lucHV0VXNlciwgaW5wdXRQYXNzLCBidXR0b25FbnRlcl0sIChxaW5FdmVudCkgPT4ge1xyXG4gICAgZnVuY3Rpb24gaXNBY3Rpb25UcmlnZ2VyKCkge1xyXG4gICAgICAgIGlmIChxaW5FdmVudC5mcm9tT3JpZ2luID09IGlucHV0VXNlciB8fCBxaW5FdmVudC5mcm9tT3JpZ2luID09IGlucHV0UGFzcykge1xyXG4gICAgICAgICAgICByZXR1cm4gcWluRXZlbnQuaXNNYWluS2V5O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHFpbkV2ZW50LmlzTWFpbjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoaXNBY3Rpb25UcmlnZ2VyKCkpIHtcclxuICAgICAgICBjb25zdCB1c2VyID0gaW5wdXRVc2VyLnZhbHVlO1xyXG4gICAgICAgIGNvbnN0IHBhc3MgPSBpbnB1dFBhc3MudmFsdWU7XHJcbiAgICAgICAgcWlucGVsLmNoaWVmXHJcbiAgICAgICAgICAgIC50cnlFbnRlcih1c2VyLCBwYXNzKVxyXG4gICAgICAgICAgICAudGhlbigoXykgPT4ge1xyXG4gICAgICAgICAgICBxaW5wZWwuam9iYmVkLnN0YXR1c0luZm8ocWlucGVsLnRyKFwiU3VjY2Vzc2Z1bGx5IGVudHJ5IHdpdGggdXNlciBcIikgKyB1c2VyLCBcIntxaW5wZWwtYXBwfShFcnJDb2RlLTAwMDAwNClcIik7XHJcbiAgICAgICAgICAgIHFpbnBlbC5qb2JiZWQubmF2aWdhdGUoXCIuL2Rlc2suaHRtbFwiKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xyXG4gICAgICAgICAgICBxaW5wZWwuam9iYmVkLnNob3dBbGVydChxaW5wZWwudHIoXCJQcm9ibGVtIG9uIGVudGVyOiBcIikgKyBlcnIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59KTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bG9naW4uanMubWFwIl19
