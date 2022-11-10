import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Alert, Avatar, Button, Link, TextField } from '@mui/material';
import React, {  useEffect, useState } from 'react'
import axios from 'axios'
import io from 'socket.io-client'
import FileBase64 from 'react-file-base64';
import ScrollToBottom from 'react-scroll-to-bottom';
import ReactEmoji from 'react-emoji';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReactPlayer from 'react-player'
import CheckIcon from '@mui/icons-material/Check';
import ImageIcon from '@mui/icons-material/Image';

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
  const [alert,setAlert]=useState(false)
  const [alertMsg,setAlertMsg]=useState('')
  const recieverId=searchParams.get('id')
  const [selectedFile, setSelectedFile] = useState(null);
  // const ENDPOINT='https://app-reactchatapp.herokuapp.com'
  const ENDPOINT='http://localhost:8000'


  useEffect(function(){
    
    if(recieverId){
      onLoad()
      getPreviousChat(recieverId)
    }
  },[recieverId]);
  
  useEffect(()=>{
    socket=io(ENDPOINT);
    socket.on('message',(data,sendBy)=>{
      // console.log('FROM SOCKET',data,sendBy)  
      setMessages(messages=>[...messages,
      <div className={userId===sendBy?"onTime":"prevMsg"} key={Date.now()}>
      {data.includes("https://you"||"https://www.youtube.com")?(
       setAlert(true),
       setAlertMsg(`Youtube link ${userId===sendBy?"Send":"Recieved"} successfully — check it out!`),
       setTimeout(() => {
        setAlert(false)
       }, 2000) ,
       <ReactPlayer url={data} /> 
       
      ):ReactEmoji.emojify(data)} 
      <span className='rightTime'> {new Date().toLocaleTimeString('en-US')} </span>
      </div>])
    })
    socket.on('image',(img,sendBy)=>{
      // console.log('Image from SOCKET',img) 
      setAlert(true) 
      setAlertMsg(`Image is successfully ${userId===sendBy?"Send":"Recieved"} — check it out!`)
      setMessages(messages=>[...messages,
      <div className={userId===sendBy?"onTime":"prevMsg"}>
       <div> <img  src={img} alt='#' key={Date.now()}/> </div>
      <span className='rightTime'> {new Date().toLocaleTimeString('en-US')} </span>
        </div>])  
        setTimeout(() => {
        setAlert(false)
       }, 2000);


    })
    return ()=>{
      socket.disconnect();
      socket.off()
    }
  },[])
  
  const [messages,setMessages]=useState([])
  const [chatWith, setChatWith] = useState([])
  const [self, setSelf] = useState()
  const [selectedVideoFile, setSelectedVideoFile] = useState(null)
  const navigate = useNavigate();

  const [anchorEl, setAnhchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [input,setInput]=useState('');
  const [image,setImage]=useState('');

  const [prevMsg,setPrevMsg]=useState([])
  const userId=cookies.get("userId")
  // const recieverId=cookies.get("recieverId")

   const getPreviousChat=async(recieverId)=>{    
    const reciever_id=recieverId
    const sender_id=userId
     
    const response=await axios.get(`${ENDPOINT}/user/${sender_id}`)
    
    const all_ids=response.data.chat_with
    // console.log("all IDS",all_ids)
    
    const found=all_ids.find(item=>{return (item.sender_id===reciever_id)||(item.reciever_id===reciever_id)})
    // console.log("Found-------",found)
      if(!found) 
      {
        socket.emit('create')
        return
      }


      var chat_ID=found.chatId

      socket.emit('create',chat_ID)              
      const {data}=await axios.get(`${ENDPOINT}/getMessages/${chat_ID}`)
      if(data.length)
      {
        for(let item of data)
        {
          setPrevMsg(prev=>[...prev,item]) 
        }
        
      }
      
    }

  const onLoad=async()=>{
    const response1=await axios.get(`${ENDPOINT}/user/${recieverId}`)
    const result1=response1.data   
    setChatWith(result1)
 
    const response2  =await axios.get(`${ENDPOINT}/user/${userId}`)
    const result2=response2.data
        setSelf(result2)
      
    }

   const handleSubmit=async(e)=>{
    e.preventDefault();
    
    if (!input || input.trimStart()==='') return
    if (input) {
     
     socket.emit('chat message',input,userId);
     
    //  console.log("Chat message is send")
     const u2u=
     {
       sender:self,
       reciever:chatWith
     }
   
     let obj={
      user2user:u2u,
      msg:input
      
    }
     try {
    
       fetch(`${ENDPOINT}/message`,{
        mode: 'cors',
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
}

const handleImage=(e)=>{
  e.preventDefault()
  if (image) { 
    socket.emit('chat image', image,userId);
    // console.log("chat image is send")
    const u2u=
    {
      sender:self,
      reciever:chatWith
    }
   
    let obj={
     user2user:u2u,
     img:image
     
   }
    try {
 
      fetch(`${ENDPOINT}/image`,{
       mode:'cors',
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
    setImage("")
      }
  

  const optionDot = (event) => {
    setAnhchorEl(event.currentTarget);

  };
  const handleClose = (option) => {
    setAnhchorEl(null);  
  };

  const handleVideo=(e)=>{
  
    setSelectedVideoFile(e.target.files[0])
    // console.log(e.target.files[0]);
  }
 
const handleVideoSubmit=(e)=>{
  e.preventDefault();
  const formData = new FormData();

  formData.append('video', selectedVideoFile);
  // console.log(formData)
  // const u2u=
  // {
  //   sender:self,
  //   reciever:chatWith
  // }
  const sender=JSON.stringify(self)
  const reciever=JSON.stringify(chatWith)
 
  formData.append('sender',sender)
  formData.append('reciever',reciever)

  // formData.append('user2user',u2u)


  //  obj.append(formData)

   try {
    // console.log(image) 
    fetch(`${ENDPOINT}/uploadvideo`,{
    mode:'cors',
     method:"POST",
     body:formData,
   })
  } 
  catch (error) {
   console.log(error)
  }
  }

  const testing=(e)=>{
    e.preventDefault()
  }
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
    
     <ScrollToBottom className='content'>

   <div id="messages">
          {(prevMsg.map((el,index)=>{return (
              <div key={index} className={self.username===el.createdBy?"onTime":"prevMsg"} >
                {el.link?<ReactPlayer  url={el.link} />:(ReactEmoji.emojify(el.content)|| <div><img  alt='#' src={el.image}/></div>)}
              <span className='rightTime'> {new Date(`${el.created_at}`).toLocaleTimeString("en-US")} </span>
            </div>
          )}))}
          {messages.length?messages:null}
        </div>
          </ScrollToBottom>   

          <div className='alert'>
       {alert?(
        <Alert icon={<CheckIcon fontSize="inherit" />}  severity="success">{alertMsg}</Alert>
      ):null}
      </div>


   <div className='sendBox'>

    <div className='send1'>
   {/* <form className='sendVideo' onSubmit={handleVideoSubmit}>
              
   <input type="file" name="file" onChange={handleVideo} />
   <Button variant="contained" color="success"  type='submit' >Send Video</Button>
    
   </form > */}
                
    {/* <form  onSubmit={handleImage}>
    <FileBase64
    className="inputImg"
    type="file"
    multiple={false}
    onDone={({base64})=>setImage(base64)}
    required
    />

    <Button variant="contained" color="success"  type='submit' >Send Image</Button>
    </form> */}
    

   <form onSubmit={testing} >
    <label for='upload' id='upload-btn'>
    <ImageIcon ></ImageIcon>
      <span id='text' value={selectedFile}>Image</span>
    
    </label>
    <input type='file' name='upload' id='upload'
     
    accept="image/*"  
    onChange={(e) => setSelectedFile(e.target.files[0])} ></input>
   </form>

  {/* <Link
  type='file'
  variant="body2"
  onClick={()=>{
    console.log("licked")
  }}
>
 <ImageIcon color='success'></ImageIcon>
</Link> */}


    </div>

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
