import { ExpressFunctions } from "../../impl/util/ExpressFunctions";
import { MigrationToBlockAnnotations } from "./MigrationToBlockAnnotations";

export const MigrationToBlockAnnotationsFunction
    = ExpressFunctions.createRPCHook('MigrationToBlockAnnotationsFunction', MigrationToBlockAnnotations.exec);
