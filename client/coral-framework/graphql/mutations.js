import {gql} from 'react-apollo';
import withMutation from '../hocs/withMutation';

export const withSetCommentStatus = withMutation(
  gql`
    mutation SetCommentStatus($commentId: ID!, $status: COMMENT_STATUS!){
      setCommentStatus(id: $commentId, status: $status) {
        ...SetCommentStatusResponse
      }
    }
  `, {
    props: ({mutate}) => ({
      setCommentStatus: ({commentId, status}) => {
        return mutate({
          variables: {
            commentId,
            status,
          },
        });
      }
    })
  });

export const withSuspendUser = withMutation(
  gql`
    mutation SuspendUser($input: SuspendUserInput!) {
      suspendUser(input: $input) {
        ...SuspendUserResponse
      }
    }
  `, {
    props: ({mutate}) => ({
      suspendUser: (input) => {
        return mutate({
          variables: {
            input,
          },
        });
      }
    })
  });

export const withRejectUsername = withMutation(
  gql`
    mutation RejectUsername($input: RejectUsernameInput!) {
      rejectUsername(input: $input) {
        ...RejectUsernameResponse
      }
    }
  `, {
    props: ({mutate}) => ({
      rejectUsername: (input) => {
        return mutate({
          variables: {
            input,
          },
        });
      }
    })
  });

export const withSetUserStatus = withMutation(
  gql`
    mutation SetUserStatus($userId: ID!, $status: USER_STATUS!) {
      setUserStatus(id: $userId, status: $status) {
        ...SetUserStatusResponse
      }
    }
  `, {
    props: ({mutate}) => ({
      setUserStatus: ({userId, status}) => {
        return mutate({
          variables: {
            userId,
            status
          },
        });
      }
    }),
  });

export const withPostComment = withMutation(
  gql`
    mutation PostComment($comment: CreateCommentInput!) {
      createComment(comment: $comment) {
        ...CreateCommentResponse
      }
    }
  `, {
    props: ({mutate}) => ({
      postComment: (comment) => {
        return mutate({
          variables: {
            comment
          },
        });
      }
    }),
  });

export const withEditComment = withMutation(
  gql`
    mutation EditComment($id: ID!, $asset_id: ID!, $edit: EditCommentInput) {
      editComment(id:$id, asset_id:$asset_id, edit:$edit) {
        ...EditCommentResponse
      }
    }
  `, {
    props: ({mutate}) => ({
      editComment: (id, asset_id, edit)  => {
        return mutate({
          variables: {
            id,
            asset_id,
            edit,
          },
        });
      }
    }),
  });

export const withPostFlag = withMutation(
  gql`
    mutation PostFlag($flag: CreateFlagInput!) {
      createFlag(flag: $flag) {
        ...CreateFlagResponse
      }
    }
  `, {
    props: ({mutate}) => ({
      postFlag: (flag) => {
        return mutate({
          variables: {
            flag
          }
        });
      }}),
  });

export const withPostDontAgree = withMutation(
  gql`
    mutation CreateDontAgree($dontagree: CreateDontAgreeInput!) {
      createDontAgree(dontagree: $dontagree) {
        ...CreateDontAgreeResponse
      }
    }
  `, {
    props: ({mutate}) => ({
      postDontAgree: (dontagree) => {
        return mutate({
          variables: {
            dontagree
          }
        });
      }}),
  });

export const withDeleteAction = withMutation(
  gql`
    mutation DeleteAction($id: ID!) {
      deleteAction(id:$id) {
        ...DeleteActionResponse
      }
    }
  `, {
    props: ({mutate}) => ({
      deleteAction: (id) => {
        return mutate({
          variables: {
            id
          }
        });
      }}),
  });

const COMMENT_FRAGMENT = gql`
    fragment CoralBest_UpdateFragment on Comment {
      tags {
        tag {
          name
        }
      }
    }
  `;

export const withAddTag = withMutation(
  gql`
    mutation AddTag($id: ID!, $asset_id: ID!, $name: String!) {
      addTag(tag: {name: $name, id: $id, item_type: COMMENTS, asset_id: $asset_id}) {
          errors {
              translation_key
          }
      }
    }
  `, {
    props: ({mutate}) => ({
      addTag: ({id, name, assetId}) => {
        return mutate({
          variables: {
            id,
            name,
            asset_id: assetId
          },
          optimisticResponse: {
            deleteAction: {
              __typename: 'DeleteActionResponse',
              errors: null,
            }
          },
          update: (proxy) => {
            const fragmentId = `Comment_${id}`;

            // Read the data from our cache for this query.
            const data = proxy.readFragment({fragment: COMMENT_FRAGMENT, id: fragmentId});

            data.tags.push({
              tag: {
                __typename: 'Tag',
                name: 'BEST'
              },
              __typename: 'TagLink'
            });

            // Write our data back to the cache.
            proxy.writeFragment({fragment: COMMENT_FRAGMENT, id: fragmentId, data});
          },
        });
      }}),
  });

export const withRemoveTag = withMutation(
  gql`
    mutation RemoveTag($id: ID!, $asset_id: ID!, $name: String!) {
      removeTag(tag: {name: $name, id: $id, item_type: COMMENTS, asset_id: $asset_id}) {
        errors {
          translation_key
        }
      }
    }
  `, {
    props: ({mutate}) => ({
      removeTag: ({id, name, assetId}) => {
        return mutate({
          variables: {
            id,
            name,
            asset_id: assetId
          },
          update: (proxy) => {
            const fragmentId = `Comment_${id}`;

            // Read the data from our cache for this query.
            const data = proxy.readFragment({fragment: COMMENT_FRAGMENT, id: fragmentId});

            const idx = data.tags.findIndex((i) => i.tag.name === 'BEST');

            data.tags = [...data.tags.slice(0, idx), ...data.tags.slice(idx + 1)];

            // Write our data back to the cache.
            proxy.writeFragment({fragment: COMMENT_FRAGMENT, id: fragmentId, data});
          }
        });
      }}),
  });

export const withIgnoreUser = withMutation(
  gql`
    mutation IgnoreUser($id: ID!) {
      ignoreUser(id:$id) {
        ...IgnoreUserResponse
      }
    }
  `, {
    props: ({mutate}) => ({
      ignoreUser: ({id}) => {
        return mutate({
          variables: {
            id,
          },
        });
      }}),
  });

export const withStopIgnoringUser = withMutation(
  gql`
    mutation StopIgnoringUser($id: ID!) {
      stopIgnoringUser(id:$id) {
        ...StopIgnoringUserResponse
      }
    }
  `, {
    props: ({mutate}) => ({
      stopIgnoringUser: ({id}) => {
        return mutate({
          variables: {
            id,
          },
        });
      }}),
  });
