import React, { useEffect, useState } from 'react'
import { Button, Input } from '@mui/material';
import {Link, useNavigate} from 'react-router-dom'
import LoadingButton from '@mui/lab/LoadingButton';
import LoginIcon from '@mui/icons-material/Login';

import Cookies from 'universal-cookie'
import StartChat from './StartChat';

const cookies=new Cookies();
const Login = () => {
  // const ENDPOINT='https://app-reactchatapp.herokuapp.com'
  const ENDPOINT='http://localhost:8000'
  const navigate = useNavigate();

  const [username,setUsername]=useState("")
  const [password,setPassword]=useState("")
  const [fetchData,setFetchData]=useState({});
  const [err,SetErr]=useState("");
  const [isLoading,setIsloading]=useState(false)
  useEffect(() => {
   
      fetch(`${ENDPOINT}/user`)
      .then(function(response){
        return response.json();
        })
         .then(function(data){
          //  console.log(data);
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
   
         if(username===serverUsername )
               {
                 if(fetchData[i].password===password)
                       {
                    
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
             <h3 className='heading'><LoginIcon  fontSize='large'></LoginIcon>Login Page </h3>
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
               color="success"
               >LogIn</LoadingButton>

             <Link to="/register">
             <Button variant="outlined" color="success" >Register</Button>
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
