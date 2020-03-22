import { gql } from 'apollo-boost';

export const OrganizationMngOrganizationListing = (variables) => ({
    query: gql`
            query OrganizationMngOrganizationListing($filterInput:OrganizationMngOrganizationFilterInput ,$paginationInput:OrganizationMngOrganizationPaginationInput,$sortInput:OrganizationMngOrganizationSortInput){
                OrganizationMngOrganizationListing(filterInput:$filterInput,paginationInput:$paginationInput,sortInput:$sortInput){
                    listing{
                       id,name,active
                    },
                    queryTotalResultCount
                }
            }`,
    variables,
    fetchPolicy: 'network-only',
})