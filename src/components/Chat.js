import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Avatar, Button, TextField } from '@mui/material';
import React, {  useEffect, useState } from 'react'
import axios from 'axios'
import io from 'socket.io-client'
import FileBase64 from 'react-file-base64';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import Cookies from 'universal-cookie'; 
import './Chat.css'

import bg from './whatsapp__default.png'

import { useNavigate, useSearchParams } from 'react-router-dom';
const cookies = new Cookies();

const options = [
  "Profile",
  "Help?"
];

const ITEM_HEIGHT = 48;

let socket


const Chat = () => {
  const [searchParams] = useSearchParams();
  console.log(searchParams.get('id')); // 'id'
  const recieverId=searchParams.get('id')

  useEffect(function(){
    
    if(recieverId){
      console.log(recieverId)
      onLoad()
      getPreviousChat(recieverId)
    }
  },[recieverId]);
  
  useEffect(()=>{
    socket=io('http://localhost:8000');
    socket.on('message',(data,sendBy)=>{
      console.log('FROM SOCKET',data,sendBy)  
      setMessages(messages=>[...messages,<div className={userId===sendBy?"onTime":"prevMsg"} key={Date.now()}>{data}
      <span className='rightTime'> {new Date().toLocaleTimeString('en-US')} </span>
      </div>])
    })
    socket.on('image',(img,sendBy)=>{
      console.log('Image from SOCKET',img)  
      setMessages(messages=>[...messages,
      <div>
        <img className={userId===sendBy?"onTime":"prevMsg"} src={img} key={Date.now()}/> 
        <span className='rightTime'> {new Date().toLocaleTimeString('en-US')} </span>
      <span className='rightTime'> {new Date().toLocaleTimeString('en-US')} </span>

        </div>])
    })
  },[])
  
  const [messages,setMessages]=useState([])
  const [chatWith, setChatWith] = useState([])
  const [self, setSelf] = useState([])
  const navigate = useNavigate();

  const [anchorEl, setAnhchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [input,setInput]=useState('');
  const [image,setImage]=useState('');

  const [prevMsg,setPrevMsg]=useState([])
  const [enter, setEnter] = useState(false)
  const userId=cookies.get("userId")
  // const recieverId=cookies.get("recieverId")

   const getPreviousChat=async(recieverId)=>{    
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
          console.log(item)
          setPrevMsg(prev=>[...prev,item]) 
        }
        
      }
      
    }

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
     
     socket.emit('chat message',input,userId);
     
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

const handleImage=(e)=>{
  e.preventDefault()
  if (image) { 
    setImage("")
    console.log("Inside Image")
    socket.emit('chat image', image,userId);
    
    console.log("chat image is send")
    const u2u=
    {
      sender:self,
      reciever:chatWith
    }

    console.log(chatWith)

   
    let obj={
     user2user:u2u,
     img:image
     
   }
    try {
      // console.log(image) 
      fetch("http://localhost:8000/image",{
       method:"POST",
       body:JSON.stringify(obj),
       headers:{
         "Content-Type":"application/json",
       }
     })
    } 
    catch (error) {
     console.log(error)
    }
     }
}
  

  const optionDot = (event) => {
    setAnhchorEl(event.currentTarget);

  };
  const handleClose = (option) => {
    setAnhchorEl(null);
    console.log(option)
  
    console.log("handleClose ()")
  };
  console.log("object",self.username)
  console.log("prev",prevMsg.createdBy)
  return (

    <div className="app">
    <div className="app__top"></div>
    <div className="container" style={{backgroundImage:`url(${bg}`, backgroundPosition: "center",    backgroundRepeat: "no-repeat",backgroundSize: "cover"}}>



   <div className='nav'>
    <ArrowBackIcon fontSize='medium' style={{ color: 'white' }} onClick={()=>navigate('/')}> </ArrowBackIcon>
   <IconButton>
      <Avatar  alt="A Sharp" />
  
      </IconButton>
      <span className='ChatWith'> {chatWith.username}</span>

      <IconButton 
      style={{ color: 'white' }}       
        aria-label="more"
        className='optionDot'   
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
   <div id="messages">
        
          {(prevMsg.map((el,index)=>{return (
            <div key={index} className={self.username===el.createdBy?"onTime":"prevMsg"}> 
              <div >{el.content|| <img  src={el.image}/>}
              <span className='rightTime'> {new Date(`${el.created_at}`).toLocaleTimeString("en-US")} </span>
              </div>

            </div>
          )}))}
          {messages.length?messages:null}
        </div>
   </div>

   <div className='sendBox'>
    <form className='send1' onSubmit={handleImage}>


   <FileBase64
    type="file"
    multiple={false}
    onDone={({base64})=>setImage(base64)}
    required
    />
  
    <Button variant="contained" color="success"  type='submit' >Send</Button>
    </form>

     <form className='send2' onSubmit={handleSubmit}>
        <TextField
        hiddenLabel
        id="filled-hidden-label-normal"
        placeholder='Type A Message'
        variant="filled"
        size="small"
        fullWidth 
        onChange={e=>setInput(e.target.value)}
        value={input}
        className="input"
        autoComplete='off'
      />
    </form>

   </div>
  
   </div>
    </div>
  
  )
}

export default Chat
