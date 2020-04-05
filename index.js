const aws = require("aws-sdk");

/**
 * @static
 * @default
 * @async
 * @public
 * @throws awsError
 * @param {{aws:{accessKeyId:String,secretAccessKey:String},buckets:[{bucket:String,objects:[{Key:String}]}]}} args
 * @param {boolean} meta retain S3 Object's meta data like LastModified ,ContentLength
 * @param {boolean} parse pre-parse byte array to string or json
 **/
module.exports = async (args, meta = false, parse = true) => {
    let s3_data = {};
    const s3 = new aws.S3({...args.aws});
    let promises = [];
    args.buckets.forEach((Bucket) => {
        s3_data[Bucket.bucket] = [];
        Bucket.objects.forEach((object) => {
            promises.push(new Promise((resolve, reject) => {
                s3.getObject({Bucket: Bucket.bucket, ...object}, (err, data) => {
                    if (err) {
                        console.error(`⚠️ Error fetching S3 Object ${object.Key} from ${Bucket.bucket}`);
                        reject(err);
                    } else {
                        console.log(`✔ Successfully fetched S3 Object ${object.Key} from ${Bucket.bucket}`);
                        s3_data[Bucket.bucket].push(
                            parse ?
                                meta ? (() => {
                                        data.Body = data.ContentType === "application/json" ?
                                            JSON.parse(data.Body.toString())
                                            : data.Body.toString();
                                        return data;
                                    })()
                                    : (() => {
                                        return data.ContentType === "application/json" ?
                                            JSON.parse(data.Body.toString())
                                            : data.Body.toString();
                                    })()
                                : meta ? data
                                : data.Body
                        )
                        resolve();
                    }
                });
            }));
        });
    });
    let AllPromised = Promise.all(promises);
    return new Promise(((resolve, reject) => {
        AllPromised.then((value => {
            resolve(s3_data)
        }))
    }));
};
