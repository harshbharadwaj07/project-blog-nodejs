import React, { useState,useEffect } from "react";
import Card from 'react-bootstrap/Card';
import Placeholder from 'react-bootstrap/Placeholder'
import Dropdown from 'react-bootstrap/Dropdown'

function Posts(){
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
    const getBlogsFilter=async(str)=>{
        try {
        if(str.length>0){
        const res=await fetch("/filter",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:
                JSON.stringify({str})
        });
        const data=await res.json();
            setBlog(data);
        }
        }catch (error) {
            console.log(error);
        }
    }
    useEffect(()=>{
        getBlogs();
      },[]);
    return(
        <div className="base">
        <div className="oneline">
        <h2 className="left">All Posts:</h2>
        <Dropdown className="right">
        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
            Filter
        </Dropdown.Toggle>

        <Dropdown.Menu>
        <Dropdown.Item onClick={() => getBlogsFilter("Technology")}>Technology</Dropdown.Item>
        <Dropdown.Item onClick={() => getBlogsFilter("Social")}>Social</Dropdown.Item>
        <Dropdown.Item onClick={() => getBlogsFilter("Environment")}>Environment</Dropdown.Item>
        </Dropdown.Menu>
        </Dropdown>
        <hr style={{clear:"both"}}/>
        </div>
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
                (blog.length>0)?(blog.reverse().map(p=>
                    <div>
                    <Card className="card w-75 m-auto">
                        <Card.Header as="h5">Topic: {p.type}</Card.Header>
                        <Card.Body>
                            <Card.Title>{p.title}</Card.Title>
                            <Card.Text>
                            {p.desc}
                            </Card.Text>
                            <p><b>By:</b> {p.writer}</p>
                        </Card.Body>
                    </Card>
                        <br/>
                    </div>
                )):(<></>))}
                </div>
        </div>
        </div>
    )
}
export default Posts;