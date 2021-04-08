import React, {useReducer, useState} from 'react'
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    Badge,
    TableRow,
    Paper,
    Modal,
    Button,
} from '@material-ui/core'
import {ShoppingBasket, AddBoxRounded, Delete, Add, Remove } from '@material-ui/icons';
import { makeStyles,createMuiTheme,ThemeProvider } from '@material-ui/core/styles';
import { green,blue } from '@material-ui/core/colors';
 
import {products} from '../../products.json'
import { styles } from './styles';

const themebutton = createMuiTheme({
    palette: {
        primary: green,
        secondary: blue
    },
  });

const useStyles = makeStyles((theme) => ({
    modal: {
      display: 'flex',
      padding: theme.spacing(1),
      alignItems: 'center',
      justifyContent: 'center',
    },
  }));


export const HomePage = () => {

  const classes = useStyles();

    const [openBasket, setOpenBasket] = useState(false)

    const reducer = (basket, action) => {

        let total = basket.total
        
        if(action.type === 'AddBasket') {
            let isFound = false
            const tempBasket = basket.products.map((item) => {
                if (item.id === action.payload.item.id ) {
                    isFound = true
                    if (item.count < item.quantity) {
                        total += item.price
                        return {...item, count: item.count +1}
                    }
                    return item
                }
                return item
            })
            if (isFound) {
                return {total, products: tempBasket}
            }
            total += action.payload.item.price
            return {total, products:[...tempBasket, {...action.payload.item, count: 1}]};
        }
        if(action.type === 'RemoveBasket') {
            total -= action.payload.item.count * action.payload.item.price
           return {total, products:basket.products.filter(item => item.id !== action.payload.item.id)}
        }
        if(action.type === 'Increase') {
            const tempProducts =  basket.products.map((item) => {
                if (item.id === action.payload.item.id){
                    if (item.count < item.quantity) {
                        total += action.payload.item.price
                        return {...item, count: item.count +1}
                    }
                    return item
                }
                return item
            })
            return {total, products: tempProducts}
        }
        if(action.type === 'Decrease') {
            total -= action.payload.item.price
            if (action.payload.item.count > 1) {
                return { total, products:basket.products.map((item) => {
                    if (item.id === action.payload.item.id){
                        return({ ...item, count: item.count - 1})
                    }
                    return item
                })
            }}
            return { total, products: basket.products.filter((item) => item.id !== action.payload.item.id)}
        }
        
    }


    const basket = {products: [], total: 0.0}
    const [state, dispatch] = useReducer(reducer, basket);
    console.log(state)

    return (
        <div>
           <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" >Shopping Cart</Typography>
                    <div style={{ flexGrow: 1}} />
                        <IconButton onClick={() => setOpenBasket(true)}>
                            <Badge badgeContent={state.products.length} color="secondary">
                                <ShoppingBasket />
                            </Badge>
                        </IconButton>
                </Toolbar>

            </AppBar>
            <TableContainer component={Paper}>
                <Table  aria-label="simple table">
                    <TableBody>
                    {products.map((item) => (
                        <TableRow key={item.id.toString()}>
                            <TableCell component="th" scope="row">
                                <div style={{ display: 'flex'}}>
                                    <img src={item.image} alt="product" style={styles.productImage} />
                                    <div style={{ marginLeft: 15}}>
                                        <Typography>
                                            {item.name}
                                        </Typography>
                                        <Typography>
                                            {item.description}
                                        </Typography>
                                    </div>

                                </div>
                            </TableCell>
                        <TableCell>
                            <Typography>
                                {`Stock: ${item.quantity}`}
                            </Typography>
                        </TableCell>
                        <TableCell align="right" >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                            <Typography>
                                {`${item.price} ${item.currency}`}
                            </Typography>
                            <IconButton onClick={() => dispatch({ type: 'AddBasket', payload: {item} })}>
                                <AddBoxRounded />
                            </IconButton>
                            </div>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Modal
                disablePortal
                disableEnforceFocus
                disableAutoFocus
                className={classes.modal}
                open={openBasket}
                onClose={() => setOpenBasket(false)}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
             >
            <Paper>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" >My Basket</Typography>
                    </Toolbar>

                </AppBar>
                    {state.products.length > 0 ?
                <>
                    <TableContainer component={Paper}>
                        <Table  aria-label="simple table">
                            <TableBody>
                            {state.products.map((item) => (
                                <TableRow key={item.id.toString()}>
                                    <TableCell component="th" scope="row">
                                        <div style={{ display: 'flex'}}>
                                        <img src={item.image} alt="product" style={styles.productImage} />
                                        <div style={{ marginLeft: 15}}>
                                        <Typography>
                                            {item.name}
                                        </Typography>
                                        <Typography>
                                            {item.description}
                                        </Typography>
                                        </div>
                                        </div>
                                    </TableCell>
                                    <TableCell align="right" >
                                        <div style={{ display: 'flex', alignItems:  'center'}}>
                                            <IconButton onClick={() => dispatch({ type: 'Decrease', payload: {item} })}>
                                                <Remove />
                                            </IconButton>
                                            <Typography>
                                                {item.count}
                                            </Typography>
                                            <IconButton onClick={() => dispatch({ type: 'Increase', payload: {item} })}>
                                                <Add />
                                            </IconButton>
                                        </div>
                                    </TableCell>
                                    <TableCell align="right" >
                                        <div style={{ display: 'flex', alignItems: 'center'}}>
                                            <Typography>
                                                {`${item.price} ${item.currency}`}
                                            </Typography>
                                            <IconButton onClick={() => dispatch({ type: 'RemoveBasket', payload: {item} })}>
                                                <Delete />
                                            </IconButton>
                                        </div>
                                    </TableCell>
                                    
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <div style={{ margin: 25}}>
                    <Typography  variant="h6">
                        {` Total: ${state.total.toFixed(2)} ${state.products[0].currency}`}
                    </Typography>
                    </div>
                </>
                :
                <div style={{ alignSelf: 'center', textAlign: 'center', paddingTop: 50}}>
                    <Typography>
                        Empty Basket :(
                    </Typography>
                </div>
            }
                <div style={{ width: 'calc(100% - 100)', display: 'flex', justifyContent: 'space-between', margin: 50}}>
                    <Button variant="contained" color="secondary" onClick={() => setOpenBasket(false)}>
                        Continue Shopping
                    </Button>
                    {state.products.length > 0 && (
                        // <Button variant="contained" color="Primary">
                        //     Checkout Now
                        // </Button>
                        <ThemeProvider theme={themebutton}>
                            <Button variant="contained" color="primary" className={classes.margin}>
                                Checkout Now
                            </Button>
                        </ThemeProvider> 
                    )}
                </div>
            </Paper>
        </Modal>
        </div>
    )
}