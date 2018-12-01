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

        return this.defaultPriority;

    }

    public abstract create(): JSX.Element;

}



