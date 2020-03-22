import { ApolloClient } from 'apollo-client'
import { ApolloProvider } from '@apollo/react-hooks';
import { split } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { getMainDefinition } from 'apollo-utilities';
import { GRAPHQL_CONFIG } from './graphqlServiceConfig';
import keycloakService from '../keycloakService'

class GraphqlService {

    constructor() {
        console.log('GraphqlService: singleton instance created');

        // Create an http link:
        const httpLink = createHttpLink({
            uri: GRAPHQL_CONFIG.http_uri,
        });
        const authLink = setContext((_, { headers }) => {
            // get the authentication token from local storage if it exists
            const token = keycloakService.tokens ? keycloakService.tokens.token : "";
            // return the headers to the context so httpLink can read them
            return {
                headers: {
                    ...headers,
                    authorization: token ? `Bearer ${token}` : "",
                }
            }
        });

        // Create  WebSocket link:
        const wsLink = new WebSocketLink({
            uri: GRAPHQL_CONFIG.ws_uri,
            options: {
                reconnect: true,
                connectionParams: () => {
                    return { authToken: keycloakService.tokens ? keycloakService.tokens.token : "" }
                }
            },

        });

        // using the ability to split links, you can send data to each link
        // depending on what kind of operation is being sent
        const link = split(
            // split based on operation type
            ({ query }) => {
                const definition = getMainDefinition(query);
                return (
                    definition.kind === 'OperationDefinition' &&
                    definition.operation === 'subscription'
                );
            },
            wsLink,
            authLink.concat(httpLink),
        );

        const cache = new InMemoryCache();
        this.client = new ApolloClient({link,cache,});
        this.provider = ApolloProvider;
    }
}

/**
 * Singleton instance
 */
const instance = new GraphqlService();

export default instance;