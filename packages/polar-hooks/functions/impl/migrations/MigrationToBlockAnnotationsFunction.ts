import { ExpressFunctions } from "../../impl/util/ExpressFunctions";
import { MigrationToBlockAnnotations } from "polar-migration-block-annotations/src/MigrationToBlockAnnotations";

export const MigrationToBlockAnnotationsFunction
    = ExpressFunctions.createRPCHook('MigrationToBlockAnnotationsFunction', MigrationToBlockAnnotations.exec);
