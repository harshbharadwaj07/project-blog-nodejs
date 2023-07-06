import React,{useState,useEffect} from "react";
import Events from "./Events";
import News from "./News";
import Jobs from "./Jobs";
import Blogs from "./Blogs";
import Card from "react-bootstrap/Card"
function Home(){
    const [search,setSearch]=useState([]);
    const [searchStr,setSearchStr]=useState({str:""});
    function handleChange(event){
        const name=event.target.name;
        const value=event.target.value;
        setSearchStr({...searchStr,[name]:value});
    }
    async function handleSearch(e){
        e.preventDefault();
        try {
        const str=searchStr.str;
        const res=await fetch("/search",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:
                JSON.stringify({str})
        });
        const data=await res.json();
            setSearch(data);
        }catch (error) {
            console.log(error);
        }
      }
    return(
        <div className="d-flex flex-row w-100 justify-content-between">
            <div className="d-flex flex-row col-11 col-md-9" style={{height:"85vh"}}>
            <div className="d-none d-md-block col-sm-4" style={{height:"300px",padding:"1rem"}}>
                <News/>
            </div>
            <div className="col-11 col-md-8" style={{height:"85vh",padding:"1rem",textAlign:"center",alignItems:"center",marginTop:"25px"}}>
                <h1>Discover what you are looking for by searching blog posts...</h1>
                <br></br>

                <form method="POST">
                    <div className = "input-group">
                    <input type="text" className="input-group-field form-control" placeholder="Search posts" style={{bordeRadius: "10px"}} autocomplete="off" name="str" onChange={handleChange} value={searchStr.str}/>
                    <button type="submit" className="input-group-button btn btn-warning btn-lg" onClick={handleSearch}>Search</button>
                    </div>
                </form>

                <div style={{textAlign:"left", marginTop:"20px"}}>
                    {(search.length===0)?(
                        <>
                        <br></br>
                        <h3>Recent Posts</h3>
                        <Blogs/>
                        </>
                    ):(
                        <>
                        <h4>Searched Posts</h4>
                        <div style={{height:"55vh",padding:"10px",overflowY:"scroll"}}>
                        {(search.length>0)?(search.map(res=>
                    <Card style={{ marginBottom:"10px" }}>
                        <Card.Body>
                            <Card.Title>{res.title}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">Topic: {res.type}</Card.Subtitle>
                            <Card.Text>
                            {res.desc}
                            </Card.Text>
                            <Card.Link style={{ color: 'inherit', textDecoration: 'none' }}><b>Posted By:</b> {res.writer}</Card.Link>
                        </Card.Body>
                    </Card>
                )):(<></>)}
                </div>
                        </>
                    )}
                    
                </div>

            </div>
            </div>
            <div className="d-none d-md-block col-sm-3">
                <Events/>
                <Jobs/>
            </div>
        </div>
    )
}
export default Home;