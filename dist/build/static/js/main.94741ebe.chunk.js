(this["webpackJsonpcantact-manager-app"]=this["webpackJsonpcantact-manager-app"]||[]).push([[0],{400:function(e,t,a){"use strict";a.r(t);var n=a(27),r=a.n(n),s=a(9),c=a(0),o=a(72),i=a(19),l={username:"",accessToken:"",isLoggedIn:!1},u=function(e,t){var a=t.payload,n=a.username,r=a.accessToken,s=a.isLoggedIn;switch(t.type){case"login":return{username:n,accessToken:r,isLoggedIn:s};case"logout":return l;default:return e}},d=Object(c.createContext)({userState:l,userDispatch:function(){}}),j=(d.Consumer,d.Provider),p=a(21),m=a(32),b=a(508),x=a(505),h=a(509),O=a(500),g=a(58),f=g.b.POSITION.BOTTOM_CENTER,w=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"success",t=arguments.length>1?arguments[1]:void 0,a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:2e3,n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"primaryColor",r=arguments.length>4&&void 0!==arguments[4]?arguments[4]:f;"success"===e?g.b.success(t,{autoClose:null===a?2e3:a,className:null===n?"primaryColor":n,position:r}):"error"===e&&g.b.error(t,{autoClose:null===a?2e3:a,className:null===n?"dangerColor":n,position:r})},v=a(124),k=a.n(v),y=function(){var e=Object(c.useContext)(d);return k.a.create({headers:{"Content-Type":"application/json",Authorization:"".concat(e.userState.accessToken)},withCredentials:!0})},C=a(2),T=function(){var e="".concat("https://bolatah-contact-manager.herokuapp.com/api","/contacts"),t=Object(i.m)(),a=y(),n=function(){var n=Object(m.a)(Object(p.a)().mark((function n(r){var s,c;return Object(p.a)().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return r.preventDefault(),s=new FormData(r.target),n.prev=2,n.next=5,a.post(e,s);case 5:n.sent&&(w("success","Contact will be added."),setTimeout((function(){t("/list")}),2e3)),n.next=13;break;case 9:n.prev=9,n.t0=n.catch(2),c=n.t0,w("error",c.message);case 13:case"end":return n.stop()}}),n,null,[[2,9]])})));return function(e){return n.apply(this,arguments)}}();return Object(C.jsxs)(b.a,{component:"form",encType:"multipart/form-data",onSubmit:n,style:{margin:"0 auto",width:"500px",marginTop:"100px"},children:[Object(C.jsxs)(h.a,{required:!0,children:[Object(C.jsx)(O.a,{type:"text",id:"Name",name:"name",label:"Name",placeholder:"Name",maxRows:"1",required:!0,sx:{marginBottom:3}}),Object(C.jsx)(O.a,{type:"email",id:"Email",name:"email",label:"Email",placeholder:"Email",maxRows:"1",required:!0,sx:{marginBottom:3}}),Object(C.jsx)(O.a,{type:"tel",id:"phone",name:"phone",label:"phone",placeholder:"phone",maxRows:"1",required:!0,sx:{marginBottom:3}}),Object(C.jsx)(O.a,{type:"file",id:"File",name:"file",maxRows:"1",required:!0,sx:{marginBottom:3}}),Object(C.jsx)(O.a,{type:"message",id:"Message",name:"message",label:"Message",placeholder:"Message",sx:{marginBottom:3},required:!0,multiline:!0}),Object(C.jsx)(x.a,{type:"submit",variant:"outlined",children:"Submit"})]}),Object(C.jsx)(g.a,{})]})},S=a(258),R=a.n(S),B=function(){var e="".concat("https://bolatah-contact-manager.herokuapp.com/api","/contacts"),t=y(),a=Object(c.useContext)(d),n=Object(c.useState)([]),r=Object(s.a)(n,2),o=r[0],i=r[1],l=[{title:"file",field:"file",editComponent:function(e){return Object(C.jsxs)("div",{children:[Object(C.jsx)("img",{alt:"",id:"input-img",width:"45"}),Object(C.jsx)("input",{type:"file",id:"File",name:"file",accept:"image/*",onChange:function(t){try{var a=t.target.files[0],n=document.getElementById("input-img"),r=new FileReader;r.onloadend=function(){n.src="".concat(r.result),e.rowData.file=n.src},r.readAsDataURL(a)}catch(s){console.log(s)}}})]})},render:function(e){var t;return Object(C.jsx)("img",{src:null!==(t=e.file)&&void 0!==t&&t.startsWith("data:image/")?"".concat(e.file):"data:image/jpg;base64,".concat(e.file),width:"45",alt:"contact"})}},{title:"name",field:"name"},{title:"email",field:"email"},{title:"phone",field:"phone"},{title:"message",field:"message"}],u=Object(c.useCallback)(Object(m.a)(Object(p.a)().mark((function t(){var n,r;return Object(p.a)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,k.a.get(e,{headers:{"Content-Type":"application/json",Authorization:"".concat(a.userState.accessToken)},withCredentials:!0});case 2:if(!(n=t.sent)){t.next=10;break}return t.next=6,n.data;case 6:r=t.sent,i(r.reverse()),t.next=11;break;case 10:console.log("Error while getting data");case 11:case"end":return t.stop()}}),t)}))),[e,a.userState.accessToken]);Object(c.useEffect)((function(){u()}),[u]);var j=function(){var a=Object(m.a)(Object(p.a)().mark((function a(n){return Object(p.a)().wrap((function(a){for(;;)switch(a.prev=a.next){case 0:if(a.prev=0,!(n.name.length>2)){a.next=24;break}if(!n.email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)){a.next=21;break}if(!(n.message.length>4)){a.next=18;break}if(!(n.phone.toString().length>5)){a.next=15;break}return a.next=7,t.post(e,n);case 7:if(!a.sent){a.next=13;break}return w("success","".concat(n.name," was added ")),a.next=12,u();case 12:return a.abrupt("return",a.sent);case 13:a.next=16;break;case 15:w("error","phone must be at least 5 characters");case 16:a.next=19;break;case 18:w("error","Message must be at least 4 characters");case 19:a.next=22;break;case 21:w("error",'Email must include "@"');case 22:a.next=25;break;case 24:w("error","Name bust be longer than 2 characters");case 25:a.next=30;break;case 27:a.prev=27,a.t0=a.catch(0),w("error","".concat(n.name," was not added"));case 30:case"end":return a.stop()}}),a,null,[[0,27]])})));return function(e){return a.apply(this,arguments)}}(),b=function(){var a=Object(m.a)(Object(p.a)().mark((function a(n,r){return Object(p.a)().wrap((function(a){for(;;)switch(a.prev=a.next){case 0:if(a.prev=0,!(n.name.length>2)){a.next=23;break}if(!n.email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)){a.next=20;break}if(!(n.phone.toString().length>5)){a.next=17;break}if(!(n.message.length>4)){a.next=14;break}return a.next=7,t.put(e+"/"+r._id,n);case 7:if(!a.sent){a.next=12;break}return a.next=11,u();case 11:w("success","".concat(n.name," was updated "));case 12:a.next=15;break;case 14:w("error","Message must be at least 4 characters");case 15:a.next=18;break;case 17:w("error","Phone must be at least 5 characters");case 18:a.next=21;break;case 20:w("error","A proper mail must be given");case 21:a.next=24;break;case 23:w("error","Name must be longer than 2 characters");case 24:a.next=29;break;case 26:a.prev=26,a.t0=a.catch(0),w("error","".concat(r.name," was not updated"));case 29:case"end":return a.stop()}}),a,null,[[0,26]])})));return function(e,t){return a.apply(this,arguments)}}(),x=function(){var a=Object(m.a)(Object(p.a)().mark((function a(n){return Object(p.a)().wrap((function(a){for(;;)switch(a.prev=a.next){case 0:return a.prev=0,a.next=3,t.delete(e+"/"+n._id);case 3:if(!a.sent){a.next=8;break}return w("success","".concat(n.name," was deleted")),a.next=8,u();case 8:a.next=13;break;case 10:a.prev=10,a.t0=a.catch(0),w("error","".concat(n.name," was not deleted"));case 13:case"end":return a.stop()}}),a,null,[[0,10]])})));return function(e){return a.apply(this,arguments)}}();return Object(C.jsxs)("div",{children:[Object(C.jsx)(R.a,{title:"Contact List",columns:l,data:o,options:{actionsColumnIndex:-1,addRowPosition:"first"},editable:{onRowAdd:j,onRowUpdate:b,onRowDelete:x}}),Object(C.jsx)(g.a,{})]})},q=a(12),D=a(10),I=a(73),L=a(506),E=a(511),F=a(512),M=a(510),N=a(499),P=a(514),A=a(515),z=a(513),U=a(261),_=a.n(U),W=a(263),G=a.n(W),J=a(262),Y=a.n(J),$=a(503),H=a(516),K=a(517),Q=a(212),V=a.n(Q),X=240,Z=Object(D.a)("main",{shouldForwardProp:function(e){return"open"!==e}})((function(e){var t=e.theme,a=e.open;return Object(q.a)({flexGrow:1,padding:t.spacing(3),transition:t.transitions.create("margin",{easing:t.transitions.easing.sharp,duration:t.transitions.duration.leavingScreen}),marginLeft:"-".concat(X,"px")},a&&{transition:t.transitions.create("margin",{easing:t.transitions.easing.easeOut,duration:t.transitions.duration.enteringScreen}),marginLeft:0})})),ee=Object(D.a)(E.a,{shouldForwardProp:function(e){return"open"!==e}})((function(e){var t=e.theme,a=e.open;return Object(q.a)({transition:t.transitions.create(["margin","width"],{easing:t.transitions.easing.sharp,duration:t.transitions.duration.leavingScreen})},a&&{width:"calc(100% - ".concat(X,"px)"),marginLeft:"".concat(X,"px"),transition:t.transitions.create(["margin","width"],{easing:t.transitions.easing.easeOut,duration:t.transitions.duration.enteringScreen})})})),te=Object(D.a)("div")((function(e){var t=e.theme;return Object(q.a)(Object(q.a)({display:"flex",alignItems:"center",padding:t.spacing(0,1)},t.mixins.toolbar),{},{justifyContent:"flex-end"})}));function ae(){var e=c.useState(!1),t=Object(s.a)(e,2),a=t[0],n=t[1],r=Object(I.a)(),i=Object(c.useContext)(d);return Object(C.jsxs)(C.Fragment,{children:[Object(C.jsxs)(b.a,{sx:{display:"flex"},children:[Object(C.jsx)(N.a,{}),Object(C.jsx)(ee,{position:"fixed",open:a,children:Object(C.jsxs)(F.a,{children:[Object(C.jsx)(z.a,{color:"inherit","aria-label":"open drawer",onClick:function(){n(!0)},edge:"start",sx:Object(q.a)({marginRight:"36px"},a&&{display:"none"}),children:Object(C.jsx)(_.a,{})}),Object(C.jsx)(P.a,{variant:"h6",noWrap:!0,component:"div",sx:{flexGrow:1},children:"Contact Manager"}),Object(C.jsx)(x.a,{color:"inherit",onClick:function(){w("success","You are logged out"),setTimeout((function(){i.userDispatch({type:"logout",payload:{username:"",accessToken:"",isLoggedIn:!1}})}),2e3)},children:"Log Out"})]})}),Object(C.jsxs)(L.a,{sx:{width:X,flexShrink:0,"& .MuiDrawer-paper":{width:X,boxSizing:"border-box"}},variant:"persistent",anchor:"left",open:a,children:[Object(C.jsx)(te,{children:Object(C.jsx)(z.a,{onClick:function(){n(!1)},children:"rtl"===r.direction?Object(C.jsx)(Y.a,{}):Object(C.jsx)(G.a,{})})}),Object(C.jsx)(A.a,{}),Object(C.jsxs)(M.a,{children:[Object(C.jsxs)($.a,{component:o.b,to:"/form",children:[Object(C.jsx)(H.a,{children:Object(C.jsx)(V.a,{})}),Object(C.jsx)(K.a,{primary:"Contact Form"})]},"formItem"),Object(C.jsxs)($.a,{component:o.b,to:"/list",children:[Object(C.jsx)(H.a,{children:Object(C.jsx)(V.a,{})}),Object(C.jsx)(K.a,{primary:"Contact List"})]},"listItem")]})]}),Object(C.jsx)(Z,{open:a,children:Object(C.jsx)(te,{})})]}),Object(C.jsx)(g.a,{})]})}var ne=a(518),re=a(521),se=a(520),ce=a(519),oe="".concat("https://bolatah-contact-manager.herokuapp.com/api"),ie=k.a.create({baseURL:oe,headers:{"Content-Type":"application/json"}}),le="".concat("https://bolatah-contact-manager.herokuapp.com/api","/users"),ue=function(){var e=Object(c.useContext)(d),t=Object(i.m)(),a=function(){var a=Object(m.a)(Object(p.a)().mark((function a(n){var r,s,c,o,i;return Object(p.a)().wrap((function(a){for(;;)switch(a.prev=a.next){case 0:return n.preventDefault(),r=n.currentTarget,s=new FormData(r),c={},s.forEach((function(e,t){c[t]=e})),a.prev=5,a.next=8,ie.post("".concat(le,"/login"),{username:c.username,password:c.password});case 8:(o=a.sent)&&(e.userDispatch({type:"login",payload:{username:o.data.username,accessToken:o.data.token,isLoggedIn:!0}}),w("success","You are logged in"),setTimeout((function(){t("/contactManagerApp")}),1e3)),a.next=16;break;case 12:a.prev=12,a.t0=a.catch(5),i=a.t0,w("error",i.message);case 16:case"end":return a.stop()}}),a,null,[[5,12]])})));return function(e){return a.apply(this,arguments)}}();return Object(C.jsxs)(C.Fragment,{children:[Object(C.jsx)("form",{onSubmit:a,children:Object(C.jsxs)(h.a,{required:!0,children:[Object(C.jsx)(O.a,{type:"text",label:"username",id:"Username",name:"username",placeholder:"Name",maxRows:"1",required:!0,sx:{marginBottom:3},autoComplete:"off"}),Object(C.jsx)(O.a,{type:"password",label:"password",id:"Password",name:"password",placeholder:"password",maxRows:"1",required:!0,sx:{marginBottom:3},autoComplete:"off"})," ",Object(C.jsx)("span",{children:Object(C.jsx)(x.a,{type:"submit",children:"Login"})})]})}),Object(C.jsx)(g.a,{})]})};function de(){return Object(C.jsxs)(ne.a,{children:[Object(C.jsx)(ce.a,{component:"img",height:"140",image:"https://www.spirit-of-the-sea.com/fileadmin//user_upload/Slider/Home/3.jpg"}),Object(C.jsxs)(se.a,{children:[Object(C.jsx)(P.a,{gutterBottom:!0,variant:"h5",component:"div",children:"Contact Manager"}),Object(C.jsxs)(P.a,{variant:"body2",color:"text.secondary",children:['Welcome to the "Contact-Manager". If you are not already registered please',Object(C.jsx)(x.a,{component:o.b,to:"/register",style:{textTransform:"none",fontSize:"1.2rem"},children:"register!"})]})]}),Object(C.jsxs)(re.a,{children:[Object(C.jsx)(ue,{}),Object(C.jsx)("br",{}),Object(C.jsx)("br",{})]})]})}var je="".concat("https://bolatah-contact-manager.herokuapp.com/api","/users"),pe=function(){var e=Object(i.m)(),t=Object(i.k)().state,a=function(){var a=Object(m.a)(Object(p.a)().mark((function a(n){var r,s,c;return Object(p.a)().wrap((function(a){for(;;)switch(a.prev=a.next){case 0:return n.preventDefault(),r=new FormData(n.currentTarget),s={},r.forEach((function(e,t){s[t]=e})),s.confirmPassword!==s.password&&w("error","password don't match"),a.prev=5,a.next=8,ie.post("".concat(je,"/register"),s);case 8:200===a.sent.status?(w("success","".concat(s.username," is registered.")),setTimeout((function(){e((null===t||void 0===t?void 0:t.path)||"/login")}),2e3)):w("error","username already exists"),a.next=16;break;case 12:a.prev=12,a.t0=a.catch(5),c=a.t0,w("error",c.message);case 16:case"end":return a.stop()}}),a,null,[[5,12]])})));return function(e){return a.apply(this,arguments)}}();return Object(C.jsxs)(C.Fragment,{children:[Object(C.jsx)("form",{onSubmit:a,style:{margin:"0 auto",width:"220px",marginTop:"100px"},children:Object(C.jsxs)(h.a,{required:!0,children:[Object(C.jsx)(O.a,{label:"username",type:"text",id:"username",name:"username",placeholder:"Name",maxRows:"1",required:!0,sx:{marginBottom:3}}),Object(C.jsx)(O.a,{label:"email",type:"email",id:"email",name:"email",placeholder:"Email",maxRows:"1",required:!0,sx:{marginBottom:3}}),Object(C.jsx)(O.a,{label:"phone",type:"tel",id:"phone",name:"phone",placeholder:"Phone",maxRows:"1",required:!0,sx:{marginBottom:3}}),Object(C.jsx)(O.a,{label:"password",type:"password",id:"password",name:"password",placeholder:"password",maxRows:"1",required:!0,sx:{marginBottom:3}}),Object(C.jsx)(O.a,{label:"confirm password",type:"password",id:"confirm-password",name:"confirmPassword",placeholder:"confirm password",maxRows:"1",required:!0,sx:{marginBottom:3}}),Object(C.jsx)("span",{children:Object(C.jsx)(x.a,{type:"submit",id:"submit",children:"Register"})})]})}),Object(C.jsx)(g.a,{})]})},me=function(e){var t=Object(c.useContext)(d),a=Object(i.k)(),n=e.children;return""!==t.userState.accessToken?Object(C.jsx)(C.Fragment,{children:n}):Object(C.jsx)(i.a,{to:"/",state:{from:a},replace:!0})},be=function(){var e=Object(c.useReducer)(u,l),t=Object(s.a)(e,2),a=t[0],n=t[1];return Object(C.jsx)(j,{value:{userState:a,userDispatch:n},children:Object(C.jsx)(o.a,{children:Object(C.jsxs)(i.d,{children:[Object(C.jsx)(i.b,{path:"/",element:Object(C.jsx)(de,{})}),Object(C.jsx)(i.b,{path:"/register",element:Object(C.jsx)(pe,{})}),Object(C.jsx)(i.b,{path:"*",element:Object(C.jsx)(de,{})}),Object(C.jsx)(i.b,{path:"/contactManagerApp",element:Object(C.jsx)(me,{children:Object(C.jsx)(ae,{})})}),Object(C.jsx)(i.b,{path:"/form",element:Object(C.jsx)(me,{children:Object(C.jsx)(T,{})})}),Object(C.jsx)(i.b,{path:"/list",element:Object(C.jsx)(me,{children:Object(C.jsx)(B,{})})})]})})})};a(399);r.a.render(Object(C.jsx)(be,{}),document.getElementById("root"))}},[[400,1,2]]]);
//# sourceMappingURL=main.94741ebe.chunk.js.map