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
import { MethodcontainerTotal } from 'components/Method/UpdateMethodcontainer';
import { IngredientcontainerTotal } from 'components/Ingredient/UpdateIngredientContainer';
import WarningDialog from 'components/Dialog/warningDialog';
import BackButton from 'components/BackButton/backButton';
import UplaodImageFile from 'components/UploadImage/uploadImageFile';
import LoadingScreen from 'components/Loader/loadingScreen';
import { useParams } from 'react-router-dom';

// Styles
import styles from 'styles/pages/postRecipePageStyles';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(styles);

export function useRouter() {
  const params = useParams();
  return React.useMemo(() => {
    return {
      query: {
        ...params,
      },
    };
  }, [params]);
}

export default function UpdateRecipePage () {
  const router = useRouter();
  const recipeId = router.query.recipeId;
  // Router and cookies
  const classes = useStyles();
  const history = useHistory();
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  
  // Data variables
  const [recipeName, setRecipeName] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [mealType, setMealType] = useState('');
  const [methods, setMethods] = useState({});
  const [ingredients, setIngredients] = useState([]);
  const [image, setImage] = useState(undefined);
  const [existingImage, setExistingImage] = useState('');
  // Error handler variables
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [warningFeedback, setWarningFeedback] = useState('');
  const [requestType, setRequestType] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

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
      setMealType(data.mealType);
      setIngredients(data.ingredients);
      setMethods(data.methods);
      setNotes(data.notes);
      setExistingImage(data.image);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
    const updateData = async () => {
      const ingredients_temp = [];
      Object.keys(ingredients).forEach((key, index) => {
        let obj = {
          "name": ingredients[key].name.toLowerCase(),
          "quantity": ingredients[key].quantity,
          "uom": ingredients[key].uom,
        }
        ingredients_temp.push(obj);
      });

      const methods_temp = {};
      Object.keys(methods).forEach((key, index) => {
        methods_temp[key] = methods[key];
      });
      setLoading(true);

      console.log(existingImage)
      console.log(image);

      try {
        if (existingImage !== null && image === undefined) {
          const settings = {
            method: 'PUT',
            body: JSON.stringify({
              "id": recipeId,
              "image": existingImage,
              "description": description,
              "ingredients": ingredients_temp,
              "methods": methods_temp,
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
        } else if (existingImage === null && image === undefined) {
          const settings = {
            method: 'PUT',
            body: JSON.stringify({
              "id": recipeId,
              "image": null,
              "description": description,
              "ingredients": ingredients_temp,
              "methods": methods_temp,
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
        } else {
          const formData = new FormData();
          formData.append('image', image);
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
              method: 'PUT',
              body: JSON.stringify({
                "id": recipeId,
                "image": hashImg.image,
                "description": description,
                "ingredients": ingredients_temp,
                "methods": methods_temp,
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
        const qtyPattern = new RegExp(/^[+]?\d+(\.\d+)?$/);
        Object.keys(methods).forEach((key, index) => {
          if (methods[key].description === '') {
            setError(true);
            setErrorMessage("Empty fields in methods are not allowed");
            setWarningFeedback('');
            retVal = false;
          }
        });

        Object.keys(ingredients).forEach((key, index) => {
          if (ingredients[key].name === '' || ingredients[key].quantity === '' || ingredients[key].uom === '') {
            setError(true);
            setErrorMessage("Empty fields in ingredients are not allowed");
            setWarningFeedback('');
            retVal = false;
          }
          
          if (!qtyPattern.test(ingredients[key].quantity) && ingredients[key].quantity != '') {
            setError(true);
            setErrorMessage("Ingredient quantity must be a numerical value");
            setWarningFeedback('');
            retVal = false;
          }

          if (qtyPattern.test(ingredients[key].name)) {
            setError(true);
            setErrorMessage("Ingredient name must be a string");
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
        if (inputOk) updateData();
      }
      if (requestType === 'cancel') {
        console.log('Back to dashboard');
        history.goBack();
      }
    }
  }, [warningFeedback, requestType]);
  
  React.useEffect(()=>{
    getRecipe();
  },[])

  const  handleSubmit = () => {
    setShowWarning(true);
    setWarningMessage("Are you sure you want to update your recipe?");
    setRequestType('submit');
  };

  const handleCancel = () => {
    setShowWarning(true);
    setWarningMessage("Are you sure you want to cancel updating your recipe post? Your updates will not be saved.");
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
          <h1>Update recipe: {recipeName}</h1>
        </div>
        <div className={classes.parentContainer}>
          <div className={classes.leftContainer}>
            <UplaodImageFile
              picture={image}
              setPicture={setImage}
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
              value={recipeName}
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <TextField
              variant="outlined"
              placeholder="You can put some side notes to your recipe here"
              label="Notes"
              margin="normal"
              fullWidth
              id="notes"
              value={notes}
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
              myingredients={ingredients}
              setmyingredients={setIngredients}
		      	/>
          </div>
          <div className={classes.rightContainer}>
            <MethodcontainerTotal 
              mymethods={methods}
              setmymethods={setMethods}				  
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