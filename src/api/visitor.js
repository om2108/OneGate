import api from "./api";

/*
CREATE
*/

export const addVisitor =
(data)=>

api.post(
"/visitors",
data
);

/*
SECRETARY
CREATE REGULAR
*/

export const createRegularVisitor =
(data)=>

api.post(
"/visitors/regular",
data
);

/*
ALL VISITORS
*/

export const getVisitors =
(
societyId
)=>

api
.get(
"/visitors",
{
params:{
societyId
}
}
)

.then(
r=>r.data
);

/*
SECRETARY
PENDING
*/

export const getSecretaryVisitors =
(
societyId
)=>

api
.get(
"/visitors/secretary",
{
params:{
societyId
}
}
)

.then(
r=>r.data
);

/*
APPROVE
*/

export const approveVisitor =
(
id
)=>

api.put(
`/visitors/${id}/approve`
);

/*
REJECT
*/

export const rejectVisitor =
(
id
)=>

api.put(
`/visitors/${id}/reject`
);

/*
SECRETARY UI
COMPATIBLE
*/

export const updateVisitorStatus =
(
id,
status
)=>{

if(
status==="APPROVED"
){

return approveVisitor(
id
);

}

return rejectVisitor(
id
);

};

/*
CHECK IN
*/

export const checkInVisitor =
(
id
)=>

api.put(
`/visitors/${id}/checkin`
);

/*
CHECK OUT
*/

export const checkOutVisitor =
(
id
)=>

api.put(
`/visitors/${id}/checkout`
);

/*
LOGS
*/

export const getVisitorLogs =
(
societyId
)=>

api
.get(
"/visitors",
{
params:{
societyId
}
}
)

.then(
r=>r.data
);

/*
SINGLE
*/

export const getVisitor =
(
id
)=>

api
.get(
`/visitors/${id}`
)

.then(
r=>r.data
);

/*
DELETE
*/

export const deleteVisitor =
(
id
)=>

api.delete(
`/visitors/${id}`
);