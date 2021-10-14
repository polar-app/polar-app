import {ExpressFunctions} from "../../impl/util/ExpressFunctions";
import {Polar3DocMetaMigrator} from "./Migrator";

export const Polar3DocMetaMigratorFunction = ExpressFunctions.createRPCHook(
    'Polar3DocMetaMigratorFunction',
    Polar3DocMetaMigrator.exec,
);
