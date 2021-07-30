import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import CancelIcon from '@material-ui/icons/Cancel';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import { useCookies } from 'react-cookie';
import HostUrl from 'config';
import { useHistory } from 'react-router-dom';
import 'styles/components/modalStyle.css';
//modal
const useStyles = makeStyles((theme) => ({
  modal: { 
    display: 'flex',
    height:'60%',
    justifyContent: 'center',
  },
  paper: {
    position:'absolute',
    top:'40%',
    height:'60%',
    width:'30%',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(1, 8, 9),
    overflowY: 'scroll',
  },
  modalhead: {
    flex:2,
    backgroundColor:'rgb(225,221,214)',
    textAlign:'center',
  },
  modalbody: {
    flex:6,
  },
  modalheadtxt: {
    display:'inline-block',
    
  },
  closebutton: {
    position:'relative',
    left:'23%',
  },
  profile: {
    display:'flex',
    margin:'5%',
  },
  namebox: {
    flex:'2',
  },
  name: {
    marginLeft:'5%',
  },
  buttonbox: {
    flex:'3',
  },
  mybutton: {
    position:'relative',
    left:'55%',
    top:'15%',
  }
}));

//Avatar
const useStylesavatar = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(3),
    },
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(8),
    height: theme.spacing(8),
  },
}));
  
export default function TransitionsModal({open,setOpen,modaltitle,content,setcontent,buttonmessage,listoffollowing,setfollowinglist}) {//content is list of follower or following
  const classes = useStyles();
  const [followingidlist, setfollowingidlist] = React.useState([]);
  React.useEffect(()=>{
    var tempidlist = [];
    for(var i=0; i< listoffollowing.length; i++){
      tempidlist.push(listoffollowing[i].userId);
    }
    setfollowingidlist(tempidlist);
  },[listoffollowing])  
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <div className={classes.modalhead}>
              <h2 className={classes.modalheadtxt} id="transition-modal-title">{modaltitle}</h2>
              <IconButton className={classes.closebutton} type="button" onClick={()=>{setOpen(false)}}>
                <CancelIcon/>
              </IconButton>
            </div>
            <div className={classes.modalbody}>
              {content.map((key)=>{
                if (!buttonmessage)//means its in follower list, need to compare
                {
                  return (
                    <Determinebuttonfunction 
                      key={key.userId}
                      userId={key.userId}
                      thisusername={key.fullName}
                      followingidlist = {followingidlist}
                      listoffollowing={listoffollowing}
                      setfollowinglist={setfollowinglist}
                      setcontent={setcontent}
                      modaltitle={modaltitle}
                    />//return follow or unfollow message corrspondly
                  );
                } else{
                  return (
                    <Unfollowcomponent
                      key={key.userId}
                      userId={key.userId}
                      thisusername={key.fullName}
                      buttonmessage={"UNFOLLOW"}
                      handleclick={false} 
                      listoffollowing={listoffollowing}                      
                      setfollowinglist={setfollowinglist}   
                      setcontent={setcontent}
                      modaltitle={modaltitle}
                    />
                  );
                }
              })}
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}


function Determinebuttonfunction({setcontent,listoffollowing,userId,followingidlist,thisusername,setfollowinglist,modaltitle}) {
  const [buttonmessage,setbuttonmessage] = React.useState('');
  const [handleclick,sethandleclick] = React.useState('');

  React.useEffect(()=>{
    if(followingidlist.includes(userId)){
      setbuttonmessage("UNFOLLOW");
      sethandleclick(false);
    }else{
      setbuttonmessage("FOLLOW");
      sethandleclick(true);
    }
  },[followingidlist])
  return <>
    <Unfollowcomponent
      userId={userId}
      thisusername={thisusername}
      buttonmessage={buttonmessage}
      handleclick={handleclick} 
      listoffollowing={listoffollowing}       
      setfollowinglist={setfollowinglist} 
      setcontent={setcontent} 
      modaltitle={modaltitle}
    />
  </>;    
}

function Unfollowcomponent({setcontent,buttonmessage,handleclick,userId,thisusername,listoffollowing,setfollowinglist,modaltitle}){
  const classesavatar = useStylesavatar();
  const classes = useStyles();
  const [cookies] = useCookies(['token']); 
  const [errorMessage, setErrorMessage] = React.useState('');
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const history = useHistory();

  const sendunfollow = async () => { //Update user information including email, fullname 
    const settings = {
      method: 'PUT',
      headers: {
        'Authorization': cookies.token,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "id": userId,
      }),
    }
    setLoading(true);
    try {
      const response=await fetch(HostUrl('/user/unfollow'), settings);
      if (!response.ok) {
        setLoading(false);
        if (response.status === 403) {
          setError(true);
        } else if (response.status === 500) {
          setError(true);
          setErrorMessage('Server is unreachable. Please try again later');
        } else {
          setError(true);
          setErrorMessage('Could not connect to the server');
        }
      } else {
        setLoading(false);
        if (response.status === 200) {
          try {
            const data = await response;  
            var temp = [...listoffollowing];
            for (var i = 0; i < temp.length;i++){
              if(temp[i].userId === userId){
                temp.splice(i, 1);
                break;
              }
            }
            setfollowinglist(temp);
            if(modaltitle === 'List of Following'){
              setcontent(temp);
            }
          } catch (e) {
            throw e;
          }
        }
      }
    // Catch error when there server is not available
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError(true);
      setErrorMessage('Could not connect to the server');
    }
  }; 

  const sendfollow = async () => { //Update user information including email, fullname 
    const settings = {
      method: 'PUT',
      headers: {
        'Authorization': cookies.token,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "id": userId,
      }),
    }
    setLoading(true);
    try {
      const response=await fetch(HostUrl('/user/follow'), settings);
      if (!response.ok) {
        setLoading(false);
        if (response.status === 403) {
          setError(true);
        } else if (response.status === 500) {
          setError(true);
          setErrorMessage('Server is unreachable. Please try again later');
        } else {
          setError(true);
          setErrorMessage('Could not connect to the server');
        }
      } else {
        setLoading(false);
        if (response.status === 200) {
          try {
            const data = await response; 
            var temp = [...listoffollowing];
            temp.push({userId:userId,fullName:thisusername,username:'somename'});
            setfollowinglist(temp);  
            //setcontent(temp);
            
          } catch (e) {
            throw e;
          }
        }
      }
    // Catch error when there server is not available
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError(true);
      setErrorMessage('Could not connect to the server');
    }
  };

  return <>
    <div className={classes.profile}>
      <Avatar className={classesavatar.large}
        id="avatarHover"
        onClick={()=>{
          history.push('/user/'+userId); 
        }}
      >{thisusername.charAt(0)}</Avatar>
      <div  className={classes.namebox}
        id="usernameHover"
        onClick={()=>{
          history.push('/user/'+userId); 
        }}
      ><h3 className={classes.name}>{thisusername}</h3></div>
      <div  className={classes.buttonbox}>
        <Button  className={classes.mybutton} variant="outlined" size="small"
        onClick={()=>{
          if (!handleclick){
            console.log("unfollow "+userId);
            sendunfollow();
          } else{
            console.log("follow "+userId);
            sendfollow();
          }
        }}>
        {buttonmessage}
        </Button>
      </div>
    </div>
  </>; 
}

