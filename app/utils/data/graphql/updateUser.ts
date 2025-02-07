import { gql } from '@apollo/client';

export const updateUser = gql`
  mutation UpdateUsersPermissionsUser(
    $id: ID!
    $data: UsersPermissionsUserInput!
  ) {
    updateUsersPermissionsUser(id: $id, data: $data) {
      data {
        id
        attributes {
          fullName
          username
          email
          cart
        }
      }
    }
  }
`;
