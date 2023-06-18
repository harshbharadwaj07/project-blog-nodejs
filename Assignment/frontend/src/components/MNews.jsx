import React, { useState,useEffect } from "react";
import Card from 'react-bootstrap/Card';
import ListGroup from "react-bootstrap/ListGroup";
import Placeholder from "react-bootstrap/Placeholder"
import Spinner from "react-bootstrap/Spinner"
function MNews(){
    const [news,setNews]=useState([]);
    const [load,setLoad]=useState(false);
    const getNews=async()=>{
        try{
            setLoad(true);
            const url = 'https://bing-news-search1.p.rapidapi.com/news?count=100&safeSearch=Strict&textFormat=Raw';
            const options = {
                method: 'GET',
                headers: {
                    'X-BingApis-SDK': 'true',
                    'X-RapidAPI-Key': 'd99b866f93msh7df806d15ecda12p1a32f0jsn827a5a395ac8',
                    'X-RapidAPI-Host': 'bing-news-search1.p.rapidapi.com'
                }
            };

            const response = await fetch(url, options);
            const ans = await response.text();
            const data=JSON.parse(ans);
            setLoad(false);
            setNews(data.value);
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(()=>{
        getNews();
      },[]);
    return(
        <div className="base">
        <h2>Latest News:</h2>
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
                (news.length>0)?(news.map(n=>
                    <>
                    <Card className="card w-75 m-auto">
                    <ListGroup variant="flush">
                        <ListGroup.Item><a href={n.url}>{n.name}</a>
                        <br></br>
                        <b>Posted: </b> {n.datePublished.slice(0,10)}, {n.datePublished.slice(11,19)}
                        </ListGroup.Item>
                        <ListGroup.Item>{n.description}</ListGroup.Item>
                    </ListGroup>
                    </Card>
                    <br/>
                    </>
                )):(<></>))}
                </div>
        </div>
        </div>
    )
}
export default MNews;