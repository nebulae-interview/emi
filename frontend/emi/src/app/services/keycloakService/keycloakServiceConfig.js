export const KEYCLOAK_CONFIG = {
    "realm": process.env.REACT_APP_KEYCLOAK_REALM,
    "url": process.env.REACT_APP_KEYCLOAK_URL,
    "ssl-required": process.env.REACT_APP_KEYCLOAK_SSL_REQUIRED,
    "clientId": process.env.REACT_APP_KEYCLOAK_CLIENT_ID,
    "public-client": Boolean(process.env.REACT_APP_KEYCLOAK_PUBLIC_CLIENT),
    "onLoad": process.env.REACT_APP_KEYCLOAK_ONLOAD
};

export const KEYCLOAK_PROVIDER_INIT_CONFIG = {
    onLoad: 'login-required'
};
