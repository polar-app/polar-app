import {Construct, RemovalPolicy} from "@aws-cdk/core";
import {Domain} from "@aws-cdk/aws-elasticsearch";
import {ElasticsearchVersion} from "@aws-cdk/aws-elasticsearch/lib/domain";

export class ElasticSearch extends Construct {

    constructor(scope: Construct, id: string) {
        super(scope, id);

        const cluster = new Domain(this, 'Domain', {

            // Define version of ElasticSearch to use
            // Changing this will force ES cluster replacement
            // which means data loss. If you just want to enable version upgrades,
            // @see `enableVersionUpgrade: true,`
            version: ElasticsearchVersion.V7_10,

            capacity: {
                masterNodes: 0,
                masterNodeInstanceType: "i3.large.elasticsearch",

                dataNodes: 1,
                dataNodeInstanceType: "i3.large.elasticsearch",
            },

            ebs: {
                // "i3" and "r6gd" instance classes do not support EBS volumes
                // Instead, they come with their own fixed NVMe drive attached with fixed GBs
                // @see https://aws.amazon.com/opensearch-service/pricing/
                // If we fail to disable EBS volumes here, CDK deployment errors out
                enabled: false,
            },

            // Prevent accidental deletions
            removalPolicy: RemovalPolicy.RETAIN,

            logging: {
                slowSearchLogEnabled: true,
                auditLogEnabled: true,
                slowIndexLogEnabled: true,
            },

            fineGrainedAccessControl: {
                masterUserName: 'admin',
            },

            useUnsignedBasicAuth: true,

            // require that all traffic to the domain arrive over HTTPS.
            enforceHttps: true,

            // This requires an even number of "data nodes", so 2, 4, 6, etc
            // zoneAwareness: {enabled: true},
        })
    }
}
