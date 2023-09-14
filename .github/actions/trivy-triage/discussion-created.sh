set -x
# acquire context
discussion_created_json="$1"
discussion_category_name=$(jq '.category.name' "$discussion_created_json")
discussion_node_id=$(jq '.node_id' "$discussion_created_json")
discussion_body=$(jq '.body' "$discussion_created_json")

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
