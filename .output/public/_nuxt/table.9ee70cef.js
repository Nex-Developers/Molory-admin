import{o as e,b as t,e as l,t as n,F as i,E as o}from"./entry.3decec21.js";const u={class:"w-full p-2"},h={class:"text-center text-white text-lg bg-primary uppercase"},_={class:"w-full border-separate border-spacing-y-2"},y={class:"w-full"},f={class:"h-16 text-primary text-left capitalize"},g={key:0},p=["onClick"],x={key:0,class:"p-2"},k=["src"],m={key:1},b={key:1,class:"w-full h-full flex justify-center items-center"},w=l("p",{class:"text-red-600 text-center w-full h-full"},"Pas de donnée!",-1),v=[w],A={__name:"table",props:{title:String,headers:Array,data:{type:Array,default:[]},details:Function},setup(s){return(j,B)=>(e(),t("div",u,[l("div",h,n(s.title),1),l("table",_,[l("thead",y,[l("tr",f,[(e(!0),t(i,null,o(s.headers,(a,r)=>(e(),t("th",{key:r},n(a.label),1))),128))])]),s.data.length?(e(),t("tbody",g,[(e(!0),t(i,null,o(s.data,(a,r)=>(e(),t("tr",{class:"bg-gray-200 h-16 mx-5",key:r,onClick:c=>s.details(a.id)},[(e(!0),t(i,null,o(s.headers,(c,d)=>(e(),t("td",{key:d,class:"text-left"},[c.type=="image"?(e(),t("div",x,[l("img",{class:"w-16 aspect-square rounded-full object-cover",src:a[c.field]||"img/user.jpeg",alt:""},null,8,k)])):(e(),t("span",m,n(a[c.field]),1))]))),128))],8,p))),128))])):(e(),t("div",b,v))])]))}};export{A as _};