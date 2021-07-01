const loginPageStyles = (theme) => ({
  header: {
    fontSize: '2.5em',
  },
  logo: {
    display: 'flex',
    justifyContent: 'center',
    margin: theme.spacing(1),
    height: '250px',
    width: '250px',
  },
  img: {
    objectFit: 'contain'
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  link: {
    color: '#2724f0',
    textDecoration: 'none'
  }
});

export default loginPageStyles;