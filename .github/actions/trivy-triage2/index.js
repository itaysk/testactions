module.exports = async ({github, context, core}, discussionNum) => {
        // const configDiscussionLabels = {
    //     "Container Image":"LA_kwDOCsUTCM75TTQU",
    //     "Filesystem":"LA_kwDOCsUTCM75TTQX",
    //     "Git Repository":"LA_kwDOCsUTCM75TTQk",
    //     "Virtual Machine Image":"LA_kwDOCsUTCM8AAAABMpz1bw",
    //     "Kubernetes":"LA_kwDOCsUTCM75TTQv",
    //     "AWS":"LA_kwDOCsUTCM8AAAABMpz1aA",
    //     "Vulnerability":"LA_kwDOCsUTCM75TTPa",
    //     "Misconfiguration":"LA_kwDOCsUTCM75TTP8",
    //     "License":"LA_kwDOCsUTCM77ztRR",
    //     "Secret":"LA_kwDOCsUTCM75TTQL"
    // };


    const configDiscussionLabels = {
        "Container Image":"MDU6TGFiZWwyNTk4MTQxNDQ5",
        "Filesystem":"MDU6TGFiZWwyNTk4MTQxNDUw",
        "Git Repository":"MDU6TGFiZWwyNTk4MTQxNDUy",
        "Virtual Machine Image":"MDU6TGFiZWwyNTk4MTQxNDU0",
        "Kubernetes":"MDU6TGFiZWwyNTk4MTQxNDU4",
        "AWS":"MDU6TGFiZWwyNTk4MTQxNDU2",
        "Vulnerability":"MDU6TGFiZWwyNTk4MTQxNDYw",
        "Misconfiguration":"MDU6TGFiZWwyNTk4MTQxNDYy",
        "License":"MDU6TGFiZWwyNTk4MTQxNDY1",
        "Secret":"LA_kwDOE0GiPM8AAAABYmqMGg"
    };

    let discussion = context.payload.discussion;
    if (discussionNum != '') { // if worfklow triggered manually
        const queryDiscussion = `query Discussion ($owner: String!, $repo: String!, $discussion_num: Int!){
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
        }`;
        const queryDiscussionVars = {
            owner: context.repo.owner,
            repo: context.repo.repo,
            discussion_num: discussionNum
        };
        const discussionRes = await github.graphql(queryDiscussion, queryDiscussionVars);
        console.log(discussionRes);
        discussion = discussionRes.data.repository.discussion;
    }
    const discussionNumber = discussion.number;
    const category = discussion.category.name;
    const body = discussion.body;

    if (category !== "Ideas") {
        consolt.log("skipping discussion with category ${category} and body ${body}");
    }

    const scannerPattern = /### Scanner\n\n(.+)\n/;
    const scannerFound = body.match(regex);
    console.log(scannerFound);
    const scannerLabel = scannerFound[1];
    if (!scannerLabel) {
            console.log("Scanner not found in discussion body");

        const mutationAddLabels = `mutation AddLabels($labelId: ID!, $labelableId:ID!) {
        addLabelsToLabelable(
            input: {labelIds: [$labelId], labelableId: $labelableId}
        ) {
            clientMutationId
        }
    }`;

        const mutationAddLabelsVars = {
            labelId: configDiscussionLabels[scannerLabel],
            labelableId: ''
        };
        const result = await github.graphql(mutationAddLabels, mutationAddLabelsVars);
        console.log(result);
    }
}