import React, { useState,useEffect } from "react";
import Card from 'react-bootstrap/Card';
import Placeholder from 'react-bootstrap/Placeholder';

function MEvents(){
    const [event,setEvent]=useState({});
    const [load,setLoad]=useState(false);
    const getEvents=async()=>{
        try{
            setLoad(true);
            const res=await fetch("/events",{
                method:"GET",
                headers:{
                    "Content-Type":"application/json"
                }
            });
            if(res.status===200){
                const data=await res.json();
                setEvent(data);
                setLoad(false);
            }
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(()=>{
        getEvents();
      },[]);
    return(
        <div className="base">
        <h2>Latest Events:</h2>
        <div style={{padding:"20px",justifyItems:"center",height:"75vh",overflowY:"scroll"}}>
            <div className="reverse">
            {(load===true)?(
                <div className="card w-75 m-auto">
                    <Placeholder xs={6} />
                    <br/>
                    <Placeholder /> <Placeholder style={{ width: '25%' }} />
                    <Placeholder xs={6} />
                    <br/>
                    <Placeholder /> <Placeholder style={{ width: '25%' }} />
                    <Placeholder xs={6} />
                    <br/>
                    <Placeholder /> <Placeholder style={{ width: '25%' }} />
                    <Placeholder xs={6} />
                    <br/>
                    <Placeholder /> <Placeholder style={{ width: '25%' }} />
                    <Placeholder xs={6} />
                    <br/>
                    <Placeholder /> <Placeholder style={{ width: '25%' }} />
                    <Placeholder xs={6} />
                    <br/>
                    <Placeholder /> <Placeholder style={{ width: '25%' }} />
                    <Placeholder xs={6} />
                    <br/>
                    
                </div>
            ):(
                (event.length>0)?(event.map(evt=>
                    <>
                    <Card className="card w-75 m-auto">
                        <Card.Body>
                            <Card.Title>{evt.name}</Card.Title>
                            <ul>
                            <li>Mode: {evt.mode}</li>
                            <li>Location: <a href={evt.link}>{evt.location}</a></li>
                            </ul>
                        </Card.Body>
                        </Card>
                        <br/>
                        </>
                )):(<></>))}
                </div>
        </div>
        </div>
    )
}
export default MEvents;