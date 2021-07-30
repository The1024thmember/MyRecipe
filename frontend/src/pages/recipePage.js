import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useCookies } from 'react-cookie';
import { useParams, useHistory } from 'react-router-dom';
import 'styles/pages/recipePageStyles.css';
import HostUrl from 'config';

// Components
import Header from 'components/Header/header';
import BackButton from 'components/BackButton/backButton';
import Avatar from '@material-ui/core/Avatar';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CommentCard from 'components/CommentCard/commentCard';
import TextField from '@material-ui/core/TextField';
import SendIcon from '@material-ui/icons/Send';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import RecommendationContainer from 'components/Recommendation/RecommandationGallery.js'; //recommendation gallery
import LoadingScreen from 'components/Loader/loadingScreen';
import alanBtn from "@alan-ai/alan-sdk-web";



export function useRouter() {
  const params = useParams();
  return useMemo(() => {
    return {
      query: {
        ...params,
      },
    };
  }, [params]);
}

export default function RecipePage () {
  const router = useRouter();
  const history = useHistory();
  const recipeId = router.query.recipeId;
  const [loading, setLoading] = useState('false');
  
  //add alan AI voice button
  useEffect(() => {
    alanBtn({
        key: 'e79e130adafddcf118c1959c29dc62f32e956eca572e1d8b807a3e2338fdd0dc/stage',
        onCommand: (commandData) => {
            if (commandData.command === 'go:back') {
                    // Call the client code that will react to the received command
                }
            }
    });
  }, []);
  
  //set recommendationrecipes
  const [recommendationrecipes, setrecommendationrecipes] = useState({
    1:{'id':1,'updateTime':'07 June','thumbnail':'','name':'title1','description':'apple','userId':1},
    2:{'id':2,'updateTime':'07 June','thumbnail':'','name':'title2','description':'banana','userId':2},
    3:{'id':3,'updateTime':'07 June','thumbnail':'','name':'title3','description':'camre','userId':3},
    4:{'id':4,'updateTime':'07 June','thumbnail':'','name':'title4','description':'grape','userId':4},
    5:{'id':5,'updateTime':'07 June','thumbnail':'','name':'title5','description':'juice','userId':5}});
    

  // Variables
  const [recipeName, setRecipeName] = useState('');
  const [description, setDescription] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [createTime, setCreateTime] = useState();
  const [mealType, setMealType] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [methods, setMethods] = useState({});
  const [image, setImage] = useState('');
  const [authorId, setAuthorId] = useState();
  const [notes, setNotes] = useState('');
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState('');
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  const [commentPage, setCommentPage] = useState(0);
  const [recommendations, setRecommendations] = useState('');
  const commentSize= 20;

  // Input references
  const commentInput = useRef();
    

  useEffect(() => {
    // fetch recipe data
    getRecipe();
    getComments();
  }, []);

  const reformatDate = (strdate) => {
    let day = null;
    let month = null;
    let year = null;

    if (strdate === "Just now") {
      return "Just";
    }

    const date = strdate.split(" ")[0]
    month = date.split("-")[1];
    day = date.split("-")[0];
    year = date.split("-")[2];

    return (day + "-" + month + "-" + year);
  }

  //get recommendations
  const getRecommendation = async () => {
    const settings = {
      method: 'GET',
      headers: {
        Authorization: cookies.token,
        Accept: 'application/json',
      }
    };
    try {
      const response = await fetch(HostUrl('/recipe/recommendation/' + recipeId), settings);
      const data = await response.json();
      if (data.length === 0) {
        return;
      } else {
        console.log(data);
        setRecommendations(data);
        console.log("Get data"); 
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getRecipe = async () => {
    const settings = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
   
    try {
      setLoading(true);
      const response = await fetch(HostUrl('/recipe/'+ recipeId), settings);
      const data = await response.json();
      setRecipeName(data.name);
      setDescription(data.description);
      setAuthorName(data.fullName);
      setCreateTime(reformatDate(data.createTime));
      setMealType(data.mealType);
      setIngredients(data.ingredients);
      setMethods(data.methods);
      if (data.image === null) {
        setImage('default_picture.png');
      } else {
        setImage(data.image);
      }
      setAuthorId(data.userId);
      setNotes(data.notes);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  const toUserPage = () => {
    history.push('/user/' + authorId);
  }

  const getComments = async () => {
    const settings = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    }
    try {
      setLoading(true);
      const response = await fetch(HostUrl('/comment/recipe/' + recipeId  + '?page=' + commentPage + '&size=' + commentSize), settings);
      const data = await response.json();
      setLoading(false);
      setComments(data.content);
    } catch (err) {
      console.error(err);
    }
  }

  const handlePostComment = async () => {
    const settings = {
      method: 'POST',
      headers: {
        Authorization: cookies.token,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "content": commentText,
        "replyTo": 0,
      }),
    };

    setCommentText('');
    try {
      const response = await fetch(HostUrl('/user/comment/' + recipeId), settings);
      if (response.ok) {
        const getCommentConfig = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        }
        const commentIdResponse = await fetch(HostUrl('/comment/recipe/' + recipeId  + '?page=0&size=1'), getCommentConfig);
        const commentId = await commentIdResponse.json();
        const postedComments = {
          content: commentText,
          createTime: "Just now",
          username: cookies.username,
          id: commentId.content[0].id
        }
        const oldComments = [...comments];
        oldComments.unshift(postedComments);
        setComments(oldComments);
        console.log(oldComments);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const handleDeleteComment = (id) => {
    // handle delete comment here
    console.log(id);
    const newComments = [];
    for (let i=0; i < comments.length; i++) {
      if (comments[i].id !== id) {
        newComments.push(comments[i]);
      }
    }
    setComments(newComments);
  }
  
  useEffect(() => {
    console.log("get recommendation");
    getRecommendation();
  }, []);

  return (
    <>
      {loading
      ? (<LoadingScreen loading={loading} />)
      : <>
      <Header rightLink={<BackButton />}/>
      <div id="recipe-parallax"
        style={{
          width: "100%",
          minHeight: "calc(100vh - 200px)",
          backgroundImage: "url(\"" + HostUrl('/'+ image) +"\")",
          backgroundAttachment: "fixed",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      />
      <div id="main-container">
        <div id="content-container">
          <h1>{recipeName}</h1>
          <div id="description-container">
            <h4>{`"${description}"`}</h4>
          </div>
          <div id="author-container" onClick={toUserPage}>
            <Avatar
              id="avatar-icon"
              alt={authorName.charAt(0)}
              src="/broken-image.jpg"
            />
            <div id="author-content">
              <h4>{authorName}</h4>
              <p>{`Created on ${createTime}`}</p>
            </div>
          </div>
          <div id="meal-type-container">
            <h3>Meal Type</h3>
            <Button
              className="meal-type"
              variant="outlined"
              // color="primary"
            >
              {mealType}
            </Button>
          </div>
          <div id="ingredient-content">
            <h2>Ingredients</h2>
            <div id="ingredient-material">
              {ingredients.map((val, idx) => {
                return (
                  <FormControlLabel
                    key={idx}
                    control={<Checkbox color="primary"/>}
                    label={`${val.quantity} ${val.uom} of ${val.name}`} //"4 units of lemon"
                  />
                );
              })}
            </div>
          </div>
          <div id="method-content">
            <h2>How to make this dish?</h2>
            {Object.entries(methods).map(([key, val]) => {
              return (
                <div className="method-step" key={key}>
                  <div className="step-decription">
                    <div className="step-title-container">
                      <Checkbox className="step-checkbox" color="primary" />
                      <h3>{`Step ${key}`}</h3>
                    </div>
                    <p>{val}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {notes !== ""
            ? <div id="notes-content">
              <h2>Side Notes</h2>
              <div id="notes-description">
                <p>{notes}</p>
              </div>
            </div>: ''
          }
          
          <RecommendationContainer
            recommendationrecipes={recommendations}
          />

          <div id="comment-container">
            <h2>Comments</h2>
            {comments.length === 0 ?
              <div>
                <p>No Comments Yet</p>
              </div>
            : Object.entries(comments).map(([key, val]) => {
              return (
                <CommentCard
                  key={key}
                  id={val.id}
                  deleteComment = {handleDeleteComment}
                  author={val.username}
                  message={val.content}
                  createTime={reformatDate(val.createTime) + " " + val.createTime.split(" ")[1]}
                />
              );
            })}
           
            <div id="post-comment-container">
              <Grid container alignItems="center">
                <Grid item xs={10}>
                  <TextField
                    className="comment-input"
                    variant="outlined"
                    margin="none"
                    id="comment"
                    placeholder="Post a comment"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                </Grid>
                <Grid item xs={2} style={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    className="post-button"
                    variant="contained"
                    color="primary"
                    endIcon={<SendIcon />}
                    onClick={handlePostComment}
                  >
                    Post
                  </Button>
                </Grid>
              </Grid>
            </div>
          </div>
        </div>
      </div>
      </>
    }
    </>
  );
}