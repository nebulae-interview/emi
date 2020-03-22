import React, { useEffect, useState } from 'react';
import { AppBar, Card, CardContent, Toolbar, Typography } from '@material-ui/core';
import { FuseAnimateGroup } from '@fuse';
import { useSelector } from 'react-redux';
import { MDText } from 'i18n-react';
import i18n from "../i18n";

function AboutTab() {
    //const dispatch = useDispatch();
    const user = useSelector(({ auth }) => auth.user);

    let T = new MDText(i18n.get(user.locale));

    const [data, setData] = useState(null);

    useEffect(() => {
        setData(user);
    }, [user]);

    if (!data) {
        return null;
    }

    const { displayName, email} = data.data;
    const { friendlyRoleGroups, role } = data;

    return (
        <div className="md:flex max-w-2xl">

            <div className="flex flex-col flex-1 md:pr-32">
                <FuseAnimateGroup
                    enter={{
                        animation: "transition.slideUpBigIn"
                    }}
                >
                    <Card className="w-full mb-16">
                        <AppBar position="static" elevation={0}>
                            <Toolbar className="pl-16 pr-8">
                                <Typography variant="subtitle1" color="inherit" className="flex-1">
                                    {T.translate("ProfilePage.AboutTab.general_information.title")}
                                </Typography>
                            </Toolbar>
                        </AppBar>

                        <CardContent>
                            <div className="mb-24">
                                <Typography className="font-bold mb-4 text-15">
                                    {T.translate("ProfilePage.AboutTab.general_information.email")}
                                </Typography>
                                <Typography>{email}</Typography>
                            </div>

                            <div className="mb-24">
                                <Typography className="font-bold mb-4 text-15">
                                    {T.translate("ProfilePage.AboutTab.general_information.display_name")}
                                </Typography>
                                <Typography>{displayName}</Typography>
                            </div>
                            <div className="mb-24">
                                <Typography className="font-bold mb-4 text-15">
                                    {T.translate("ProfilePage.AboutTab.general_information.roles")}
                                </Typography>
                                <Typography>{friendlyRoleGroups.join(',')}</Typography>
                            </div>
                            <div className="mb-24">
                                <Typography className="font-bold mb-4 text-15">
                                    {T.translate("ProfilePage.AboutTab.general_information.permissions")}
                                </Typography>
                                <Typography>{role.join(', ')}</Typography>
                            </div>

                        </CardContent>
                    </Card>

                </FuseAnimateGroup>
            </div>


        </div>
    );
}

export default AboutTab;
