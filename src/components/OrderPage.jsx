import {
  Button,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React, { useContext } from 'react';
import CartContext from '../context/CartContext';
import axios from 'axios';

const OrderPage = () => {
  const { productsInCart, clearCart: onClear } = useContext(CartContext);

  const clearCart = () => {
    onClear();
  };

  const orderCreate = async () => {
    // 백엔드가 달라는 형태로 줘야하니까 그에 맞게 객체를 매핑
    const orderProducts = productsInCart.map((p) => ({
      productId: p.id,
      productQuantity: p.quantity,
    }));

    if (orderProducts.length < 1) {
      alert('주문 대상 물품이 없습니다.');
      return;
    }

    const yesOrNo = confirm(
      `${orderProducts.length}개의 상품을 주문하시겠습니까?`,
    );

    if (!yesOrNo) {
      alert('주문이 취소되었습니다.');
      return;
    }

    // const res = await fetch('http://localhost:8181/order/create', {
    //   method: 'POST',
    //   headers: {
    //     'Content-type': 'application/json;cahrset=UTF-8',
    //     Authorization: 'Bearer ' + LocalStorage.getItem('ACCESS_TOKEN'),
    //   },
    //   body: JSON.stringify(orderProducts),
    // });

    // axios 를 이용한 백엔드 요청
    // axios는 요청 방식에 따라 메서드를 제공함.
    // (url, 전달하고자 하는 데이터(JSON으로 직접 변경 x), 헤더정보)
    // axios는 200번대 정상 응답이 아닌 모든 것을 예외로 처리하기 때문에
    // try,cathc로 작성해야한다. (fetch는 5400번대 응답에도 예외가 발생하)
    try {
      const res = await axios.post(
        'http://localhost:8181/order/create',
        orderProducts,
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('ACCESS_TOKEN'),
          },
        },
      );
      // const data = res.json(); -> fetch를 사용했을땐 데이터를 꺼내는 과정이 있음
      // console.log('axios를 통해 전달받은 데이터: ', res);
      alert('주문이 완료되었습니다.');
      clearCart();
    } catch (err) {
      console.log(err);
      alert('주문 실패');
    }
  };

  return (
    <Container>
      <Grid container justifyContent='center' style={{ margin: '20px 0' }}>
        <Typography variant='h5'>장바구니 목록</Typography>
      </Grid>
      <Grid
        container
        justifyContent='space-between'
        style={{ marginBottom: '20px' }}
      >
        <Button onClick={clearCart} color='secondary' variant='contained'>
          장바구니 비우기
        </Button>
        <Button onClick={orderCreate} color='primary' variant='contained'>
          주문하기
        </Button>
      </Grid>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>제품ID</TableCell>
              <TableCell>제품명</TableCell>
              <TableCell>주문수량</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productsInCart.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default OrderPage;
