import React, { useEffect, useState } from 'react'
import { Button, Input } from '@mui/material';
import {Link} from 'react-router-dom'
import LoadingButton from '@mui/lab/LoadingButton';

import Cookies from 'universal-cookie'
import StartChat from './StartChat';
import { useNavigate } from 'react-router-dom';

const cookies=new Cookies();
const Login = () => {
  const navigate = useNavigate();
  const [username,setUsername]=useState("")
  const [password,setPassword]=useState("")
  const [fetchData,setFetchData]=useState({});
  const [err,SetErr]=useState("");
  const [isLoading,setIsloading]=useState(false)
  useEffect(() => {
      fetch("http://localhost:8000/user")
      .then(function(response){
        console.log(response)
        return response.json();
        })
         .then(function(data){
           console.log(data);
           setFetchData(data);
    
        })
         .catch(function(err){
        
           console.log(err);
        });

      }, [])

      const handleSubmit=async function(e){
        e.preventDefault();
        setIsloading(true)
 
        try{
         await verifyFromServer();
         setIsloading(false)
       }catch(err){
          console.log(err)
         SetErr("Failed to Login")
         setIsloading(false)
       }

       setTimeout(() => {
        SetErr("")
       }, 2000);
 
        setUsername("")
        setPassword("")
       } 
 
        
   
     function verifyFromServer()
     {       
         for(let i=0;i<fetchData.length;i++)
        {
        let serverUsername=fetchData[i].username
         console.log(serverUsername)
         console.log(username,password)
         if(username===serverUsername )
               {
                 if(fetchData[i].password===password)
                       {
                         console.log("success",fetchData[i])
                         SetErr("Login Success")
                         cookies.set('loggedIn', true, { path: '/', maxAge: 30*60000 });
                         cookies.set('userId', fetchData[i]._id, { path: '/', maxAge: 30*60000 });

                         return
                       }
                 else
                     {
                      
                       SetErr("Incorrect Password")
                       return
                     }
 
               }
         else{
            continue
         }
        }
       
        SetErr("Wrong credentials!")
      
     }
      
  return (
          <>
             {(!cookies.get('loggedIn'))?(
                <div className="app">
                <div className="app__top"></div>
              
             
                 <div className='start'>
             <div className='main'>
             <h3>Login Page</h3>
             <form onSubmit={(e)=>handleSubmit(e)}>
            
             <Input placeholder='Username'
              value={username}
              onChange={(e)=>{
                  setUsername(e.target.value)
              }}  
              required
             /><br></br> <br></br>
             <Input type='password' placeholder='Password'
              value={password}
              onChange={(e)=>{
                  setPassword(e.target.value)
              }}  
              required
             /><br></br><br></br>

             <span>
             <LoadingButton 
               loading={isLoading}
               sx={{mr: 1}}
               type='submit'
               variant="contained"
               >LogIn</LoadingButton>

             <Link to="/register">
             <Button variant="outlined" >Register</Button>
             </Link>
             </span>
             </form>
             <h4 > {err?<span >{err}</span> :null} </h4>
             </div>
              </div>
              </div>
           
             ):
             (
              // navigate('/')
              <StartChat/>
             )}

</>
    
  )
}

export default Login
