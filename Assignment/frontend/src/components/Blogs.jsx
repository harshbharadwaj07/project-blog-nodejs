import React, { useState,useEffect } from "react";
import Card from 'react-bootstrap/Card';
import Placeholder from 'react-bootstrap/Placeholder';
import Carousel from 'react-bootstrap/Carousel';

function Blogs(){
    const [blog,setBlog]=useState([]);
    const [load,setLoad]=useState(false);
    const getBlogs=async()=>{
        try{
            setLoad(true);
            const res=await fetch("/blogs",{
                method:"GET",
                headers:{
                    "Content-Type":"application/json"
                }
            });
            if(res.status===200){
                const data=await res.json();
                setBlog(data);
                setLoad(false);
            }
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(()=>{
        getBlogs();
      },[]);
    return(
        <div>
            <Carousel keyboard={false} style={{padding:"20px"}} interval={null} variant="dark" arrows={true}>
            {load===true?(
                <>
                <Carousel.Item>
                    <Card>
                    <Card.Body>
                        <Card.Title><Placeholder xs={6} /></Card.Title>
                        <Card.Text>
                        <Placeholder className="w-75" /> <Placeholder style={{ width: '25%' }} />
                        </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                        <small className="text-muted" style={{alignItems:"right"}}>
                        <ul class="bottm">
                            <li>Topic: <Placeholder xs={6} /></li>
                            <li>By: <Placeholder xs={6} /></li>
                        </ul>
                        </small>
                    </Card.Footer>
                    </Card>
                    </Carousel.Item>
                </>
            ):(
                (blog.length>0)?(blog.reverse().slice(0,5).map(p=>
                    <Carousel.Item>
                    <Card>
                    <Card.Body>
                        <Card.Title>{p.title}</Card.Title>
                        <Card.Text>
                        {p.desc}
                        </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                        <small className="text-muted" style={{alignItems:"right"}}>
                        <ul class="bottm">
                        <li>Topic: {p.type}</li>
                        <li>By: {p.writer}</li>
                    </ul>
                        </small>
                    </Card.Footer>
                    </Card>
                    </Carousel.Item>
                )):(<></>)
            )}
        
            </Carousel>
        
        </div>
    )
}
export default Blogs;