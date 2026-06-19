// src/pages/dashboard/resident/MyVisitors.jsx

import React,{
  useEffect,
  useMemo,
  useState
} from "react";

import {
  getVisitors,
  updateVisitorStatus
} from "../../../api/visitor";

import {useAuth} from "../../../context/AuthContext";

export default function MyVisitors(){

  const {user} =
    useAuth();

  const societyId =
    user?.societyId;

  const userId =
    user?.id;

  const [visitors,setVisitors] =
    useState([]);

  const [loading,setLoading] =
    useState(true);

  useEffect(()=>{

    if(!societyId || !userId)
      return;

    const loadVisitors =
      async()=>{

        try{

          const data =
            await getVisitors(
              societyId,
              [userId]
            );

          setVisitors(
            Array.isArray(data)
              ? data
              : []
          );

        }catch(err){

          console.log(err);

        }finally{

          setLoading(false);
        }
      };

    loadVisitors();

  },[
    societyId,
    userId
  ]);

  const approve =
    async(id)=>{

      await updateVisitorStatus(
        id,
        "APPROVED"
      );

      setVisitors(prev=>
        prev.map(v=>
          v.id===id
            ? {
                ...v,
                status:"APPROVED"
              }
            : v
        )
      );
    };

  const reject =
    async(id)=>{

      await updateVisitorStatus(
        id,
        "REJECTED"
      );

      setVisitors(prev=>
        prev.map(v=>
          v.id===id
            ? {
                ...v,
                status:"REJECTED"
              }
            : v
        )
      );
    };

  return(

    <div className="
      min-h-screen
      bg-slate-100
      p-6
      space-y-6
    ">

      <div>

        <h1 className="
          text-3xl
          font-bold
        ">
          My Visitors
        </h1>

        <p className="
          text-slate-500
        ">
          Visitors sent to your flat
        </p>

      </div>

      {loading ? (

        <div className="
          bg-white
          rounded-3xl
          py-20
          text-center
        ">
          Loading...
        </div>

      ) : visitors.length===0 ? (

        <div className="
          bg-white
          rounded-3xl
          py-20
          text-center
          text-slate-400
        ">
          No visitors
        </div>

      ) : (

        <div className="
          grid
          md:grid-cols-2
          xl:grid-cols-3
          gap-6
        ">

          {visitors.map(v=>(

            <div
              key={v.id}
              className="
                bg-white
                rounded-3xl
                overflow-hidden
                shadow-sm
              "
            >

              <img
                src={
                  v.imageUrl ||
                  "https://via.placeholder.com/400"
                }
                alt=""
                className="
                  w-full
                  h-56
                  object-cover
                "
              />

              <div className="
                p-5
                space-y-4
              ">

                <div className="
                  flex
                  justify-between
                ">

                  <div>

                    <h2 className="
                      text-lg
                      font-bold
                    ">
                      {
                        v.visitorName
                      }
                    </h2>

                    <p className="
                      text-sm
                      text-slate-500
                    ">
                      {v.phone}
                    </p>

                  </div>

                  <StatusBadge
                    status={v.status}
                  />

                </div>

                {v.status==="PENDING" && (

                  <div className="
                    flex
                    gap-2
                  ">

                    <button
                      onClick={()=>
                        approve(v.id)
                      }
                      className="
                        flex-1
                        bg-green-600
                        text-white
                        py-3
                        rounded-2xl
                      "
                    >
                      Approve
                    </button>

                    <button
                      onClick={()=>
                        reject(v.id)
                      }
                      className="
                        flex-1
                        bg-red-600
                        text-white
                        py-3
                        rounded-2xl
                      "
                    >
                      Reject
                    </button>

                  </div>

                )}

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

function StatusBadge({
  status
}){

  return(

    <span className={`
      px-4
      py-1.5
      rounded-full
      text-xs
      font-semibold

      ${status==="APPROVED"
        ? "bg-green-100 text-green-700"

        : status==="REJECTED"

        ? "bg-red-100 text-red-700"

        : "bg-yellow-100 text-yellow-700"
      }
    `}>

      {status}

    </span>
  );
}