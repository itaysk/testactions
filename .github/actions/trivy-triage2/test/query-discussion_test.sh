#! /bin/bash
# Tests the GQL query that fetches discussion details by number
discussion_num="$1"
gh api graphql -F discussion_num="$discussion_num" -F repo="{repo}" -F owner="{owner}" -f query='
    query Discussion ($owner: String!, $repo: String!, $discussion_num: Int!){
    repository(name: $repo, owner: $owner) {
        discussion(number: $discussion_num) {
        number,
        id,
        body,
        labels(first: 100) {
            edges {
            node {
                id,
                name
            }
            }
        }
        }
    }
    }'