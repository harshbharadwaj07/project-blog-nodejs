import React, { useState,useEffect } from "react";
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup'
import Placeholder from 'react-bootstrap/Placeholder';

function MJobs(){
    const [jobs,setJobs]=useState([]);
    const [load,setLoad]=useState(false);
    const getJobs=async()=>{
        try{
            setLoad(true);
            const res=await fetch("/jobs",{
                method:"GET",
                headers:{
                    "Content-Type":"application/json"
                }
            });
            if(res.status===200){
                const data=await res.json();
                setJobs(data);
                setLoad(false);
            }
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(()=>{
        getJobs();
      },[]);
    return(
        <div className="base">
        <h2>Latest Jobs:</h2>
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
                (jobs.length>0)?(jobs.map(job=>
                    <>
                    <Card className="card w-75 m-auto">
                        <Card.Body>
                            <Card.Title>{job.name}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">Location: {job.location}</Card.Subtitle>
                            <Card.Text>
                            Skills: {job.skills}
                            </Card.Text>
                            <Card.Link style={{ color: 'inherit', textDecoration: 'none' }}><b>Mode:</b> {job.mode}</Card.Link>
                            <Card.Link style={{ color: 'inherit', textDecoration: 'none' }}><b>CTC:</b> {job.ctc} p.a.</Card.Link>
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
export default MJobs;