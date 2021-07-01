import React from 'react';
import Header from 'components/Header/header';
import { makeStyles } from '@material-ui/core/styles';
import 'styles/pages/profilePageStyle.css';
import { RecipeReviewCard, CreateRecipeCard }  from 'components/RecipeCard/recipeCard.js';
import Avatar from '@material-ui/core/Avatar';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import styles from 'styles/pages/postRecipePageStyles';
import LogoutButton from 'components/LogoutButton/logoutButton';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import TransitionsModal from 'components/Modal/modal';
import TextField from '@material-ui/core/TextField';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { useCookies } from 'react-cookie';
import HostUrl from 'config';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import DeleteWarningDialog from 'components/Dialog/deleteWarningDialog';

function RightLink () {
  const history = useHistory();

  const handleBackButton = () => {
    history.goBack();
  }

  const classes = useStyles();
  return (
    <div className={classes.headerButtonContainer}>
      <Button
        variant="outlined"
        color="primary"
        startIcon={<KeyboardBackspaceIcon />}
        onClick={handleBackButton}
      >
        Back
      </Button>
      <LogoutButton />
    </div>
  )
}
const useStyles = makeStyles(styles);


function Handleeditname({fullname,setfullname,setshoweditname,updateinfo,setupdateinfo}) {
  const [tempname,settempname] = React.useState('');
  const handleclick=()=>{
    if (tempname){
      console.log('updating fullname: '+tempname);
      setfullname(tempname);
      setupdateinfo(updateinfo+1);
    } else{
      console.log('tempname=empty: '+tempname);
      setfullname(fullname);
    }
    setshoweditname(false);
  }
  return<>
    <TextField id="outlined-basic" label="Fullname" variant="outlined" 
      onChange={(e)=>{settempname(e.target.value)}}
    />
    <IconButton size="medium" onClick={handleclick}>
      <CheckBoxIcon />
    </IconButton>
  </>
}

function Handleeditemail({email,setemail,setshoweditemail,updateinfo,setupdateinfo}) {
  const [tempemail,settempemail] = React.useState('');
  const handleclick=()=>{
    if (tempemail) {
      console.log('updating email: '+tempemail);
      setemail(tempemail);
      setupdateinfo(updateinfo+1);
    } else{
      console.log('tempemail=empty: '+tempemail);
      setemail(email);
    }
    setshoweditemail(false);
  }
  return<>
    <TextField id="outlined-basic" label="Email" variant="outlined" 
      onChange={(e)=>{settempemail(e.target.value)}}
    />
    <IconButton size="medium" onClick={handleclick}>
      <CheckBoxIcon />
    </IconButton>
  </>
}

export default function ProfilePage () {
  const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    small: {
      width: theme.spacing(3),
      height: theme.spacing(3),
    },
    large: {
      width: theme.spacing(18),
      height: theme.spacing(18),
      fontSize:'6em',
    },
    iconSize: {
      width: '100px',
      height: '100px',
      color: 'rgb(180, 180, 180)'
    }
  }));
  
  const [cookies] = useCookies(['token']);
  const [username,setusername]= React.useState('');
  const [fullname,setfullname]=React.useState('');
  const [email,setemail]=React.useState('');
  const [myreceipes,setmyreceipes]=React.useState([]);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const usernameRef = React.useRef();
  const passwordRef = React.useRef();
  const classes = useStyles();
  const [open,setOpen] = React.useState(false);
  const [modaltitle,setmodaltitle] = React.useState('');
  const [modalcontent,setmodalcontent] = React.useState([]);// can be follower or following
  const [followinglist,setfollowinglist] = React.useState([]);
  const [followerlist,setfollowerlist] = React.useState([]);
  const [buttonmessage,setbuttonmessage] = React.useState('');
  const [showeditname,setshoweditname] = React.useState(false);
  const [showeditemail,setshoweditemail] = React.useState(false);
  const [pagenumber, setpagenumber] = React.useState(0); // everytime fetch should increase the number of page by one
  const [updateinfo,setupdateinfo] =  React.useState(0); // use useeffect to update info
  const sizenumber = 10 //for fetching recipe data from user
  const [showWarning, setShowWarning] = React.useState(false); //delete warning dialog
  const [warningFeedback, setWarningFeedback] = React.useState('');
  const [focusrecipeid, setfocusrecipeid] = React.useState(''); //recipeid to be deleted
  const history = useHistory();
  
  //handle infinite scroll
  const loader = React.useRef(null);

  const handleObserver = React.useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setpagenumber((prev) => prev + 1);
    }
  }, []);

  const handleAddRecipe = () => {
    history.push('/postrecipe');  
  }

  React.useEffect(() => {
    const option = {
      root: null,
      rootMargin: "0px",
      threshold: 1,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
  }, [handleObserver]);
  //handle infinite scroll
  
  
  const showfollowing = () => {
    setOpen(true);
    setmodaltitle('LIST oF FOLLOWING');
    setmodalcontent(followinglist);
    setbuttonmessage("unfollow");
  }
  const showfollower = () => {
    setOpen(true);
    setmodaltitle('LIST oF FOLLOWER');
    setmodalcontent(followerlist);
    setbuttonmessage("");//since we don't know if the user is following his/her follower, so need to compare each of his follower with following list to determine what should be on the button
  }

  const Getuserdata = async () => { //get user data include recipes, email, username, fullname  
    const settings = {
      method: 'GET',
      headers: {
        'Authorization': cookies.token,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }
    setLoading(true);
    try {
      const response = await fetch(HostUrl('/user?page='+pagenumber+'&size='+sizenumber), settings);
      setLoading(false);
      console.log(HostUrl('/user?page='+pagenumber+'&size='+sizenumber));
      const data = await response.json();
      setusername(data.username);
      setfullname(data.fullName);
      setemail(data.email);
      //console.log(data);
      setfollowerlist(data.followerList);
      setfollowinglist(data.followingList);
      // assigning data to recipes
      const oldmyreceipes=[...myreceipes];
      const newmyreceipes=oldmyreceipes.concat(data.pageRecipeEntity.content);
      //console.log(newmyreceipes);
      setmyreceipes(newmyreceipes);
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };  
  
  const updateuserdata = async () => { //Update user information including email, fullname 
    //console.log('changefullname: '+fullname);
    //console.log('changedemail: '+email);    
    const settings = {
      method: 'PUT',
      headers: {
        'Authorization': cookies.token,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "email": email,
        "fullName": fullname,
      }),
    }
    setLoading(true);
    try {
      const response = await fetch(HostUrl('/user'), settings);
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
            //console.log('data:');
            //console.log(data);          
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
  
  // for updating user info
  React.useEffect(() => {
    updateuserdata();
  }, [updateinfo]);  
  
  const handleclickname = () => {
    setshoweditname(true);    
  }
  
  const handleemialclick = () =>{
    setshoweditemail(true)
  }

  React.useEffect(() => {
    //console.log('cookies.token:'+cookies.token);
    Getuserdata();
  }, [pagenumber]);

  return (
    <>
    <Header rightLink={<RightLink />}/>
	  <div className='profileContainer' >
      <div className='infoContainer'>
        <div className={classes.root}>
          <Avatar className={classes.large}>{username.charAt(0)}</Avatar>
        </div>
        <div className='nameemail'>
          {!showeditname && 
            <h1>{fullname}
              <IconButton
                onClick={handleclickname}
                className='editbutton'>
                <EditIcon />
              </IconButton>
            </h1>
          }
          {showeditname && 
            <Handleeditname
              fullname={fullname}
              setfullname={setfullname}
              setshoweditname={setshoweditname}
              updateinfo={updateinfo}
              setupdateinfo={setupdateinfo}
            />
            
          }  
          <h3>{username}</h3>          
          {!showeditemail &&
            <h3>{email} 
              <IconButton 
              onClick={handleemialclick}
              className='editbutton'>
                <EditIcon />
              </IconButton>
            </h3>
          }
          {showeditemail &&
             <Handleeditemail
              email={email}
              setemail={setemail}
              setshoweditemail={setshoweditemail}
              updateinfo={updateinfo}
              setupdateinfo={setupdateinfo}
            />           
          }
               
        </div>
        <div className='subscibeinfo'>
          <div className='subscibebox'>
            <h1 className='subscibenumber'>
            {Object.keys(myreceipes).length}
            </h1>
            <h3>Posts</h3>
          </div>
          <div className='subscibebox'
          onClick={showfollowing}>
            <h1 className='subscibenumber'>
            {followinglist.length}
            </h1>
            <h3>Following</h3>
            </div>
          <div className='subscibebox'
          onClick={showfollower}>
            <h1 className='subscibenumber'>
            {followerlist.length}
            </h1>
            <h3>Followers</h3>
          </div>          
        </div>
      </div>
      <div className='recipeContainer'>
        {open &&
          <TransitionsModal
            open={open}
            setOpen={setOpen}
            modaltitle={modaltitle}
            content={modalcontent}
            buttonmessage={buttonmessage}
            listoffollowing={followinglist}//for follower and following comparsion
          />
        }
        {showWarning &&
          <DeleteWarningDialog
            message={"Are you sure you want to delete this recipe?"}
            setWarning={setShowWarning}
            setWarningFeedback={setWarningFeedback}
            recipeid={focusrecipeid}
            open={showWarning}
          />
        }
        <div className='containeroutline'>
          {Object.keys(myreceipes).map((key,index)=>(
            <div className='singlerecipe'
              key={key}
            >
              <RecipeReviewCard
                id={myreceipes[key]['id']}
                author={username}
                postdate={myreceipes[key]['updateTime']} // change it to real value, depends on the structure of myrecipe
                thumbnail={myreceipes[key]['thumbnail']} // change it to real value, depends on the structure of myrecipe
                title={myreceipes[key]['name']} //replace this with value read from database
                description={myreceipes[key]['description']}
                numberoflikes={150}
                numberofcomments={80}
                isprivate={username===cookies.username}
                setShowWarning={setShowWarning}
                warningFeedback={warningFeedback}
                setWarningFeedback={setWarningFeedback}
                setfocusrecipeid={setfocusrecipeid}
              /> 
            </div>	
          ))}
           <div className='singlerecipe'> 
            <div className="add-button-recipe">
              <h3>Create New Recipe</h3>
                <div className="add-button">
                  <IconButton className={classes.iconSize} onClick={handleAddRecipe}>
                    <AddCircleOutlineOutlinedIcon className={classes.iconSize}/>
                  </IconButton>
                </div>
            </div>
          </div>	
        </div>
        <div ref={loader} />
      </div>
	  </div>
    </>
  )
}

