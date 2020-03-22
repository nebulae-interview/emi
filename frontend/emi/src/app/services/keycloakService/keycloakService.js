import Keycloak from 'keycloak-js';
import { KeycloakProvider } from 'react-keycloak';
import jwtDecode from 'jwt-decode';
import { KEYCLOAK_CONFIG, KEYCLOAK_PROVIDER_INIT_CONFIG } from './keycloakServiceConfig';

class KeycloakService {


    /**
     * Keycloak base instance
     */
    keycloak;
    /**
     * OnReady callback from Auth.js
     */
    onReady = undefined;
    /**
     * onAuthError callback from Auth.js
     */
    onAuthError = undefined;

    fuseSettings = {
        "customScrollbars": true,
        "theme": {
            "main": "default",
            "navbar": "mainThemeDark",
            "toolbar": "mainThemeLight",
            "footer": "mainThemeDark"
        },
        "layout": {
            "style": "layout1",
            "config": {
                "mode": "fullwidth",
                "scroll": "content",
                "navbar": {
                    "display": true,
                    "folded": false,
                    "position": "left"
                },
                "toolbar": {
                    "display": true,
                    "style": "fixed",
                    "position": "below"
                },
                "footer": {
                    "display": false,
                    "style": "fixed",
                    "position": "below"
                },
                "leftSidePanel": {
                    "display": true
                },
                "rightSidePanel": {
                    "display": true
                }
            }
        }
    };

    constructor() {
        console.log('KeycloakService: singleton instance created');
        this.keycloak = new Keycloak(KEYCLOAK_CONFIG);
        this.provider = KeycloakProvider;
        this.providerArgs = {
            keycloak: this.keycloak,
            initConfig: KEYCLOAK_PROVIDER_INIT_CONFIG,
            onEvent: this.onKeycloakEvent,
            onTokens: this.onKeycloakTokens
        };

    }


    /**
     * On keycloak event handler
     * Event possible values: "onReady" | "onAuthSuccess" | "onAuthError" | "onAuthRefreshSuccess" | "onAuthRefreshError" | "onAuthLogout" | "onTokenExpired"
     */
    onKeycloakEvent = (event, error) => {
        switch (event) {
            case "onReady":
                console.log('keycloakService:', 'onKeycloakEvent.onReady');
                if (this.onReady) {
                    this.onReady();
                }
                break;
            case "onAuthSuccess":
                console.log('keycloakService:', 'onKeycloakEvent.onAuthSuccess');
                break;
            case "onAuthError":
                console.log('keycloakService:', 'onKeycloakEvent.onAuthError', error);
                if (this.onAuthError) {
                    this.onAuthError();
                }
                break;
            case "onAuthRefreshSuccess":
                console.log('keycloakService:', 'onKeycloakEvent.onAuthRefreshSuccess');
                break;
            case "onAuthRefreshError":
                console.log('keycloakService:', 'onKeycloakEvent.onAuthRefreshError', error);
                break;
            case "onAuthLogout": console.log('keycloakService:', 'onKeycloakEvent.onAuthLogout', error);
                this.logout();
                break;
            case "onTokenExpired":
                console.log('keycloakService:', 'onKeycloakEvent.onTokenExpired', error);
                this.logout();
                break;
            default:
                console.log('keycloakService:', 'onKeycloakEvent.default', error);
                break;
        }
    };


    onKeycloakTokens = tokens => {
        console.log('keycloakService:', 'onKeycloakTokens', tokens);
        const { idToken, refreshToken, token } = tokens;
        const decodedToken = jwtDecode(token);
        this.tokens = {
            idToken, refreshToken, token, decodedToken
        }
        this.refreshUser();
        this.setSession(token);
        console.log('keycloakService:', 'isAuthTokenValid?: ', this.isAuthTokenValid());
        console.log('keycloakService:', 'decodedToken: ', decodedToken);
        console.log('keycloakService:', 'user: ', this.user);

    };

    isAuthTokenValid = () => {
        const { token } = this.tokens || {};
        if (!token) {
            return false;
        }
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
            console.warn('access token expired');
            return false;
        }
        else {
            return true;
        }
    };

    refreshUser() {
        const { token, decodedToken } = this.tokens || {};
        if (!token) {
            this.user = undefined;
        }
        const uid = decodedToken.email;
        this.user = {
            uid,
            from: 'keycloak',
            role: decodedToken.realm_access.roles,
            roleGroups: decodedToken.role_group,
            friendlyRoleGroups: decodedToken.role_group.map(rg => rg.split('/').pop()),
            locale: decodedToken.locale || 'en',
            data: {
                displayName: decodedToken.name,
                email: decodedToken.email,
                photoURL: decodedToken.picture,
                organizationId: decodedToken.organizationId,
                companyIds: (decodedToken.companyIds || '').split(',').map(s => s.trim()),
                locationIds: (decodedToken.locationIds || '').split(',').map(s => s.trim()),
                settings: this.fuseSettings,
                shortcuts: (localStorage.getItem(`${uid}->shortcuts`) || '').split(',').map(s => s.trim()),                
            }
        }
    }

    getPermissions() {
        const { decodedToken } = this.tokens || {};
        if (!decodedToken) {
            return [];
        }
        return decodedToken.realm_access.roles;
    }

    setSession(token) {
        if (token) {
            localStorage.setItem('jwt_access_token', token);
        }
        else {
            localStorage.removeItem('jwt_access_token');
        }
    };

    logout = () => {
        console.log('keycloakService:', 'logout');
        this.setSession(null);
        this.tokens = undefined;
        this.user = undefined;
        this.keycloak.logout();
    }

    updateUserData = (user) => new Promise(resolve => {
        const shortcuts = user.data.shortcuts || [];
        console.log('keycloakService:', 'updateUserData: ', JSON.stringify(shortcuts, null, 2));
        localStorage.setItem(`${user.uid}->shortcuts`, (shortcuts || []).join(','));
        resolve();
    })


    getAccessToken = () => {
        return localStorage.getItem('access_token');
    };

    getIdToken = () => {
        return window.localStorage.getItem('id_token');
    };
}

/**
 * Singleton instance
 */
const instance = new KeycloakService();

export default instance;