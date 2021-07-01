import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ChatIcon from '@material-ui/icons/Chat';
import { useCookies } from 'react-cookie';
import HostUrl from 'config';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import 'styles/components/recipeCardStyle.css';

const useStyles = makeStyles((theme) => ({
  root: {
    Width: '345px',
    // display:'inline-block',
  },
  author: {
    paddingLeft:"90px",
    position:'relative',
    top:"40px",
    fontWeight:'bold',
    color:"rgb(88,88,88)",
  },
  header: {
    height:'100px',
    Width: '345px',
    overflowY:'hidden',
  },
  media: {
    position:'relative',
    bottom:'15px',
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  avatar: {
    backgroundColor: red[500],
    height:'60px',
    width:'60px',
    position:'relative',
    bottom:'13px',
  },
  content:{
    overflowY:'auto',
    height:'80px',
    Width: '345px',
    textAlign:'left',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  myaddcard: {
    // Width: '345px',
    //paddingTop: '90%', // 16:9
    textAlign:'center',
  },
  myheader: {
    paddingTop: '2%', // 16:9
    lineHeight:'normal',
    color:'rgb(100,100,100)',
  },
  myimage: {
    paddingBottom: '98%', // 16:9
    alignItems:'auto',
  }
}));

export function RecipeReviewCard({id,userId,author,thumbnail,title, postdate, description, numberoflikes, numberofcomments, isprivate, setShowWarning,warningFeedback,setWarningFeedback,setfocusrecipeid,style={}}) { //if isprivate is true means the user can delete or edit the recipe
  const classes = useStyles();
  const history = useHistory();
  const [cookies] = useCookies(['token']);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  //delete a recipe
  const deleterecipe = async (id) => { //get user data include recipes, email, username, fullname  
    var url=new URL(HostUrl('/user/recipe/'+id));
    //var params = {id:id};
    //Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
    const settings = {
      method: 'DELETE',
      headers: {
        'Authorization': cookies.token,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }
    setLoading(true);
    try {
      const response = await fetch(url, settings);
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
            console.log('data:');
            console.log(data); 
            window.location.reload();            
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
  //console.log("warningFeedback: "+warningFeedback);
  React.useEffect(()=>{ //depends on the warning feedback to decide delete recipe or not
    if(warningFeedback===id)
    {   
      setWarningFeedback('');
      console.log('deleting:');
      console.log(id);
      deleterecipe(id);
    }else{
      setfocusrecipeid('');
    }
  },[warningFeedback]);

  const handledelete = () => { //submit with backend for deleteing a recipe
    console.log("about to delete id="+id);
    setfocusrecipeid(id);
    setShowWarning(true);
  }    
  const handleedit =() => { //submit with backend for editing a recipe
    console.log('editing:');
    console.log(id);
    history.push('/updaterecipe/'+id);  
  }
  const handlelike = () => { //submit with backend for like a recipe
    console.log('liking:');
    console.log(id);    
  }
  const handlecomment = () => { //submit with backend for comment a recipe
    console.log('commenting:');
    console.log(id);    
  }

  const handlefulldetialview = () => {
    console.log('Going to full detail view:');
    console.log(id); 
    history.push('/recipe/'+id);  
  }
  
  const jumpToUsergallery=()=>{
    if (isprivate)
    {console.log('This is my profile page'); }
    else
    {
      console.log('Going to author userGallery page:'+userId); 
      history.push('/user/'+userId);
    }
  }

  return (
    <Card className={classes.root} style={style}>
      <span className={classes.author}
        id="recipeTitleHover"
        onClick={handlefulldetialview}>
        {title}
      </span>
      <CardHeader className={classes.header}
        avatar={
          <Avatar aria-label="recipe"
          id="avatarHover"
          onClick={jumpToUsergallery}
          className={classes.avatar}>
            {author.charAt(0).toUpperCase()}
          </Avatar>
        }
        action={isprivate&&
          <div>
            <div className={classes.controls}>
              <IconButton aria-label="edit"
              onClick={handleedit}>
                <EditIcon />
              </IconButton>
              <IconButton aria-label="delete"
              onClick={handledelete}>
                <DeleteIcon />
              </IconButton>
            </div>	
          </div>	
        }
        title={author}
        subheader={postdate.split(" ")[0]}
        
      />

      <CardMedia 
        onClick={handlefulldetialview} 
        id = "imageToHover"
        className={classes.media}
        image={thumbnail}
        title="Paella dish"
      />
      <CardContent className={classes.content}>
        <Typography variant="body2" color="textSecondary" component="p">
          {description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites" 
        onClick={handlelike}>
          <FavoriteIcon />
        </IconButton>{numberoflikes}
        <IconButton aria-label="comment"
        onClick={handlecomment}>
          <ChatIcon />
        </IconButton>{numberofcomments}
      </CardActions>
    </Card>
  );
}