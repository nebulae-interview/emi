import React from 'react';
import { Typography } from '@material-ui/core';
import { FuseAnimate } from '@fuse';
import { Link } from 'react-router-dom';

function Error500Page(props) {
    return (
        <div className="flex flex-col flex-1 items-center justify-center p-16">

            <div className="max-w-512 text-center">

                <FuseAnimate animation="transition.expandIn" delay={100}>
                    <Typography variant="h1" color="inherit" className="font-medium mb-16">
                        500
                    </Typography>
                </FuseAnimate>

                <FuseAnimate delay={500}>
                    <Typography variant="h5" color="textSecondary" className="mb-16">
                        {props.message}
                    </Typography>
                </FuseAnimate>

                <FuseAnimate delay={600}>
                    <Typography variant="subtitle1" color="textSecondary" className="mb-48">
                        {props.description}
                    </Typography>
                </FuseAnimate>
            </div>
        </div>
    );
}

export default Error500Page;
