import{s as r,m as a}from"./entry.3decec21.js";import{s as e}from"./useAlert.0eb29998.js";async function l(){const s=r();a("trips");try{e(!0,"Loading");const o={Authorization:"Bearer "+a("auth_token").value,"Content-Type":"Application/json"},{data:t}=await $fetch(`${s.BASE_URL}/trip`,{method:"GET",headers:o});return console.log(t),a("trips").value=t,e(!1),t}catch(o){console.log(o.message),e(!1)}}async function u(s){const o=r();try{e(!0,"Loading");const t={Authorization:"Bearer "+a("auth_token").value,"Content-Type":"Application/json"},{data:n}=await $fetch(`${o.BASE_URL}/trip/${s}`,{method:"GET",headers:t});return console.log(n),e(!1),n}catch(t){console.log(t.message),e(!1)}}export{l as a,u as g};
