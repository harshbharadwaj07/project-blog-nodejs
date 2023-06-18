import React, { useState,useEffect } from "react";
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup'
import Placeholder from 'react-bootstrap/Placeholder';

function Jobs(){
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
        <div style={{marginTop:"25px"}}>
        <Card style={{height:"40vh", overflowY:"scroll",width:"325px"}}>
        <Card.Header>NEW JOBS</Card.Header>
        <Card.Body style={{overflowY:"scroll"}}>
            {load===true?(
                <>
                <Placeholder xs={6} />
                <Placeholder className="w-75" /> <Placeholder style={{ width: '25%' }} />
                <Placeholder className="w-75" /> <Placeholder style={{ width: '25%' }} />
                </>
            ):(
                (jobs.length>0)?(jobs.slice(0,2).map(job=>
                    <Card style={{ width: '18rem',marginBottom:"10px" }}>
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
                )):(<></>)
            )}
        
        </Card.Body>
        </Card>
        
        </div>
    )
}
export default Jobs;