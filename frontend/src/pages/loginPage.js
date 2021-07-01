import React, {useState, useRef} from 'react';
import {Link} from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import HostUrl from 'config';

// Components
import SimpleDialog from 'components/Dialog/simpleDialog';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import LoadingScreen from 'components/Loader/loadingScreen';

// Logo
import logo from 'assets/img/logo.svg';

// Styles
import { makeStyles } from '@material-ui/core/styles';
import styles from 'styles/pages/loginPageStyles';
const useStyles = makeStyles(styles);

export default function LoginPage () {
  let history = useHistory();
  const classes = useStyles();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [cookies, setCookie, removeCookie] = useCookies(['token']);

  // Input references
  const usernameRef = useRef();
  const passwordRef = useRef();

  // Error dialog variables
  const [errorMessage, setErrorMessage] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      const inputOK = validateInputs();
      if (inputOK) {
        submitForm();
      }
    }
  }

  const submitForm = async () => {
    const settings = {
      method: 'POST',
      body: JSON.stringify({
          "username": username,
          "password": password,
        }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }
    setLoading(true);
    try {
      const response = await fetch(HostUrl('/login'), settings);
      setLoading(false);
      if (response.status === 200) {
        const data = await response.json();
        setCookie('token', data.token, { path: '/' });
        setCookie('username', username, { path: '/' });
        history.push('/dashboard');
      } else if (response.status === 403) {
        setError(true);
        setErrorMessage('Incorrect username or password. Please try again');
        usernameRef.current.focus();
      } else if (response.status === 500) {
        setError(true);
        setErrorMessage('Server is unreachable. Please try again later');
      }
      // Catch error
    } catch (err) {
      setLoading(false);
      setError(true);
      setErrorMessage('Could not connect to the server');
      console.error(err);
      throw err;
    }
  };

  const validateInputs = () => {
    if (username === '') {
      setError(true);
      setErrorMessage('Username cannot be empty.');
      usernameRef.current.focus()
      return false;
    } else if (password === '') {
      setError(true);
      setErrorMessage('Password cannot be empty.');
      passwordRef.current.focus();
      return false;
    }
    return true;
  }

  const handleClick = () => {
    const inputOk = validateInputs();
    if (inputOk) {
      // placeholder for POST
      submitForm();
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <div className={classes.logo}>
          <img className={classes.img} src={logo} alt="logo" />
        </div>
        <br />
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            label="Username"
            margin="normal"
            required
            fullWidth
            id="username"
            onChange={(e) => setUsername(e.target.value)}
            inputRef={usernameRef}
            onKeyPress={(e) => handleKeyPress(e)}
            autoFocus
          />
          <TextField
            variant="outlined"
            label="Password"
            margin="normal"
            required
            fullWidth
            id="password"
            name="password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            inputRef={passwordRef}
            onKeyPress={(e) => handleKeyPress(e)}
          />
          <Button
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleClick}
            fullWidth
          >
            Login
          </Button>
        </form>
        <div>
          <p>Don't have an account? Please sign up <Link className={classes.link} to="/signup">here</Link></p>
        </div>
        {error ? <SimpleDialog message={errorMessage} setError={setError} open={error}/> : ''}
        <LoadingScreen loading={loading} />
      </div>
    </Container>
  );
}