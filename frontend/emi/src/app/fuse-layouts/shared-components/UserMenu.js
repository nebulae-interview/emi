import React, { useState, useEffect } from 'react';
import { Avatar, Button, Icon, ListItemIcon, ListItemText, Popover, MenuItem, Typography, Divider } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import * as authActions from 'app/auth/store/actions';
import { Link } from 'react-router-dom';
import { MDText } from 'i18n-react';
import i18n from "./i18n";
import { useLazyQuery } from "@apollo/react-hooks";
import { OrganizationMngOrganizationListing } from "./gql/Organization";



function UserMenu(props) {

    const dispatch = useDispatch();
    const user = useSelector(({ auth }) => auth.user);
    const [userMenu, setUserMenu] = useState(null);
    const [organizationListing, setOrganizationListing] = useState([]);
    const [selectedOrganization, setSelectedOrganization] = useState({ id: "", name: "---" });

    const organizationListingQuery = OrganizationMngOrganizationListing({});
    const [refreshOrganizationListing, { loading: loadingOrganizationListing, data: organizationListingData, error: organizationListingError }] = useLazyQuery(organizationListingQuery.query,
        { variables: { filterInput: { organizationId: "" } }, fetchPolicy: OrganizationMngOrganizationListing.fetchPolicy });



    useEffect(() => {
        if (organizationListingData && organizationListingData.OrganizationMngOrganizationListing) {
            const orgs = organizationListingData.OrganizationMngOrganizationListing.listing;
            if (orgs.length > 0) {

                const lastSelectedOrganizationId = window.localStorage.getItem("organizationId");
                let org = lastSelectedOrganizationId ? orgs.find(o => o.id === lastSelectedOrganizationId) : orgs[0];
                org = org || orgs[0];

                setSelectedOrganization(org);
                dispatch(authActions.setSelectedOrganization(org));
            }
            setOrganizationListing(organizationListingData.OrganizationMngOrganizationListing.listing);
        } else if (organizationListingError) {
            if (selectedOrganization.id === "") {
                setSelectedOrganization({ id: "", name: "ERROR" });
            }
            setOrganizationListing([]);
        }
    }, [organizationListingData, organizationListingError])

    useEffect(() => {
        if (user && user.data && !user.selectedOrganization) {
            if (user.data.organizationId) {
                const selOrg = { id: user.data.organizationId, name: user.data.organizationId, active: true };
                setSelectedOrganization(selOrg);
                dispatch(authActions.setSelectedOrganization(selOrg));
                refreshOrganizationListing({ variables: { filterInput: { organizationId: user.data.organizationId } } });
            } else {
                refreshOrganizationListing({ variables: { sortInput: { field: 'name', asc: true } } });
            }
        }
    }, [user])


    let T = new MDText(i18n.get(user.locale));

    const userMenuClick = event => {
        setUserMenu(event.currentTarget);
    };

    const userMenuClose = () => {
        setUserMenu(null);
    };

    function handleOrganizationSelection(org) {
        setSelectedOrganization(org);
        dispatch(authActions.setSelectedOrganization(org));
        userMenuClose();
        window.localStorage.setItem("organizationId", org.id);
    }

    return (
        <React.Fragment>
            <Button className="h-64" onClick={userMenuClick}>
                {user.data.photoURL ?
                    (
                        <Avatar className="" alt="user photo" src={user.data.photoURL} />
                    )
                    :
                    (
                        <Avatar className="">
                            {user.data.displayName[0]}
                        </Avatar>
                    )
                }

                <div className="hidden md:flex flex-col ml-12 items-start">
                    <Typography component="span" className="normal-case font-600 flex">
                        {user.data.displayName}
                    </Typography>
                    <Typography className="text-11 capitalize" color="textSecondary">
                        {selectedOrganization.name}
                    </Typography>
                </div>

                <Icon className="text-16 ml-12 hidden sm:flex" variant="action">keyboard_arrow_down</Icon>
            </Button>

            <Popover
                open={Boolean(userMenu)}
                anchorEl={userMenu}
                onClose={userMenuClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center'
                }}
                classes={{
                    paper: "py-8"
                }}
            >
                {!user.role || user.role.length === 0 ? (
                    <React.Fragment>
                        <MenuItem component={Link} to="/login">
                            <ListItemIcon className="min-w-40">
                                <Icon>lock</Icon>
                            </ListItemIcon>
                            <ListItemText className="pl-0" primary="Login" />
                        </MenuItem>
                        <MenuItem component={Link} to="/register">
                            <ListItemIcon className="min-w-40">
                                <Icon>person_add</Icon>
                            </ListItemIcon>
                            <ListItemText className="pl-0" primary="Register" />
                        </MenuItem>
                    </React.Fragment>
                ) : (
                        <React.Fragment>
                            <MenuItem component={Link} to="/pages/profile" onClick={userMenuClose}>
                                <ListItemIcon className="min-w-40">
                                    <Icon>account_circle</Icon>
                                </ListItemIcon>
                                <ListItemText className="pl-0" primary={T.translate("UserMenu.user_menu.my_profile")} />
                            </MenuItem>

                            <MenuItem onClick={() => { dispatch(authActions.logoutUser()); userMenuClose(); }}>
                                <ListItemIcon className="min-w-40">
                                    <Icon>exit_to_app</Icon>
                                </ListItemIcon>
                                <ListItemText className="pl-0" primary={T.translate("UserMenu.user_menu.logout")} />
                            </MenuItem>

                            <Divider />

                            {
                                organizationListing.map(org =>
                                    <MenuItem key={org.id} onClick={() => handleOrganizationSelection(org)}>
                                        <ListItemIcon className="min-w-40">
                                            <Icon>{org.id === selectedOrganization.id ? "check" : "chevron_right"}</Icon>
                                        </ListItemIcon>
                                        <ListItemText className="pl-0" primary={org.name} />
                                    </MenuItem>
                                )
                            }

                        </React.Fragment>
                    )}
            </Popover>
        </React.Fragment>
    );
}

export default UserMenu;
