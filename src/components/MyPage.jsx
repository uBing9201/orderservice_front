import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@mui/material';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/UserContext';
import axiosInstance from '../configs/axios-config';
import { useNavigate } from 'react-router-dom';

const MyPage = () => {
  const [memberInfoList, setMemberInfoList] = useState([]);
  const { onLogout, userRole } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // 회원 정보를 불러오기
    /*
    이름, 이메일, 도시, 상세주소 우편번호를 노출해야 합니다.
    위 5가지 정보를 객체로 포장해서 memberInfoList에 넣어주세요.
    */
    const fetchMemberInfo = async () => {
      try {
        const url = userRole === 'ADMIN' ? '/list' : '/myInfo';
        const res = await axiosInstance.get('http://localhost:8181/user' + url);

        // console.log(res.data);
        // console.log(userRole);

        // ADMIN인 경우는 애초에 리스트로 리턴, 일반회원은 직접 배열로 감싸주자.(고차함수 돌려야 되니깐)
        const data = userRole === 'ADMIN' ? res.data.result : [res.data.result];

        setMemberInfoList((prev) => {
          return data.map((user) => [
            { key: '이름', value: user.name },
            { key: '이메일', value: user.email },
            { key: '도시', value: user.address?.city || '등록 전' },
            {
              key: '상세주소',
              value: user.address?.street || '등록 전',
            },
            {
              key: '우편번호',
              value: user.address?.zipCode || '등록 전',
            },
          ]);
        });
      } catch (e) {
        console.log('MyPage의 catch문');

        console.log(e);

        if (e.response.data.statusMessage === 'EXPIRED_RT') {
          alert('시간이 경과하여 재 로그인이 필요합니다.');
          onLogout();
          navigate('/login');
        } else if (e.response.data.message === 'NO_LOGIN') {
          alert('회원 전용 페이지입니다. 로그인 해 주세요');
          navigate('/login');
        }
      }
    };

    fetchMemberInfo();
  }, [userRole]);

  return (
    <Container>
      <Grid container justifyContent='center'>
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader title='회원정보' style={{ textAlign: 'center' }} />
            {memberInfoList.map((element, index) => (
              <CardContent>
                <Table>
                  <TableBody key={index}>
                    {element.map((info, index) => (
                      <TableRow key={index}>
                        <TableCell style={{ width: '200px' }}>
                          {info.key}
                        </TableCell>
                        <TableCell>{info.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            ))}
          </Card>
        </Grid>
      </Grid>

      {/* OrderListComponent */}
      {/* <OrderListComponent isAdmin={userRole === 'ADMIN'} /> */}
    </Container>
  );
};

export default MyPage;
