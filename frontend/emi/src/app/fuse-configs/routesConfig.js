import React from 'react';
import {Redirect} from 'react-router-dom';
import {FuseUtils} from '@fuse';
import microFrontendIntegrator from './MicroFrontendIntegrator'


const routes = [
    ...FuseUtils.generateRoutesFromConfigs(microFrontendIntegrator.routeConfigs),
    {
        path     : '/',
        component: () => <Redirect to="/profile"/>
    }
];

export default routes;
