import React, { useEffect, useState } from 'react'
import './StartChat.css'
import { Avatar } from '@mui/material';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';

import Typography from '@mui/material/Typography';
import Chat from './Chat';

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import img from './welcome-placeholder.jpeg'
import bg from './whatsapp__default.png'
import Cookies from 'universal-cookie';
import {Link, useNavigate} from 'react-router-dom'

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
 
const cookies = new Cookies();

const options = [
  "New Chat",
  "Logout"
];

const ITEM_HEIGHT = 48;


const StartChat = () => {

  const [allUsers, setallUsers] = useState([])
  const [user, setuser] = useState([])
  const [Id, setId] = useState('')
  const userId=cookies.get("userId")
  
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const [open1, setOpen1] = React.useState(false);
  const [scroll, setScroll] = React.useState('paper');

  const handleClickOpen = (scrollType) => () => {
    setOpen1(true);
    console.log("Called")
    setScroll(scrollType);
  };

  const handleClose1 = () => {
    setOpen1(false);
  };

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open1) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open1]);



  useEffect(function(){
    onLoad()
    // chatWith()

   },[]);

  
  const onLoad=async()=>{
   
    const response1=await axios.get("http://localhost:8000/user")
    const result1=response1.data
     setallUsers(result1)

     console.log(userId)

   const response2=await axios.get(`http://localhost:8000/user/${userId}`)
    const result2=response2.data
        setuser(result2)

   }

  const optionDot = (event) => {
    setAnchorEl(event.currentTarget);

  };
  const handleClose = (option) => {
    setAnchorEl(null);
    console.log(option)
   if(option==="Logout")
   {
     cookies.remove("loggedIn",{ path: '/'});
     cookies.remove("userId",{ path: '/'});
    //  cookies.remove("recieverId",{ path: '/'});
     navigate('/');
   }
     else if(option==='New Chat')
   {
     handleClickOpen('paper')()
     console.log("oihsadf")
   }
    console.log("handleClose ()")
  };

  const handleList=(id)=>{
  
    console.log(id,"handleList")
    // cookies.set('recieverId', id, { path: '/', maxAge: 30*60000 });
    console.log("handleList",id)
    setId(id)    
  }

  if (!allUsers && !user) return
  const filteredUser=allUsers.filter(el=>{return el._id!==user._id})
  let recentChat=false
  if(user.chat_with)
  {
    console.log(user)
   recentChat=user.chat_with
    console.log(recentChat)
  }
  
  return (
    <div className="app">
    <div className="app__top"></div>
    <div className="app__container">
      <div className='leftside'>
      <div className='nav'>
      <IconButton>
      <Avatar  alt="A Sharp" />
  
      </IconButton>
     
       <span className='username'> {user.username}</span>
    

      <IconButton   
        style={{ color: 'white' }}      
        className='optionDot'     
        aria-label="more"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={optionDot}
        >
      <MoreVertIcon />

      </IconButton>
      <Menu

        MenuListProps={{
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



       {recentChat.length?( <List sx={{ width: '100%', maxWidth: 500, bgcolor: 'background.paper' }}>

          {
            recentChat.map(user=>
              {
                return (
                  <div  key={user.sender_id ||  user.reciever_id}>
            {/* <Link to="/Chat" >        */}
           <Link to={`/chat?id=${user.sender_id ||  user.reciever_id}`}>       

           <ListItem alignItems="flex-start" style={{cursor:"pointer"}}>
           <ListItemAvatar>
           <Avatar alt={user.createdBy||user.createdWith} src="#" />
           </ListItemAvatar>
           <ListItemText 
           className='ListUsername'
          primary={user.createdBy||user.createdWith}
          secondary={
            <React.Fragment>
              <Typography
                sx={{ display: 'inline' }}
                component="span"
                variant="body2"
                color="text.primary"
                
              >
               ........
              </Typography>
             
            </React.Fragment>
          }
          onClick={()=>handleList(user.sender_id ||  user.reciever_id)}
          
          />
      </ListItem>
          </Link> 
      <Divider variant="inset" component="li" />
                 
                  </div>

                )
              })
          }
    </List>):
    (
    // <h4>No Chat Yet</h4>
    <List sx={{ width: '100%', maxWidth: 500, bgcolor: 'background.paper' }}>
      {/* handleClickOpen('paper')() */}
      <ListItem alignItems="flex-start" style={{cursor:"pointer"}}>
           <ListItemAvatar>
           <Avatar alt={"S"} src="#" />
           </ListItemAvatar>
           <ListItemText
           className='ListUsername'
          primary={"Start Chat"}
          secondary={
            <React.Fragment>
              <Typography
                sx={{ display: 'inline' }}
                component="span"
                variant="body2"
                color="text.primary"
                
              >
               New Chat
              </Typography>
             
            </React.Fragment>
          }
          onClick={handleClickOpen('paper')}
          
          />
      </ListItem>
      </List>

    )
    }

      </div>

      <div>
      <Dialog
      fullWidth='xs'
        open={open1}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">New Chat</DialogTitle>
        <DialogContent dividers={scroll === 'paper'}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
          
       {filteredUser.length?( <List sx={{ width: '100%', maxWidth: 600, bgcolor: 'background.paper' }}>

{
  filteredUser.map(user=>
    {
      return (
        <div  key={user._id}>
  {/* <Link to="/Chat" >       */}
  <Link to={`/chat?id=${user._id}`}>       

 <ListItem alignItems="flex-start" style={{cursor:"pointer"}}>
 <ListItemAvatar>
 <Avatar alt={user.username} src="#" />
 </ListItemAvatar>
 <ListItemText
 className='ListUsername'
primary={user.username}
secondary={
  <React.Fragment>
    <Typography
      sx={{ display: 'inline' }}
      component="span"
      variant="body2"
      color="text.primary"
      
    >
     
    </Typography>
   
  </React.Fragment>
}
onClick={()=>handleList(user._id)}

/>
</ListItem>
</Link> 
<Divider variant="inset" component="li" />
       
        </div>

      )
    })
}
</List>):null}

          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose1}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>

    <div className='rightside' style={{backgroundImage:`url(${img}`, backgroundPosition: "center",    backgroundRepeat: "no-repeat"}}>
       </div>
{/* 
      {
        !click?
        (
        <div className='rightside' style={{backgroundImage:`url(${img}`, backgroundPosition: "center",    backgroundRepeat: "no-repeat"}}>
       </div>
       ):
       (
        <div className='rightside' style={{backgroundImage:`url(${bg}`, backgroundPosition: "center",    backgroundRepeat: "no-repeat",backgroundSize: "cover"}}>
       <Chat id={Id} />
      </div>
      
       )
      } */}
      </div>
      </div>
  )
}

export default StartChat
