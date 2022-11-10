import React, { useState } from 'react'
import { Input,Button } from '@mui/material';
import {Link} from 'react-router-dom'

import VpnKeyIcon from '@mui/icons-material/VpnKey';
const Register = () => {
  // const ENDPOINT='https://app-reactchatapp.herokuapp.com'
  const ENDPOINT='http://localhost:8000'

  const [password,setPassword]=useState("")
  const [name,setName]=useState("")
  const [repeatPass,setRepeatPass]=useState("")

  const[err,SetErr]=useState("");

  const handleSubmit=async function(e){
    e.preventDefault();
   
    try{
      await saveToServer();
      // SetErr("User Registered")
    }catch(err){
       console.log(err)
      SetErr("Failed to Register")
   
    }
  
    setTimeout(() => {
      SetErr("")
    }, 3000);
    
    setPassword("")
    setName("")
    setRepeatPass("")
    
    } 

    function saveToServer()
    {
      let data={
        username:name,
        password:password,
        repeatPass:repeatPass
       }
       return(
  
          fetch(`${ENDPOINT}/user`, {
          method: 'POST', // or 'PUT'
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            let msg=data.msg
            SetErr(msg)
          })
          .catch((error) => {
            console.error('Error:', error);
          })
       )}
    
  return (
        <div className="app">
    <div className="app__top"></div>
  
  
     <div className='start'>
            
            <div className='main'>
             <h3 className='heading'><VpnKeyIcon  fontSize='large'></VpnKeyIcon>Register Page</h3>
             <form onSubmit={(e)=>handleSubmit(e)}>

             <Input placeholder='Username' 
              value={name}
              onChange={(e)=>{
              setName(e.target.value)
              }}
              required={true} 
             /><br></br><br></br>
             <Input type='password' placeholder='Password'
              value={password}
              onChange={(e)=>{
              setPassword(e.target.value)

              }}
              required={true} 
             /><br></br><br></br>
             <Input type='password' placeholder='Confirm Password'
              value={repeatPass}
              onChange={(e)=>{
                  setRepeatPass(e.target.value)
              }}
              required={true} 
             /><br></br><br></br>

             <span>
             <Button sx={{mr: 2}} variant="contained" color="success" type='submit'>Register</Button>
             <Link to="/">
             <Button color="success" variant="outlined"  >LogIn</Button>
             </Link>
             </span>
             </form>
             <h4 > {err?<span >{err}</span> :null} </h4>
            </div>
     </div>

    </div>
  )
}

export default Register
