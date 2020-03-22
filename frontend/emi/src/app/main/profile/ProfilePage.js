import React, { useState } from 'react';
import { Avatar, Button, Tab, Tabs, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { FusePageSimple, FuseAnimate } from '@fuse';
import AboutTab from './tabs/AboutTab';
import { useSelector } from 'react-redux';
import { MDText } from 'i18n-react';
import i18n from "./i18n";

const useStyles = makeStyles(theme => ({
    layoutHeader: {
        height: 320,
        minHeight: 320,
        [theme.breakpoints.down('md')]: {
            height: 240,
            minHeight: 240
        }
    }
}));

function ProfilePage() {
    const user = useSelector(({ auth }) => auth.user);
    let T = new MDText(i18n.get(user.locale));
    const classes = useStyles();
    const [selectedTab, setSelectedTab] = useState(0);

    function handleTabChange(event, value) {
        setSelectedTab(value);
    }

    function handleEditButtonClick() {
        window.open(
            process.env.REACT_APP_KEYCLOAK_URL +
            "/realms/" +
            process.env.REACT_APP_KEYCLOAK_REALM +
            "/account/",
            "_blank"
        );
    }

    return (
        <FusePageSimple
            classes={{
                header: classes.layoutHeader,
                toolbar: "px-16 sm:px-24"
            }}
            header={
                <div className="p-24 flex flex-1 flex-col items-center justify-center md:flex-row md:items-end">
                    <div className="flex flex-1 flex-col items-center justify-center md:flex-row md:items-center md:justify-start">
                        <FuseAnimate animation="transition.expandIn" delay={300}>
                            <Avatar className="w-96 h-96" src={user.data.photoURL && user.data.photoURL !== '' ? user.data.photoURL : "assets/images/avatars/profile.jpg"} />
                        </FuseAnimate>
                        <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                            <Typography className="md:ml-24" variant="h4" color="inherit">{user.data.displayName}</Typography>
                        </FuseAnimate>
                    </div>

                    <div className="flex items-center justify-end">
                        <Button className="mr-8 normal-case" variant="contained" color="secondary" aria-label="Follow" onClick={handleEditButtonClick}>{T.translate("ProfilePage.AboutTab.edit")}</Button>
                    </div>
                </div>
            }
            contentToolbar={
                <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    indicatorColor="secondary"
                    textColor="secondary"
                    variant="scrollable"
                    scrollButtons="off"
                    classes={{
                        root: "h-64 w-full border-b-1"
                    }}
                >
                    <Tab classes={{ root: "h-64" }} label={T.translate("ProfilePage.AboutTab.title")} />
                </Tabs>
            }
            content={
                <div className="p-16 sm:p-24">
                    {selectedTab === 0 && (
                        <AboutTab />
                    )}
                </div>
            }
        />
    )
}

export default ProfilePage;
