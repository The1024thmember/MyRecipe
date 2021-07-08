const TabStyles = (theme) => ({
  tab: {
    marginTop: '30px',
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  feedContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  singleRecipeContainer: {
    margin: '30px auto',
    padding: '0px 28.1px',
    width: '470px',
    // transition: 'all 0.5s ease-in',
  },
  loaderContainer: {
    display: 'flex',
    marginTop: '50px',
    justifyContent: 'center',
    width: '100%',
    color: 'darkgray'
  }
})

export default TabStyles;