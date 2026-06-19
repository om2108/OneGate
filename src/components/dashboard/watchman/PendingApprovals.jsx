import React,{
useEffect,
useState
}
from "react";

import {
useNavigate
}
from "react-router-dom";

import {
ArrowLeft,
RefreshCw,
Trash2,
Eye
}
from "lucide-react";

import {
getVisitors
}
from "../../../api/visitor";

const Card=({
item,
refresh,
cancel
})=>(

<div className="
bg-white
rounded-3xl
border
p-5
shadow-sm
">

<div className="
flex
justify-between
gap-5
">

<div>

<h2 className="
font-bold
text-xl
">

{
item.visitorName
}

</h2>

<p className="
text-sm
text-gray-500
">

Flat:
{
item.flatNumber
}

</p>

<p className="
text-sm
text-gray-500
">

Purpose:
{
item.purpose
}

</p>

</div>

<div>

<span
className="
bg-yellow-100
text-yellow-700
px-3
py-1
rounded-full
text-sm
"
>

{
item.status
}

</span>

</div>

</div>

{

item.imageUrl&&(

<img
src={
item.imageUrl
}
alt=""
className="
mt-4
rounded-2xl
w-full
h-60
object-cover
"
/>

)

}

<div className="
flex
gap-3
mt-5
">

<button
onClick={
refresh
}
className="
flex-1
bg-blue-50
text-blue-600
py-3
rounded-xl
"
>

<RefreshCw
size={18}
/>

</button>

<button
onClick={
cancel
}
className="
flex-1
bg-red-50
text-red-600
py-3
rounded-xl
"
>

<Trash2
size={18}
/>

</button>

<button
onClick={()=>
window.open(
item.imageUrl
)
}
className="
flex-1
bg-gray-100
py-3
rounded-xl
"
>

<Eye
size={18}
/>

</button>

</div>

</div>

);

export default function PendingApprovals(){

const navigate=
useNavigate();

const [
list,
setList
]=
useState([]);

const [
loading,
setLoading
]=
useState(true);

const societyId=
localStorage.getItem(
"secretarySocietyId"
);

const load=
async()=>{

try{

setLoading(
true
);

const res=
await getVisitors(
societyId
);

setList(

res.filter(

v=>

v.status
===
"PENDING"

)

);

}
catch{

alert(
"Failed"
);

}
finally{

setLoading(
false
);

}

};

useEffect(
()=>{
load();
},
[]
);

const cancel=
(id)=>{

setList(
prev=>

prev.filter(
x=>
x.id
!==id
)

);

};

return(

<div className="
min-h-screen
bg-slate-100
p-6
">

<div className="
max-w-5xl
mx-auto
">

<div className="
flex
items-center
gap-4
mb-6
">

<button
onClick={()=>
navigate(
"/dashboard/watchman/image-verification"
)
}
>

<ArrowLeft/>

</button>

<div>

<h1 className="
text-3xl
font-bold
">

Pending Approvals

</h1>

<p className="
text-gray-500
">

Waiting for secretary

</p>

</div>

</div>

{

loading

?

<div>

Loading...

</div>

:

<div
className="
space-y-5
"
>

{

list.length

?

list.map(
item=>

<Card

key={
item.id
}

item={
item
}

refresh={
load
}

cancel={()=>
cancel(
item.id
)
}

/>

)

:

<div
className="
bg-white
rounded-3xl
p-10
text-center
"
>

No pending visitors

</div>

}

</div>

}

</div>

</div>

);

}