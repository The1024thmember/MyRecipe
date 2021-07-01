const PostRecipePageStyles = (theme) => ({
  container: {
    maxWidth: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'center',
    fontFamily: "Roboto Slab",
  },
  parentContainer: {
    display: 'flex',
    height: 'calc(100vh - 70px - 80.99px - 100px)'
  },
  leftContainer: {
    padding: '20px',
    left: '0px',
    width: '50%',
    overflowY: 'auto',
    scrollbarWidth: 'thin'
  },
  rightContainer: {
    padding: '20px',
    right: '0px',
    width: '50%',
    overflowY: 'auto',
    scrollbarWidth: 'thin'
  },
  formControl: {
    marginTop: '16px',
    marginBottom: '8px',
    width: '100%',
  },
  buttonContainer: {
    position: 'fixed',
    display: 'flex',
    bottom: '0px',
    width: '100%',
    borderTop: 'solid 1px #eee',
    height: '99px',
    justifyContent: 'centre'
  },
  subButtonContainer: {
    margin: 'auto',
    display: 'flex',
    padding: '30px 0',
    justifyContent: 'space-between',
    width: '250px',
  },
  headerButtonContainer: {
    display: 'flex',
    margin: '16px 20px',
    justifyContent: 'space-between'
  }
})

export default PostRecipePageStyles;