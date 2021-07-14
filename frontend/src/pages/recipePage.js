import React, { useState, useEffect, useMemo } from 'react';
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
  useEffect(() => {
    // fetch recipe data
    getRecipe();
  }, []);

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
      setCreateTime(data.createTime.split(" ")[0]);
      setMealType(data.mealType);
      setIngredients(data.ingredients);
      setMethods(data.methods);
      if (data.image === null) {
        setImage('default_picture.png');
      } else {
        setImage(data.image);
      }
      setAuthorId(data.authorId);
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

  console.log("url(" + HostUrl('/'+ image) +"\")");

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
            </div> : ''
          }
          
          {/* <RecommendationContainer
            recommendationrecipes={recommendationrecipes}
          /> */}
          <div id="comment-container">
            <h2>Comments</h2>
            <CommentCard author="Sophia Zhang" message="This is a very nice dish!" />
            <CommentCard author="Haolun Yu" message="I hope I can create a legendary recipe like this." />
            <CommentCard author="Kevin Kadino" message="What a chef!" />
            
            <div id="post-comment-container">
              <Grid container alignItems="center">
                <Grid item xs={10}>
                  <TextField
                    className="comment-input"
                    variant="outlined"
                    margin="none"
                    id="comment"
                    placeholder="Post a comment"
                    // onChange={(e) => setUsername(e.target.value)}
                  />
                </Grid>
                <Grid item xs={2} style={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    className="post-button"
                    variant="contained"
                    color="primary"
                    endIcon={<SendIcon />}
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