const HeaderStyles = {
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'sticky',
    height: '70px',
    top: '0px',
    width: '100%',
    backgroundColor: '#fff',
    boxShadow:
    "0 4px 18px 0px rgba(0, 0, 0, 0.12), 0 7px 10px -5px rgba(0, 0, 0, 0.15)",
    zIndex: '1',
  },
  brandContainer: {
    display: 'flex',
    margin: '10px 20px',
  },
  img: {
    objectFit: "contain",
    width: '50px',
    height: '50px'
  },
  brand: {
    marginLeft: '10px',
    // fontFamily: 'Dancing Script',
    fontFamily: 'Yesteryear',
    // fontWeight: 'bold',
    textTransform: 'none',
    fontSize: '20pt',
    color: '#E28D76'
  },
};

export default HeaderStyles;