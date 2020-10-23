import React, {useEffect} from 'react';
import Axios from 'axios';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action'

export default function (SpecificComponent, option, adminRoute = null) {
    // option -> null  : 아무나 출입이 가능한 페이지
    //        -> true  : 로그인한 유저는 출입이 가능한
    //        -> false : 로그인한 유저는 출입이 불가능한
    function AuthenticationCheck(props){ 
        const dispatch = useDispatch();

        useEffect(() => {
            dispatch(auth()).then(response => {
                console.log(response);
                // Not Logined
                if(!response.payload.isAuth) {
                    if(option) {
                        props.history.push('/login');
                    }
                // Logined
                } else {
                    if(adminRoute && !response.payload.isAdmin) {
                        props.history.push('/');
                    } else {
                        if(!option) {
                            props.history.push('/');
                        }
                    }
                }
            })

            Axios.get('/api/users/auth')
        }, [])
        
        return (
            <SpecificComponent />
        )
    }

    return AuthenticationCheck;
}