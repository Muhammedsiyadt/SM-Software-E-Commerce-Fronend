// 06-05-2023 Athul Vinod



import React, { useEffect, useState } from 'react'
import { FaArrowRight, FaMinus, FaPlus, FaTimes } from 'react-icons/fa'
import { Link } from 'wouter'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllCart } from '../../app/Cart/cartAction'
import Loader from '../Loader/Loader'
import EmptyCart from '../Feedback/EmptyCart'
import { Alert, AlertIcon, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Text, Tooltip } from '@chakra-ui/react'
import { updateCart } from '../../app/Cart/updateCartAction'
import CartVerdict from './cartVerdict'
import { removeCart } from '../../app/Cart/removeCartAction'




function CartItems() {

    const dispatch = useDispatch();
    const { loading, success, user } = useSelector(state => state.user)
    const cartState = useSelector(state => state.cart);
    const updateCartState = useSelector(state => state.updateCart);
    const removeCartState = useSelector(state => state.removeCart);


    const [count, setCount] = useState(1)



    useEffect(() => {

        setCount((prevCount) => prevCount + 1);

    }, [updateCartState.success, removeCartState.success]);

    
    useEffect(() => {
        if(user !== null && localStorage.getItem('token')){
            dispatch(fetchAllCart({ token: JSON.parse(localStorage.getItem('token')), id: user.id }));
        }
    }, [count, dispatch]);
    

    function incrementQuantity(e, id) {
        dispatch(updateCart({ token: JSON.parse(localStorage.getItem("token")), quantity: e, product: id }))
        dispatch(fetchAllCart({ token: JSON.parse(localStorage.getItem('token')), id: user.id }));
        setCount((prevKey) => prevKey + 1);
    }


    function deleteCartItem(id) {
        dispatch(removeCart({ token: JSON.parse(localStorage.getItem("token")), product: id }))
        dispatch(fetchAllCart({ token: JSON.parse(localStorage.getItem('token')), id: user.id }));
        setCount((prevKey) => prevKey + 1);
    }




    return (
        <div className="container pb-5 mb-2 mb-md-4">
            {cartState.loading ? <Loader /> : <>
                {cartState.error ? <Alert variant={"left-accent"} status='error'>
                    <AlertIcon />
                    {cartState.message}
                </Alert> : <>
                    {Array.isArray(cartState.items) && cartState.items.length >= 1 ? <div className="row">
                        {/* List of items*/}
                        <section className="col-lg-8">

                            {cartState.items.map((e , index) => {
                                return (
                                    <div key={e?.product[0]?.slug}>
                                        {/* Item*/}
                                        <div className="d-sm-flex justify-content-between align-items-center my-2 pb-3 border-bottom">
                                            <div className="d-block d-sm-flex align-items-center text-sm-start">
                                                <Link
                                                    className="d-inline-block flex-shrink-0 mx-auto me-sm-4"
                                                    to={`/product/${e?.product[0]?.slug}`}
                                                >
                                                    <img src={`${process.env.REACT_APP_BASE_URL}/media/product/${e?.product[0]?.thumbnail}`} width={130} alt="Product" />
                                                </Link>
                                                <div className="pt-2 ">
                                                    <Tooltip label={e.product[0].name} hasArrow>
                                                        <Text wordBreak={2} noOfLines={4} maxWidth={600} fontWeight={500} className="product-title fs-base mb-2 text-capitalize ">
                                                            <Link to={`/product/${e?.product[0]?.slug}`}>{e.product[0].name}</Link>
                                                        </Text>
                                                    </Tooltip>
                                                    <div className="fs-lg text-primary pt-2">

                                                        {parseFloat(e?.product[0].offer_price) !== 0 ?
                                                            <div className="h3 fw-normal text-primary mb-3 me-1">
                                                                <div className="d-flex flex-wrap">
                                                                    <div className="h3 fw-normal text-primary mb-3 me-1">
                                                                        ₹{e?.product[0].offer_price}
                                                                    </div>
                                                                </div>

                                                            </div> :
                                                            <div className="h3 fw-normal text-primary mb-3 me-1">₹{
                                                                e?.product[0].unit_price
                                                            }</div>}

                                                    </div>
                                                </div>

                                            </div>
                                            <div
                                                className="pt-2 pt-sm-0 ps-sm-3 mx-auto mx-sm-0 text-center text-sm-start"
                                                style={{ maxWidth: "9rem" }}
                                            >
                                                <div>
                                                    <label className="form-label" htmlFor="quantity1">
                                                        Quantity
                                                    </label>

                                                    <NumberInput isDisabled={updateCartState.loading} onChange={(l) => { incrementQuantity(l, e?.product[0].id) }} value={e?.quantity} min={1} max={e?.product[0]?.stock} >
                                                        <NumberInputField readOnly />
                                                        <NumberInputStepper>
                                                            <Tooltip label="Increment" hasArrow>
                                                                <NumberIncrementStepper
                                                                    children={<FaPlus />}
                                                                />
                                                            </Tooltip>
                                                            <Tooltip label="Decrement" hasArrow>
                                                                <NumberDecrementStepper
                                                                    children={<FaMinus />}
                                                                />
                                                            </Tooltip>

                                                        </NumberInputStepper>
                                                    </NumberInput>

                                                </div>
                                                <button className="btn btn-link mt-2 px-0 text-danger" type="button" onClick={() => { deleteCartItem(e?.product[0].id) }}>
                                                    <FaTimes className="ci-close-circle me-2" />
                                                    <span className="fs-sm">Remove</span>
                                                </button>




                                            </div>
                                        </div>
                                    </div>
                                )
                            })}


                        </section>
                        {/* Sidebar*/}
                        <CartVerdict cartState={cartState} key={count} />
                    </div > : <EmptyCart message={"Your cart is empty"} />}
                </>}
            </>}
        </div >

    )
}

export default CartItems