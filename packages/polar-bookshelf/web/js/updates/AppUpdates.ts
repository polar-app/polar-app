import {Platform, Platforms} from 'polar-shared/src/util/Platforms';
import {DistConfig} from '../dist_config/DistConfig';

export class AppUpdates {

    public static platformSupportsUpdates() {

        return [Platform.MACOS, Platform.WINDOWS].includes(Platforms.get()) && DistConfig.ENABLE_UPDATES;

    }

}
