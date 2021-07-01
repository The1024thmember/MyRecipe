import React from 'react';
import 'styles/components/MethodcontainerStyle.css';
import { IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';

export function MethodcontainerTotal ({mymethods,setmymethods}) {
  const [mycontainers, setmycontainers] = React.useState(Object.keys(mymethods));
  if (mycontainers.length>=2) {
	  return (
			<>
				<fieldset className="method_container_total">
					<legend className="method_title">Methods *</legend>
					<MethodcontainerSingle 
						myvalue={mycontainers[0]}//mycontainers[index]
						index={0}//index in mycontainers
						mycontainers={mycontainers}
						setmycontainers={setmycontainers}
						mymethods={mymethods}
						setmymethods={setmymethods}
						deletebutton={false}
					/>
					{mycontainers.slice(1,mycontainers.length).map((value,index) => {
            return <>
              <MethodcontainerSingle 
                key={index}
                myvalue={value}//mycontainers[index]
                index={index+1}//index in mycontainers
                mycontainers={mycontainers}
                setmycontainers={setmycontainers}
                mymethods={mymethods}
                setmymethods={setmymethods}
                deletebutton={true}
              />
            </>
					})}
				</fieldset>
			</>
	  );
  } else {  
	  return (
		<div>
			<fieldset className="method_container_total">
				<legend className="method_title">Methods *</legend>
          <MethodcontainerSingle 
            myvalue={mycontainers[0]} // mycontainers[index]
            index={0} // index in mycontainers
            mycontainers={mycontainers}
            setmycontainers={setmycontainers}
            mymethods={mymethods}
            setmymethods={setmymethods}
            deletebutton={false}
          />
			</fieldset>
		</div>
	  );
  }
}

export function MethodcontainerSingle ({index,myvalue,mycontainers,setmycontainers,mymethods,setmymethods,deletebutton}) {
  // const handleChangetitle = (event) => {
	// 	const temp = JSON.stringify(mymethods);
	// 	const newmymethods = JSON.parse(temp);
	// 	newmymethods[myvalue].title=event.target.value;
	// 	setmymethods(newmymethods);
  // };

  const handleChangedescription = (event) => {
		const temp = JSON.stringify(mymethods);
		const newmymethods = JSON.parse(temp);
		newmymethods[myvalue].description=event.target.value;
		setmymethods(newmymethods);
  };

	const handleAdd = () => {
		const temp = JSON.stringify(mymethods);
		const newmymethods = JSON.parse(temp);
		const newmycontainers = [...mycontainers];
		const newmethodformula = {'description':''};
		const nextIndex = Math.max(...newmycontainers)+1;
		newmycontainers.push(nextIndex);
		setmycontainers(newmycontainers);
		newmymethods[nextIndex] = newmethodformula;
		setmymethods(newmymethods);
	}
	const handleDelete = () => {
		const temp = JSON.stringify(mymethods);
		const newmymethods = JSON.parse(temp);
		const newmycontainers = [...mycontainers];
		delete newmymethods[myvalue]; //delete is correct, but on the screen may not rendering
		setmymethods(newmymethods);
		newmycontainers.splice(index, 1);
		setmycontainers(newmycontainers);
	}

  return (
	<div className="method_container_single"> 
		<div className='text_area'>
		  <h2 className="step-title">{`Step ${index+1}`}</h2>
		  <TextField className="method_description"
			  id="standard-multiline-flexible"
			  label={mymethods[myvalue].description? "" : "Description:"}
				variant="outlined"
			  multiline
				margin="normal"
			  rows={7}
        value={mymethods[myvalue].description}
			  onChange={handleChangedescription}
		  />
		</div>
		<div className="method_buttons">
			{deletebutton &&
				<IconButton 
					aria-label="delete"
					onClick={handleDelete}
				>
				  <DeleteIcon />
				</IconButton>
			}
			<IconButton
				onClick={handleAdd}
			>
				<AddIcon />
			</IconButton>	
		</div>
	</div>
  );
}


