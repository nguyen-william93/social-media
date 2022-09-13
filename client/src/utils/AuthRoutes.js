import React, {useContext} from 'react'
import {Outlet, Navigate} from 'react-router-dom';

import { AuthContext } from '../context/auth';

const AuthRoute = ({component: Component, ...rest}) => {
    const{ user } = useContext(AuthContext);

    return(
        user ? <Outlet/> : <Navigate to="/" />
    )
}

export default AuthRoute