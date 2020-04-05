const s3_fetch = require('./index');
s3_fetch({
    aws: {
        accessKeyId: 'AKIA5PR4LRL7N4QQ36DR',
        secretAccessKey: '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'
    },
    buckets: [
        {
            bucket: "content-wb360",
            objects: [
                {
                    Key: "index.json"
                },
                {
                    Key: "AniketFuryRocks/rust.json"
                }
            ]
        }
    ]
}, false, true).then((value => {
    console.log("🖕♥ Function returned successfully");
    console.log(value["content-wb360"]);
})).catch((reason => {
    console.log("🖕😿 Function failed with error", reason);
}));
console.log("🥌✈ Fetch started !!")