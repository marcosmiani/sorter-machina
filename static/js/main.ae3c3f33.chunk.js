(this["webpackJsonpsorter-machina"]=this["webpackJsonpsorter-machina"]||[]).push([[0],{18:function(n,e,t){},21:function(n,e,t){"use strict";t.r(e);var r=t(1),o=t(0),i=t.n(o),c=t(9),a=t.n(c),u=(t(18),t(4)),s=t(2),l=t.p+"static/media/logo.81f0d907.svg";function f(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"default",e=new Date;return console.info("starting timer at: ",e.toISOString()),{name:n,startTime:e}}function d(n){var e=0;if(n){var t=n.name,r=n.startTime,o=new Date;e=o.getTime()-r.getTime(),console.info("stopping ".concat(t," at ").concat(o.toISOString(),"!, duration: ").concat(e," ms"))}return e}function j(n){return Math.floor(Math.random()*Math.floor(n))}function h(n){for(var e=new Uint32Array(n),t=0;t<n;++t)e[t]=j(n);return e}function b(n,e){var t=new Uint32Array(n.length+e);t.set(n,0);for(var r=n.length-1;r<n.length+e;++r)n[r]=j(n.length+e);return t}function m(n,e,t){return n>t?t:n<e?e:n}var g=t(3);function x(){var n=Object(s.a)(["\n  color: darkkhaki;\n  margin: 20px 0;\n  max-width: 350px;\n  font-size: 14px;\n"]);return x=function(){return n},n}function v(){var n=Object(s.a)(["\n  max-width: 250px;\n  height: 250px;\n"]);return v=function(){return n},n}function p(){var n=Object(s.a)(["\n  width: 50px;\n  height: 50px;\n  font-size: 16px;\n  border-radius: 50%;\n  color: white;\n  background-color: darkgreen;\n  border: 0;\n  cursor: pointer;\n  font-weight: 900;\n\n  &:disabled {\n    cursor: wait;\n    background-color: gray;\n  }\n"]);return p=function(){return n},n}function O(){var n=Object(s.a)(["\n  width: 25px;\n  height: 25px;\n  align-self: flex-end;\n  color: white;\n"]);return O=function(){return n},n}function w(){var n=Object(s.a)(["\n  width: 100px;\n  height: 25px;\n  align-self: flex-end;\n  font-size: 20px;\n  background-color: transparent;\n  border: 0;\n  border-bottom: 2px dashed white;\n  color: white;\n  text-align: right;\n  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',\n    monospace;\n  margin-bottom: 4px;\n"]);return w=function(){return n},n}function k(){var n=Object(s.a)(["\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 0 0 0 20px;\n\n  &>span {\n    display: flex;\n    font-size: 16px;\n    justify-content: flex-end;\n  }\n"]);return k=function(){return n},n}function y(){var n=Object(s.a)(["\n  text-align: left;\n  flex: 1 0 auto;\n  min-width: 150px;\n"]);return y=function(){return n},n}function S(){var n=Object(s.a)(["\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  margin-bottom: 16px;\n"]);return S=function(){return n},n}function I(){var n=Object(s.a)(["\n  height: 40vmin;\n  pointer-events: none;\n\n  @media (prefers-reduced-motion: no-preference) {\n    animation: "," infinite "," linear;\n  }\n"]);return I=function(){return n},n}function C(){var n=Object(s.a)(["\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n"]);return C=function(){return n},n}function z(){var n=Object(s.a)(["\n  text-align: center;\n  background-color: #282c34;\n  min-height: calc(100vh - 40px);\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  font-size: 20px;\n  color: white;\n  padding: 20px;\n"]);return z=function(){return n},n}function F(){var n=Object(s.a)(["\n  from {\n    transform: rotate(0deg);\n  }\n  to {\n    transform: rotate(360deg);\n  }\n"]);return F=function(){return n},n}var T=Object(g.b)(F()),M=g.a.div(z()),W=g.a.header(C()),D=g.a.img(I(),T,(function(n){return n.processing?"1s":"20s"})),A=g.a.div(S()),B=g.a.label(y()),E=g.a.div(k()),J=g.a.input(w()),L=g.a.input(O()),P=g.a.button(p()),U=g.a.div(v()),G=g.a.code(x());function N(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:function(){},e=null;return window.Worker?((e=new Worker("worker.js")).onmessage=function(e){var t=e.data,r=t.action,o=t.result;n(o,r)},e.onerror=function(n){throw console.error("Worker error: "+n.message+"\n"),n}):console.error("Your browser doesnt support service workers"),e}function Y(n,e){var t=e.items,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:function(){},o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:function(){};n&&n.terminate();var i=N((function(n,e){"sort"===e?r(n):"sort-tick"===e&&o(n)}));return i.postMessage({action:"sort",items:t}),i}var q=1e6;var H=function(){var n=Object(o.useState)(!1),e=Object(u.a)(n,2),t=e[0],i=e[1],c=Object(o.useState)([]),a=Object(u.a)(c,2),s=a[0],j=a[1],g=Object(o.useState)(null),x=Object(u.a)(g,2),v=x[0],p=x[1],O=Object(o.useState)(null),w=Object(u.a)(O,2),k=w[0],y=w[1],S=Object(o.useState)(1e5),I=Object(u.a)(S,2),C=I[0],z=I[1],F=Object(o.useState)(!0),T=Object(u.a)(F,2),N=T[0],H=T[1],K=Object(o.useState)(50),Q=Object(u.a)(K,2),R=Q[0],V=Q[1],X=C>7e5;return Object(r.jsxs)(M,{children:[Object(r.jsxs)(W,{children:[Object(r.jsx)(D,{processing:t,src:l,alt:"logo"}),Object(r.jsxs)(A,{children:[Object(r.jsx)(B,{htmlFor:"size",children:"Size:"}),Object(r.jsxs)(E,{children:[Object(r.jsx)(J,{type:"number",name:"size",value:C,min:2,max:q,onChange:function(n){z(m(n.target.value,2,q))}}),Object(r.jsx)("span",{children:"2 to 1000000"})]})]}),Object(r.jsxs)(A,{children:[Object(r.jsx)(B,{htmlFor:"enabledInterval",children:"Enable intervals:"}),Object(r.jsx)(L,{type:"checkbox",name:"enabledInterval",value:"true",checked:N,onChange:function(n){H(n.target.checked)}})]}),N&&Object(r.jsxs)(A,{children:[Object(r.jsx)(B,{htmlFor:"interval",children:"Interval ms:"}),Object(r.jsxs)(E,{children:[Object(r.jsx)(J,{type:"number",name:"interval",value:R,min:50,max:1e3,onChange:function(n){V(m(n.target.value,50,1e3))}}),Object(r.jsx)("span",{children:"50 to 100"})]})]}),X&&Object(r.jsx)(G,{children:"This number of numbers could take a lot of time!"}),Object(r.jsx)(P,{disabled:t,onClick:function(){i(!0),function(n){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:function(){},r=100,o=f("sort it all"),i=null,c=null,a=0,u=null,s=h(n),l=function(n){d(i),i=f("sort machine"),c=Y(c,{items:n},(function(n){c&&c.terminate(),u&&clearInterval(u),t(n,d(o),d(i))}),(function(n){s=n}))};e&&(u=setInterval((function(){++a===r&&clearInterval(u),s=b(s,1),l(s)}),e)),l(s)}(C,N&&R,(function(n,e,t){i(!1),j(n),p(e),y(t)}))},children:"GO"})]}),Object(r.jsx)(U,{children:!t&&v&&Object(r.jsxs)(r.Fragment,{children:[Object(r.jsxs)("p",{children:["Total time: ",Object(r.jsxs)("code",{children:[v,"ms"]})," for ",s.length," items"]}),Object(r.jsxs)("p",{children:["Worker time ",Object(r.jsxs)("code",{children:[k,"ms"]})," to sort it all"]})]})})]})},K=function(n){n&&n instanceof Function&&t.e(3).then(t.bind(null,22)).then((function(e){var t=e.getCLS,r=e.getFID,o=e.getFCP,i=e.getLCP,c=e.getTTFB;t(n),r(n),o(n),i(n),c(n)}))};a.a.render(Object(r.jsx)(i.a.StrictMode,{children:Object(r.jsx)(H,{})}),document.getElementById("root")),K()}},[[21,1,2]]]);
//# sourceMappingURL=main.ae3c3f33.chunk.js.map