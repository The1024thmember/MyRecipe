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
  
export default function TransitionsModal({open,setOpen,modaltitle,content,buttonmessage,listoffollowing}) {//content is list of follower or following
  const classes = useStyles();
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
                      key={key}
                      userId={key}
                      listoffollowing={listoffollowing}
                    />//return follow or unfollow message corrspondly
                  );
                } else{
                  return (
                    <Unfollowcomponent
                      key={key}
                      userId={key}
                      buttonmessage={"UNFOLLOW"}
                      handleclick={false}                     
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


function Determinebuttonfunction({listoffollowing,userId}) {
  const [buttonmessage,setbuttonmessage] = React.useState('');
  const [handleclick,sethandleclick] = React.useState('');
  React.useEffect(()=>{
    if(listoffollowing.includes(userId)){
      setbuttonmessage("UNFOLLOW");
      sethandleclick(false);
    }else{
      setbuttonmessage("FOLLOW");
      sethandleclick(true);
    }
  },[])
  
  return <>
    <Unfollowcomponent
      userId={userId}
      buttonmessage={buttonmessage}
      handleclick={handleclick}      
    />
  </>;    
}

function Unfollowcomponent({buttonmessage,handleclick,userId}){
  const classesavatar = useStylesavatar();
  const classes = useStyles();
  const [cookies] = useCookies(['token']); 
  const [errorMessage, setErrorMessage] = React.useState('');
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [userinfo,setuserinfo] = React.useState('');
  const history = useHistory();
  const getData = async () => { 
    const settings = {
      method: 'GET',
      headers: {
        'Authorization': cookies.token,
        'Accept': 'application/json',
      }
    };
    setLoading(true);
    try {
      const response = await fetch(HostUrl('/user/' + userId + '?page=' + 0 + '&size=' + 1), settings);
      if (response.status === 200) {
        const data = await response.json();
        setuserinfo(data.fullName);
      }
    } catch (err) {
      setLoading(false);
      setError(true);
      setErrorMessage('Could not connect to the server');
    }
  };

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
    console.log("follow user id: "+userId);
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
  React.useEffect(() => {
    getData();
  }, []);      
  return <>
    <div className={classes.profile}>
      <Avatar className={classesavatar.large}
        onClick={()=>{
          history.push('/user/'+userId); 
        }}
      >{userinfo.charAt(0)}</Avatar>
      <div  className={classes.namebox}
        onClick={()=>{
          history.push('/user/'+userId); 
        }}
      ><h3 className={classes.name}>{userinfo}</h3></div>
      <div  className={classes.buttonbox}>
        <Button  className={classes.mybutton} variant="outlined" size="small"
        onClick={()=>{
          if (!handleclick){
            console.log("unfollow "+userId);
            sendunfollow();
            //window.location.reload();
          } else{
            console.log("follow "+userId);
            sendfollow();
            //window.location.reload();
          }
        }}>
        {buttonmessage}
        </Button>
      </div>
    </div>
  </>; 
}

