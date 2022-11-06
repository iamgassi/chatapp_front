import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Avatar, TextField } from '@mui/material';
import React, {  useEffect, useState } from 'react'
import axios from 'axios'
import io from 'socket.io-client'

import Cookies from 'universal-cookie'; 
import './Chat.css'

import bg from './whatsapp__default.png'
const cookies = new Cookies();

const options = [
  "Profile",
  "Help?"
];

const ITEM_HEIGHT = 48;

let socket



const Chat = () => {
  useEffect(function(){
    if(recieverId){
      // onNewId()
      onLoad()
      getPreviousChat()
    }
  },[recieverId]);
  
  useEffect(()=>{
    socket=io('http://localhost:8000');
    socket.on('message',(data)=>{
      console.log('FROM SOCKET',data)  
      setMessages(messages=>[...messages,<li key={Date.now()}>{data}</li>])
    })
  },[])
  
  const [messages,setMessages]=useState([])
  const [chatWith, setChatWith] = useState([])
  const [self, setSelf] = useState([])

  const [anchorEl, setAnhchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [input,setInput]=useState('');
  const [prevMsg,setPrevMsg]=useState([])
  const [enter, setEnter] = useState(false)
  const userId=cookies.get("userId")
  const recieverId=cookies.get("recieverId")


  

   const getPreviousChat=async()=>{    
    const reciever_id=recieverId
    const sender_id=userId
     
    const response=await axios.get(`http://localhost:8000/user/${sender_id}`)
    
    const all_ids=response.data.chat_with
    console.log("all IDS",all_ids)
    
    const found=all_ids.find(item=>{return (item.sender_id===reciever_id)||(item.reciever_id===reciever_id)})
    console.log("Found-------",found)
      if(!found) 
      {
        // let temp="Temp_ID"
        socket.emit('create')
        console.log("!found")
        return
      }
      console.log("found")

      var chat_ID=found.chatId

      socket.emit('create',chat_ID)        
      // console.log(chat_ID) 
      // getChatId(chat_ID)
      console.log( chat_ID)
      
      const {data}=await axios.get(`http://localhost:8000/getMessages/${chat_ID}`)
      if(data.length)
      {
        for(let item of data)
        {
          console.log(item.content)
          setPrevMsg(prev=>[...prev,item.content]) 
        }
        
      }
      
    }
  //  const onLoad=async()=>{

  //  console.log(recieverId)
  //  fetch(`http://localhost:8000/user/${recieverId}`)
  //     .then(function(response){
  //      console.log(response)
  //      return response.json();
  //    })
  //     .then(function(data){
  //       console.log(data);
  //       setChatWith(data)
        
  //    })
  //     .catch(function(err){
  //       console.log(err);
  //    });

  //    fetch(`http://localhost:8000/user/${userId}`)
  //    .then(function(response){
  //     console.log(response)
  //     return response.json();
  //   })
  //    .then(function(data){
  //      console.log(data);
  //      setSelf(data)
       
  //   })
  //    .catch(function(err){
  //      console.log(err);
  //   });
     
  //  }

  const onLoad=async()=>{

    console.log(recieverId)
    const response1=await axios.get(`http://localhost:8000/user/${recieverId}`)
    const result1=response1.data   
    setChatWith(result1)
 
    const response2  =await axios.get(`http://localhost:8000/user/${userId}`)
    const result2=response2.data
        setSelf(result2)
      
    }

   const handleSubmit=async(e)=>{
    e.preventDefault();
    setEnter(true)
    if (input) {
     
     socket.emit('chat message', input);
     
     console.log("Chat message is send")
     const u2u=
     {
       sender:self,
       reciever:chatWith
     }

     console.log(chatWith)

    
     let obj={
      user2user:u2u,
      msg:input
      
    }
     try {
       console.log(input) 
       fetch("http://localhost:8000/message",{
        method:"POST",
        body:JSON.stringify(obj),
        headers:{
          "Content-Type":"application/json",
        }
      })
     } catch (error) {
      console.log(error)
     }

      }
    setInput("")
    setEnter(false)
}
  

  const optionDot = (event) => {
    setAnhchorEl(event.currentTarget);

  };
  const handleClose = (option) => {
    setAnhchorEl(null);
    console.log(option)
  
    console.log("handleClose ()")
  };
  return (

    <div className="app">
    <div className="app__top"></div>
    <div className="container" style={{backgroundImage:`url(${bg}`, backgroundPosition: "center",    backgroundRepeat: "no-repeat",backgroundSize: "cover"}}>



   <div className='nav'>
   <IconButton>
      <Avatar  alt="A Sharp" />
  
      </IconButton>
      <IconButton>
       {chatWith.username}
      </IconButton>

      <IconButton        
        aria-label="more"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={optionDot}
        >
      <MoreVertIcon />

      </IconButton>
      <Menu

        MenusProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option} onClick={()=>handleClose(option)}>
            {option}
          </MenuItem>
        ))}

      </Menu>
   </div>

   <div className='content'>
   <ul id="messages">
          {(prevMsg.map((el,index)=>{return <li key={index}>{el}</li>}))}
          {messages.length?messages:null}
        </ul>
   </div>

   <div className='sendBox'>
      
     <form id="form" onSubmit={handleSubmit}>
        <TextField
        hiddenLabel
        id="filled-hidden-label-normal"
        placeholder='Send Message'
        variant="filled"
        size="small"
        fullWidth 
        onChange={e=>setInput(e.target.value)}
        value={input}
        className="input"
        autoComplete='off'
      />
    </form>
       {/* <input id="input" onChange={e=>setInput(e.target.value)} value={input} autoComplete="off" />
       <button onClick={handleSubmit}>Send</button> */}
   </div>
  
   </div>
    </div>
  
  )
}

export default Chat
