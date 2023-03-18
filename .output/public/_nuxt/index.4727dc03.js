import{_ as A}from"./pagetitle.7e123cb8.js";import{s as p,m as c,a as f,h as B,o,b as n,e as t,H as D,t as h,F as y,E as x,w as g,v,u as C,p as $,c as b}from"./entry.3decec21.js";async function m(){const l=p();c("pricings");try{const s={Authorization:"Bearer "+c("auth_token").value,"Content-Type":"Application/json"},{data:i}=await $fetch(`${l.BASE_URL}/pricing`,{method:"GET",headers:s});return console.log(i),c("pricings").value=i,i}catch(s){console.log(s.message)}}async function S(l){console.log(l);const s=p();console.log(c("auth_token").value);const i={Authorization:"Bearer "+c("auth_token").value,"Content-Type":"Application/json"};try{const{data:a}=await $fetch(`${s.BASE_URL}/pricing`,{method:"POST",headers:i,body:l});m()}catch(a){console.log(a.message)}}async function L(l){const s=p();console.log(c("auth_token").value);const i={Authorization:"Bearer "+c("auth_token").value,"Content-Type":"Application/json"};try{const{data:a}=await $fetch(`${s.BASE_URL}/pricing`,{method:"PATCH",headers:i,body:l});m()}catch(a){console.log(a.message)}}async function P(l){const s=p();console.log(c("auth_token").value);const i={Authorization:"Bearer "+c("auth_token").value,"Content-Type":"Application/json"};try{const{data:a}=await $fetch(`${s.BASE_URL}/pricing`,{method:"DELETE",headers:i,body:l});m()}catch(a){console.log(a.message)}}const T={class:"w-full bg-white shadow-sm p-2 my-2"},j={class:"w-full relative items-start"},U={class:"text-lg text-primary text-center"},V={class:"text-secondary"},z=t("svg",{xmlns:"http://www.w3.org/2000/svg",class:"h-6 w-6 fill-current",viewBox:"0 0 512 512"},[t("title",null,"Add"),t("path",{d:"M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z",fill:"none",stroke:"currentColor","stroke-miterlimit":"10","stroke-width":"32"}),t("path",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"32",d:"M256 176v160M336 256H176"})],-1),R=[z],N={class:"w-full mt-5"},F={key:0},H=t("thead",null,[t("th",null,"From(Km)"),t("th",null,"To(Km)"),t("th",null,"Amount(F/Km)"),t("th",null,"Actions")],-1),K={key:0},q=["onUpdate:modelValue"],O={key:0},G=["onUpdate:modelValue"],I={key:0},J=["onUpdate:modelValue"],Q=["onClick"],W=t("svg",{xmlns:"http://www.w3.org/2000/svg",class:"h-6 w-6 fill-current",viewBox:"0 0 512 512"},[t("title",null,"Edit"),t("path",{d:"M384 224v184a40 40 0 01-40 40H104a40 40 0 01-40-40V168a40 40 0 0140-40h167.48",fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"32"}),t("path",{d:"M459.94 53.25a16.06 16.06 0 00-23.22-.56L424.35 65a8 8 0 000 11.31l11.34 11.32a8 8 0 0011.34 0l12.06-12c6.1-6.09 6.67-16.01.85-22.38zM399.34 90L218.82 270.2a9 9 0 00-2.31 3.93L208.16 299a3.91 3.91 0 004.86 4.86l24.85-8.35a9 9 0 003.93-2.31L422 112.66a9 9 0 000-12.66l-9.95-10a9 9 0 00-12.71 0z"})],-1),X=[W],Y=["onClick"],Z=t("svg",{xmlns:"http://www.w3.org/2000/svg",class:"h-6 w-6 fill-current",viewBox:"0 0 512 512"},[t("title",null,"Save"),t("path",{d:"M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z",fill:"none",stroke:"currentColor","stroke-miterlimit":"10","stroke-width":"32"}),t("path",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"32",d:"M352 176L217.6 336 160 272"})],-1),tt=[Z],et=["onClick"],ot=t("svg",{xmlns:"http://www.w3.org/2000/svg",class:"h-6 w-6 fill-current",viewBox:"0 0 512 512"},[t("title",null,"Cancel"),t("path",{d:"M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z",fill:"none",stroke:"currentColor","stroke-miterlimit":"10","stroke-width":"32"}),t("path",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"32",d:"M320 320L192 192M192 320l128-128"})],-1),nt=[ot],st=["onClick"],lt=t("svg",{xmlns:"http://www.w3.org/2000/svg",class:"h-6 w-6 fill-current",viewBox:"0 0 512 512"},[t("title",null,"Trash"),t("path",{d:"M112 112l20 320c.95 18.49 14.4 32 32 32h184c17.67 0 30.87-13.51 32-32l20-320",fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"32"}),t("path",{stroke:"currentColor","stroke-linecap":"round","stroke-miterlimit":"10","stroke-width":"32",d:"M80 112h352"}),t("path",{d:"M192 112V72h0a23.93 23.93 0 0124-24h80a23.93 23.93 0 0124 24h0v40M256 176v224M184 176l8 224M328 176l-8 224",fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"32"})],-1),it=[lt],at={key:1,class:"w-full"},rt=t("p",{class:"text-center text-gray-400"},' No pricing for this vehicle type! Clique on the button "+" on the top of the card to add a pricing. ',-1),ct=[rt],dt=f({__name:"item",props:{data:{type:Object,require:!0}},setup(l){const s=l,i=(r,u)=>r.lowerDistance<u.lowerDistance?-1:r.lowerDistance>u.lowerDistance?1:0,a=B(()=>s.data.pricings.sort(i)),k=()=>{a.value.push({vehicleTypeName:s.data.name,lowerDistance:null,upperDistance:null,unitPrice:null,isEditing:!0})},w=(r,u)=>{u?s.data.pricings[r].isEditing=!1:s.data.pricings.splice(r,1)},_=r=>{r.id?L(r):S(r)},E=r=>P({id:r});return(r,u)=>(o(),n("div",T,[t("div",j,[t("h3",U,[D(h(l.data.name)+" ",1),t("span",V,"("+h(l.data.maxSeats)+" max seats/trip)",1)]),t("div",null,[t("button",{class:"absolute right-0 top-0",onClick:k},R)])]),t("div",N,[l.data.pricings.length?(o(),n("table",F,[H,t("tbody",null,[(o(!0),n(y,null,x(C(a),(e,M)=>(o(),n("tr",{key:e.id},[t("td",null,[e.isEditing?g((o(),n("input",{key:1,"onUpdate:modelValue":d=>e.lowerDistance=d,placeholder:"Lower Distance"},null,8,q)),[[v,e.lowerDistance,void 0,{number:!0}]]):(o(),n("span",K,h(e.lowerDistance),1))]),t("td",null,[e.isEditing?g((o(),n("input",{key:1,"onUpdate:modelValue":d=>e.upperDistance=d,placeholder:"Upper distance"},null,8,G)),[[v,e.upperDistance,void 0,{number:!0}]]):(o(),n("span",O,h(e.upperDistance),1))]),t("td",null,[e.isEditing?g((o(),n("input",{key:1,"onUpdate:modelValue":d=>e.unitPrice=d,placeholder:"Unit price"},null,8,J)),[[v,e.unitPrice,void 0,{number:!0}]]):(o(),n("span",I,h(e.unitPrice),1))]),t("td",null,[e.isEditing?(o(),n("button",{key:1,class:"mx-2 text-green-700",onClick:d=>_(e)},tt,8,Y)):(o(),n("button",{key:0,class:"mx-2 text-gray-400",onClick:d=>e.isEditing=!0},X,8,Q)),e.isEditing?(o(),n("button",{key:2,class:"mx-2 text-red-500",onClick:d=>w(M,e.id)},nt,8,et)):(o(),n("button",{key:3,class:"mx-2 text-red-500",onClick:d=>E(e.id)},it,8,st))])]))),128))])])):(o(),n("div",at,ct))])]))}});const ut={class:"w-full h-full bg-medium px-10 py-8 overflow-y-auto"},ht={class:"w-full mt-6 flex justify-center gap-2"},_t={class:"w-3/4"},kt=f({__name:"index",setup(l){const s=c("pricings");return m(),(i,a)=>{const k=A,w=dt;return o(),n("div",ut,[$(k,{title:"Settings/Pricings"}),t("div",ht,[t("div",_t,[(o(!0),n(y,null,x(C(s),_=>(o(),b(w,{key:_.name,data:_},null,8,["data"]))),128))])])])}}});export{kt as default};