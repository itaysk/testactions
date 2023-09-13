# acquire context
discussion_category_name=${{ github.event.discussion.category.name }}
discussion_node_id=${{ github.event.discussion.node_id }}
discussion_body=${{ github.event.discussion.body }}

# find labels in discussion body
if [ "$discussion_category_name" != "Ideas" ]; then exit 0; fi
discussion_target=$(awk 'BEGIN{ RS="\\\\n\\\\n" } /^### Target/ {getline; print;}' <<< "$discussion_body")
discussion_scanner=$(awk 'BEGIN{ RS="\\\\n\\\\n" } /^### Scanner/ {getline; print;}' <<< "$discussion_body")
label_target=$(awk "/$discussion_target/ {print $2}" <config)
label_scanner=$(awk "/$discussion_scanner/ {print $2}" <config)

# apply labels to discussion
# TODO: apply all labels in one call
# 
if [ "$label_target" != "" ]; then
  gh api graphql -F query=@addLabels.gql -f labelId="$label_target" -f labelableId="$discussion_node_id"
fi
if [ "$label_scanner" != "" ]; then
  gh api graphql -F query=@addLabels.gql -f labelId="$label_scanner" -f labelableId="$discussion_node_id"
fi
