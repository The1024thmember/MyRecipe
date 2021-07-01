import React, { useState, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
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

export default function SignupPage () {
  const classes = useStyles();
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Input references
  const usernameRef = useRef();
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const rePasswordRef = useRef();

  // Email pattern test
  const pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);

  // Error dialog variables
  const [errorMessage, setErrorMessage] = useState('');
  const [error, setError] = useState(false);

  let history = useHistory();
  const [cookies, setCookie, removeCookie] = useCookies(['token']);

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
          "fullName": name,
          "password": password,
          "email": email,
        }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }
    setLoading(true);
    try {
      const response = await fetch(HostUrl('/register'), settings);
      setLoading(false);
      if (response.status === 200) {
        const data = await response.json();
        setCookie('token', data.token, {path: '/'});
        setCookie('username', username, { path: '/'});
        history.push('/dashboard');
      } else if (response.status === 403) {
        setError(true);
        setErrorMessage('Username have been taken. Please try another username');
        usernameRef.current.focus();
      } else if (response.status === 500) {
        setError(true);
        setErrorMessage('Server is unreachable. Please try again later');
      }
    // Catch error when server is not available
    } catch (err) {
      setLoading(false);
      setError(true);
      setErrorMessage('Could not connect to the server');
      console.error(err);
      throw err;
    }
  };

  const validateInputs = () => {
    /* Validate the input before sending data to backend */
    if (username === '') {
      setError(true);
      setErrorMessage('Username cannot be empty.');
      usernameRef.current.focus();
      return false;
    } else if (name === '') {
      setError(true);
      setErrorMessage('Name cannot be empty.');
      nameRef.current.focus();
      return false;
    } else if (email === '') {
      setError(true);
      setErrorMessage('E-mail cannot be empty.');
      emailRef.current.focus();
      return false;
    } else if (email !== '' && !pattern.test(email)) {
      setError(true);
      setErrorMessage('Please enter valid email address');
      emailRef.current.focus();
      return false;
    } else if (password === '') {
      setError(true);
      setErrorMessage('Password cannot be empty.');
      passwordRef.current.focus()
      return false;
    } else if (rePassword === '') {
      setError(true);
      setErrorMessage('Please re-enter your password');
      rePasswordRef.current.focus()
      return false;
    } else if (password !== rePassword) {
      setPassword('');
      setRePassword('');
      setError(true);
      setErrorMessage('Password do not match. Please try again.');
      passwordRef.current.value = '';
      rePasswordRef.current.value = '';
      passwordRef.current.focus();
      return false;
    }
    return true;
  }

  const handleClick = () => {
    const inputOk = validateInputs();
    if (inputOk) {
      submitForm();
    }
  }
  
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <div className={classes.logo}>
          <img className={classes.img} src={logo} alt="logo"/>
        </div>
        <br />
        <Typography component="h1" variant="h5">
          Register
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
            label="Full Name"
            margin="normal"
            required
            fullWidth
            id="name"
            onChange={(e) => setName(e.target.value)}
            inputRef={nameRef}
            onKeyPress={(e) => handleKeyPress(e)}
          />
          <TextField
            variant="outlined"
            label="E-mail"
            margin="normal"
            required
            fullWidth
            id="email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            inputRef={emailRef}
            onKeyPress={(e) => handleKeyPress(e)}
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
          <TextField
            variant="outlined"
            label="Repeat Password"
            margin="normal"
            required
            fullWidth
            id="re-password"
            name="re-password"
            type="password"
            onChange={(e) => setRePassword(e.target.value)}
            inputRef={rePasswordRef}
            onKeyPress={(e) => handleKeyPress(e)}
          />
          <Button
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleClick}
            fullWidth
          >
            Sign Up
          </Button>
        </form>
        <div>
          <p>Have an account? Please login <Link className={classes.link} to="/login">here</Link></p>
        </div>
        {error ? <SimpleDialog message={errorMessage} setError={setError} open={error}/> : ''}
        <LoadingScreen loading={loading} />
      </div>
    </Container>
  )
}