import {ConditionalSetting} from '../../../../../web/js/ui/util/ConditionalSetting';
import {PrioritizedComponentRef} from '../../../../../web/js/ui/prioritized/PrioritizedComponentManager';

export abstract class ConditionalPrioritizedComponentRef implements PrioritizedComponentRef {

    protected readonly settingKey: string;

    protected readonly defaultPriority: number;

    constructor(settingKey: string, defaultPriority: number) {
        this.settingKey = settingKey;
        this.defaultPriority = defaultPriority;
    }

    public priority(): number | undefined {

        const conditionalSetting = new ConditionalSetting(this.settingKey);

        if (conditionalSetting.get().getOrElse('') === 'do-not-show-again') {
            return undefined;
        }

        if (conditionalSetting.get().getOrElse('') !== '') {

            // see if it's an integer

            const val = conditionalSetting.get().getOrElse('');

            if (val.match(/[0-9]+/)) {

                if (Date.now() > parseInt(val)) {
                    return this.defaultPriority;
                } else {
                    return undefined;
                }

            }

        }

        return this.defaultPriority;

    }

    public abstract create(): JSX.Element;

}



