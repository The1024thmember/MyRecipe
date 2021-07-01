import { RecipeReviewCard }  from 'components/RecipeCard/recipeCard.js';
import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop:'30px',
  },
  paper: {
    paddingLeft:'50px',
    color: 'rgb(226,226,226)',
    margin:'auto',
  },
  arrow: {
    textAlign:'center',
    margin:'auto',
  },
  arrowIcon: {
    fontSize:'40px',
  },
  title: {
    color:'rgb(226,141,118)',
    fontWeight:'bold',  
    fontSize:'h2',
  }
}));

function MyArrowleft({onClick}) {
  const classes = useStyles();
  return <>
    <IconButton onClick={onClick} >
      <ArrowBackIcon className={classes.arrowIcon}/>
    </IconButton>
  </>
}

function MyArrowright({onClick }) {
  const classes = useStyles();
  return <>
    <IconButton onClick={onClick}>
      <ArrowForwardIcon className={classes.arrowIcon}/>
    </IconButton>
  </>
}

export default function RecommendationContainer ({recommendationrecipes}) { 
  const classes = useStyles();
  const [start,setstart] = React.useState(0);
  const arrowleftclick=()=>{
    if(0<start&&start<=2){
      setstart(start-1);
      }
  }
  const arrowrightclick=()=>{
    if(0<=start&&start<2){
      setstart(start+1)
    }
  }
  return (
		<div className={classes.root}>
        <legend className={classes.title}><h2>Recommendations</h2></legend>
        <Grid container>
          <Grid item xs={1} className={classes.arrow}>
            <MyArrowleft 
              onClick={arrowleftclick}
            /> 
          </Grid>
          <Grid item xs={10} >
            <div className={classes.paper}>
              {Object.keys(recommendationrecipes).slice(start,start+3).map((key,index)=>{
                  return (
                  <div className='singlerecipe'
                    key={key}
                  > 
                    <RecipeReviewCard
                      id={recommendationrecipes[key]['id']}
                      author={JSON.stringify(recommendationrecipes[key]['userId'])}
                      postdate={recommendationrecipes[key]['updateTime']} // change it to real value, depends on the structure of myrecipe
                      thumbnail={recommendationrecipes[key]['thumbnail']} // change it to real value, depends on the structure of myrecipe
                      title={recommendationrecipes[key]['name']} //replace this with value read from database
                      description={recommendationrecipes[key]['description']}
                      numberoflikes={150}
                      numberofcomments={38}
                      isprivate={false}
                    /> 
                  </div>	
                  )
              })}            
            </div>
          </Grid>
          <Grid item xs={1} className={classes.arrow}>  
            <MyArrowright 
              onClick={arrowrightclick}
            />
          </Grid>
        </Grid>
		</div>
    )
}