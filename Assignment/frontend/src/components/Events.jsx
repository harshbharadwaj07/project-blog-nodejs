import React, { useState,useEffect } from "react";
import Card from 'react-bootstrap/Card';
import Placeholder from 'react-bootstrap/Placeholder';

function Events(){
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
        <div style={{marginTop:"1rem"}}>
        <Card style={{height:"40vh", overflowY:"scroll",width:"325px"}}>
        <Card.Header>LATEST EVENTS</Card.Header>
        <Card.Body style={{overflowY:"scroll"}}>
            {load===true?(
                <>
                <Placeholder xs={6} />
                <Placeholder className="w-75" /> <Placeholder style={{ width: '25%' }} />
                <Placeholder className="w-75" /> <Placeholder style={{ width: '25%' }} />
                </>
            ):(
                (event.length>0)?(event.slice(0,5).map(evt=>
                    <Card style={{ width: '18rem',marginBottom:"10px"}}>
                        <Card.Body>
                            <Card.Title>{evt.name}</Card.Title>
                            <ul typeof="">
                            <li>Mode: {evt.mode}</li>
                            <li>Location: <a href={evt.link}>{evt.location}</a></li>
                            </ul>
                        </Card.Body>
                        </Card>
                )):(<></>)
            )}
        
        </Card.Body>
        </Card>
        
        </div>
    )
}
export default Events;