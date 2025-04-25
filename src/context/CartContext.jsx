import React, { useReducer } from 'react';

// 리듀서 함수 정의
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_CART':
      const existProduct = state.productsInCart.find(
        (p) => p.id === action.product.id,
      );

      let updateProduct;
      let totalQuantity = (state.totalQuantity += action.product.quantity);

      if (existProduct) {
        // 중복상품이 이미 카트에 존재한다면
        // 다른상품은 그대로 유지하고, id가 같은 상품의 quantity만 수정
        updateProduct = state.productsInCart.map((p) =>
          p.id === action.product.id
            ? { ...p, quantity: p.quantity + action.product.quantity }
            : p,
        );
      } else {
        // 상품이 처음 카트에 담긴다면 기존로직 유지
        updateProduct = [...state.productsInCart, action.product];
      }

      // 세션 스토리지에 카트 상태를 저장 (새로고침 해도 안날아가게)
      // 로컬, 세션 스토리지에 저장하는 데이터가 객체(배열)인 경우 저장 안됨
      // 문자열만 받는다.
      // JSON 문자열화 해서 저장하면 가능
      sessionStorage.setItem('productsInCart', JSON.stringify(updateProduct));
      sessionStorage.setItem('totalQuantity', totalQuantity);

      return {
        productsInCart: updateProduct,
        totalQuantity,
      };

    case 'CLEAR_CART':
      sessionStorage.clear();
      return {
        productsInCart: [],
        totalQuantity: 0,
      };
  }
};

// 새로운 Context 생성
const CartContext = React.createContext({
  productsInCart: [],
  totalQuantity: 0,
  addCart: () => {},
  clearCart: () => {},
});

export const CartContextProvider = (props) => {
  const [cartState, dispatch] = useReducer(cartReducer, {
    // JSON 문자열로 저장한 객체, 배열을 JS타입으로 변환하는 JSON.parse()
    //
    productsInCart: JSON.parse(sessionStorage.getItem('productsInCart')) || [],
    totalQuantity: parseInt(sessionStorage.getItem('totalQuantity')) || 0,
  });

  const addCart = (product) => {
    dispatch({
      type: 'ADD_CART',
      product,
    });
    // console.log('장바구니: ', cartState);
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider
      value={{
        productsInCart: cartState.productsInCart,
        totalQuantity: cartState.totalQuantity,
        addCart,
        clearCart,
      }}
    >
      {props.children}
    </CartContext.Provider>
  );
};

export default CartContext;
