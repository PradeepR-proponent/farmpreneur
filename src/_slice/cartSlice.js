import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        total: 0
    },
    reducers: {
        ADD_CART: (state, action) => {
            if (state.total == 0) {
                let cart = {
                    id: action.payload.id,
                    quantity: 1,
                    name: action.payload.name,
                    image: action.payload.image,
                    price: action.payload.price,
                    unit: action.payload.unit
                }
                state.items.push(cart);
                state.total++
            }
            else {
                let alreadyExist = false;
                state.items.map((item, key) => {
                    if (item.id == action.payload.id) {
                        state.items[key].quantity++;
                        alreadyExist = true;
                    }
                });
                if (!alreadyExist) {
                    let cart = {
                        id: action.payload.id,
                        quantity: 1,
                        name: action.payload.name,
                        image: action.payload.image,
                        price: action.payload.price,
                        unit: action.payload.unit
                    }
                    state.items.push(cart);
                    state.total++;
                }
            }
        },
        INCREASE_QUANTITY: (state, action) => {
            // state.total++
            state.items[action.payload].quantity++;
        },
        DECREASE_QUANTITY: (state, action) => {
            let quantity = state.items[action.payload].quantity;
            if (quantity > 1) {
                // state.total--;
                state.items[action.payload].quantity--;
            }

        },
        DELETE_CART: (state, action) => {
            let quantity = state.items[action.payload].quantity;
            state.total--,
                state.items = state.items.filter(item => {
                    return item.id != state.items[action.payload].id
                })
        },
        CLEAR_CART: (state) => {
            state.total = 0;
            state.items = [];
        },
    },
});

export const { ADD_CART, INCREASE_QUANTITY, DECREASE_QUANTITY, DELETE_CART,CLEAR_CART } = slice.actions;
export const items = state => state.cart.items;
export const total = state => state.cart.total;
export default slice.reducer;
