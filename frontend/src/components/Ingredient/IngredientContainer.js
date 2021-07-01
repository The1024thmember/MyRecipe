import React from 'react';
import { Grid } from '@material-ui/core';
import 'styles/components/IngredientContainerStyle.css';
import { IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

const measures = [
  {
    value: 'ml',
    label: 'ml',
  },
  {
    value: 'litres',
    label: 'litres',
  },
	{
    value: 'grams',
    label: 'grams',
  },
	{
    value: 'ounce',
    label: 'ounce',
  },
  {
    value: 'killograms',
    label: 'killograms',
  },
  {
    value: 'cups',
    label: 'cups',
  },
	{
    value: 'teaspoons',
    label: 'teaspoons',
  },
	{
    value: 'tablespoons',
    label: 'tablespoons',
  },
	{
    value: 'units',
    label: 'units',
  },
];

export function IngredientcontainerTotal ({myingredients,setmyingredients, morethanoneingredient, setmorethanoneingredient}) {
  const [mycontainers, setmycontainers] = React.useState([Object.keys(myingredients)]);
  if (mycontainers.length >=2) {
	  return (
			<div className="mycontainer">
				<fieldset className="ingredient_container_total">
				<legend className="indgredient_title">Ingredients *</legend>
				<Ingredientcontainersingle 
					myvalue={mycontainers[0]} //mycontainers[index]
					index={0} //index in mycontainers
					mycontainers={mycontainers}
					setmycontainers={setmycontainers}
					myingredients={myingredients}
					setmyingredients={setmyingredients}
					deletebutton={false}
				/>
				{mycontainers.slice(1,mycontainers.length).map((value,index) => (
					<Ingredientcontainersingle 
						key={index}
						myvalue={value} //mycontainers[index]
						index={index+1} //index in mycontainers
						mycontainers={mycontainers}
						setmycontainers={setmycontainers}
						myingredients={myingredients}
						setmyingredients={setmyingredients}
						deletebutton={true}
					/>
				))}
				</fieldset>
			</div>
	  );
  } else {
		return (
			<div className="mycontainer">
				<fieldset className="ingredient_container_total">
				<legend className="indgredient_title">Ingredients *</legend>
				<Ingredientcontainersingle 
					myvalue={mycontainers[0]} //mycontainers[index]
					index={0} //index in mycontainers
					mycontainers={mycontainers}
					setmycontainers={setmycontainers}
					myingredients={myingredients}
					setmyingredients={setmyingredients}
					deletebutton={false}
				/>	
				</fieldset>
			</div>		
		);
  }
}

export function Ingredientcontainersingle ({index,myvalue,mycontainers,setmycontainers,myingredients,setmyingredients,deletebutton}) {
  const handleChangeName = (event) => {
		const temp = JSON.stringify(myingredients);
		const newmyingredients = JSON.parse(temp);
		newmyingredients[myvalue].name=event.target.value;
		setmyingredients(newmyingredients);
		//	console.log("Names:");
		//	console.log(newmyingredients);
  };

  const handleChangeQty = (event) => {
		const temp = JSON.stringify(myingredients);
		const newmyingredients = JSON.parse(temp);
		newmyingredients[myvalue].qty=event.target.value;
		setmyingredients(newmyingredients);
		//	console.log("Qtys:");
		//	console.log(newmyingredients);
  };

  const handleChangeMeasure = (event) => {
		const temp = JSON.stringify(myingredients);
		const newmyingredients = JSON.parse(temp);
		newmyingredients[myvalue].measure=event.target.value;
		setmyingredients(newmyingredients);
		//	console.log("Measures:");
		//	console.log(newmyingredients);
  };

	const handleAdd = () => {
		const temp = JSON.stringify(myingredients);
		const newmyingredients = JSON.parse(temp);
		const newmycontainers = [...mycontainers];
		//console.log('newmycontainers');
		//console.log(newmycontainers);
		const newingredientformula = {'name':'','qty':'','measure':''};
		const nextIndex = Math.max(...newmycontainers)+1;
		//console.log('nextIndex');
		//console.log(nextIndex);
		newmycontainers.push(nextIndex);
		setmycontainers(newmycontainers);
		//console.log('newmycontainers after add:');
		//console.log(newmycontainers);
		newmyingredients[nextIndex] = newingredientformula;
		setmyingredients(newmyingredients);
		//console.log('newmyingredients after add:');
		//console.log(newmyingredients);
	};

	const handleDelete = () => {
		const temp = JSON.stringify(myingredients);
		const newmyingredients = JSON.parse(temp);
		const newmycontainers = [...mycontainers];
		newmycontainers.splice(index,1);
		setmycontainers(newmycontainers);
		delete newmyingredients[myvalue]; 
		//console.log('newmyingredients after delete:');
		//console.log(newmyingredients);
		setmyingredients(newmyingredients);
		//console.log(newmycontainers);
	};

  return (
		<div className="ingredient_container_single">
			<Grid container spacing={1} className="ingredient_grid">
				<Grid item xs={4}>
					<TextField className="ingredient_name_box"
					variant="outlined"
					label="Name"
					value={myingredients[myvalue].name}
					onChange={handleChangeName}
					/>
				</Grid>
				<Grid item xs={3} >
					<TextField className="ingredient_qty"
					variant="outlined"
					label="Quantity"
					value={myingredients[myvalue].qty}
					onChange={handleChangeQty}
					/>
				</Grid>
				<Grid item xs={3}>
					<TextField className="ingredient_measure"
					variant="outlined"
					select
					label="Measures"
					value={myingredients[myvalue].measure}
					onChange={handleChangeMeasure}
					>	
					{measures.map((option) => (
						<MenuItem key={option.value} value={option.value}>
							{option.label}
						</MenuItem>
					))}
					</TextField>
				</Grid>
				<Grid item xs={2}>
					<div className="ingredient_buttons">
						{ deletebutton &&
							<IconButton aria-label="delete" className='deletebutton' onClick={handleDelete}>
								<DeleteIcon />
							</IconButton>
						}
						<IconButton onClick={handleAdd}>
							<AddIcon className='addbutton'/>
						</IconButton>	
					</div>
				</Grid>
			</Grid>
		</div>
  );
}


