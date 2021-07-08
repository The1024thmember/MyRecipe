import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router-dom';
import HostUrl from 'config';

// Components
import SimpleDialog from 'components/Dialog/simpleDialog';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Header from 'components/Header/header';
import FormHelperText from '@material-ui/core/FormHelperText';
import { MethodcontainerTotal } from 'components/Method/Methodcontainer';
import { IngredientcontainerTotal } from 'components/Ingredient/IngredientContainer';
import WarningDialog from 'components/Dialog/warningDialog';
import BackButton from 'components/BackButton/backButton';
import UplaodImageFile from 'components/UploadImage/uploadImageFile';
import LoadingScreen from 'components/Loader/loadingScreen';

// Styles
import styles from 'styles/pages/postRecipePageStyles';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(styles);

export default function PostRecipePage () {
  // Router and cookies
  const classes = useStyles();
  const history = useHistory();
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  
  // Data variables
  const [recipeName, setRecipeName] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [mealType, setMealType] = useState('');
  const [picture, setPicture]= useState(undefined);
  const [existingImage, setExistingImage] = useState(null);
  // const [thumbnail, setThumbnail] = useState();
  const [mymethods, setmymethods] = React.useState({1:{'description':''}});
  const [myingredients, setmyingredients] = React.useState({1:{'name':'','qty':'','measure':''}}); //stores ingredient data, ready for backend

  // Error handler variables
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [warningFeedback, setWarningFeedback] = useState('');
  const [requestType, setRequestType] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

  useEffect(() => {
    const postData = async () => {
      const ingredients = [];
      Object.keys(myingredients).forEach((key, index) => {
        let obj = {
          "name": myingredients[key].name.toLowerCase(),
          "quantity": myingredients[key].qty,
          "uom": myingredients[key].measure,
        }
        ingredients.push(obj);
      });

      const methods = {};
      Object.keys(mymethods).forEach((key, index) => {
        methods[key] = mymethods[key].description;
      });
      setLoading(true);
      try {
        if (picture !== undefined) {
          const formData = new FormData();
          formData.append('image', picture);
          const imgConfig = {
            method: 'POST',
            body: formData,
            headers: {
              'Authorization': cookies.token,
            }
          }
          const imgResponse = await fetch(HostUrl('/user/recipe/image'), imgConfig);
          if (imgResponse.status === 200) {
            const hashImg = await imgResponse.json();
            const settings = {
              method: 'POST',
              body: JSON.stringify({
                "image": hashImg.image,
                // "thumbnail": thumbnail,
                "description": description,
                "ingredients": ingredients,
                "methods": methods,
                "name": recipeName,
                "mealType": mealType,
                "notes": notes
              }),
              headers: {
                'Authorization': cookies.token,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              }
            }
            const response = await fetch(HostUrl('/user/recipe'), settings);
            setLoading(false);
            if (response.status === 200) {
              history.goBack();
            }
          } else if (imgResponse.status === 500) {
            setError(true);
            setErrorMessage('Image file too large!');
            setLoading(false);
          } else {
            throw 'Error: Image upload failed';
          }
        } else {
          const settings = {
            method: 'POST',
            body: JSON.stringify({
              "image": null,
              "description": description,
              "ingredients": ingredients,
              "methods": methods,
              "name": recipeName,
              "mealType": mealType,
              "notes": notes
            }),
            headers: {
              'Authorization': cookies.token,
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            }
          }
          const response = await fetch(HostUrl('/user/recipe'), settings);
          setLoading(false);
          if (response.status === 200) {
            history.goBack();
          }
        }
        
      } catch (err) {
        setLoading(false);
        setError(true);
        setErrorMessage('Could not connect to the server');
        setWarningFeedback('');
        console.error(err);
      }
    };

    const validateInputs = () => {
      let retVal = true;
      if (recipeName === '') {
        setError(true);
        setErrorMessage("Recipe name cannot be empty");
        setWarningFeedback('');
        retVal = false;
      } else if (description === '') {
        setError(true);
        setErrorMessage("Description cannot be empty");
        setWarningFeedback('');
        retVal = false;
      } else if (mealType === '') {
        setError(true);
        setErrorMessage("Meal type cannot be empty");
        setWarningFeedback('');
        retVal = false;
      } else {
        Object.keys(myingredients).forEach((key, index) => {
          if (myingredients[key].name === '' || myingredients[key].qty === '' || myingredients[key].measure === '') {
            setError(true);
            setErrorMessage("Empty fields in ingredients are not allowed");
            setWarningFeedback('');
            retVal = false;
          }
        });
  
        Object.keys(mymethods).forEach((key, index) => {
          if (mymethods[key].description === '') {
            setError(true);
            setErrorMessage("Empty fields in methods are not allowed");
            setWarningFeedback('');
            retVal = false;
          }
        });
      }
      return retVal;
    };
    if (warningFeedback === 'no') {
      setWarningFeedback('');   // reset warning feedback
    } else if (warningFeedback === 'yes') {
      if (requestType === 'submit') {
        const inputOk = validateInputs();
        if (inputOk) postData();
      }
      if (requestType === 'cancel') {
        console.log('Back to dashboard');
        history.goBack();
      }
    }
  }, [warningFeedback, requestType]);

  const  handleSubmit = () => {
    setShowWarning(true);
    setWarningMessage("Are you sure you want to submit your recipe?");
    setRequestType('submit');
  };

  const handleCancel = () => {
    setShowWarning(true);
    setWarningMessage("Are you sure you want to cancel your recipe post? Your entries will not be saved.");
    setRequestType('cancel');
  }

  const handleMealTypeChange = (event) => {
    setMealType(event.target.value);
  };

  return (
    <>
      <Header rightLink={<BackButton />} />
      <div className={classes.container}>
        <div className={classes.titleContainer}>
          <h1>Post Your Awesome Recipe</h1>
        </div>
        <div className={classes.parentContainer}>
          <div className={classes.leftContainer}>
            <UplaodImageFile
              picture={picture}
              setPicture={setPicture}
              existingImage={existingImage}
              setExistingImage={setExistingImage}
            />
            <TextField
              variant="outlined"
              label="Recipe Name"
              margin="normal"
              required
              fullWidth
              id="username"
              onChange={(e) => setRecipeName(e.target.value)}
            />
             <TextField
              variant="outlined"
              label="Description"
              margin="normal"
              required
              multiline
              rows={3}
              fullWidth
              id="description"
              onChange={(e) => setDescription(e.target.value)}
            />
            <TextField
              variant="outlined"
              placeholder="You can put some side notes to your recipe here"
              label="Notes"
              margin="normal"
              fullWidth
              id="notes"
              onChange={(e) => setNotes(e.target.value)}
            />
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="meal-type-outlined-label">Meal Type *</InputLabel>
              <Select
                labelId="meal-type-label"
                id="meal-type"
                value={mealType}
                onChange={handleMealTypeChange}
                label="Meal Type"
              >
                <MenuItem value={"Breakfast"}>Breakfast</MenuItem>
                <MenuItem value={"Lunch"}>Lunch</MenuItem>
                <MenuItem value={"Brunch"}>Brunch</MenuItem>
                <MenuItem value={"Dinner"}>Dinner</MenuItem>
                <MenuItem value={"Dessert"}>Dessert</MenuItem>
                <MenuItem value={"Beverage"}>Beverage</MenuItem>
              </Select>
              <FormHelperText>Required</FormHelperText>
            </FormControl>
            <IngredientcontainerTotal 
              myingredients={myingredients}
              setmyingredients={setmyingredients}
		      	/>
          </div>
          <div className={classes.rightContainer}>
            <MethodcontainerTotal 
              mymethods={mymethods}
              setmymethods={setmymethods}				  
            />
          </div>
        </div>
      </div>
      <div className={classes.buttonContainer}>
        <div className={classes.subButtonContainer}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
          <Button variant="contained" color="secondary" onClick={handleCancel}>Cancel</Button>
        </div>
      </div>
      {showWarning ? 
        <WarningDialog
          message={warningMessage}
          setWarning={setShowWarning}
          setWarningFeedback={setWarningFeedback}
          open={showWarning}
        /> : ''}
      {error ? <SimpleDialog message={errorMessage} setError={setError} open={error}/> : ''}
      <LoadingScreen loading={loading} />
    </>
  )
}