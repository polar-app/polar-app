export class LoadingBar {

    public create(): void {

        let progress = document.createElement('progress');
        progress.style.height=`40px`;
        progress.style.width=`100%`;


        ///progress.style.backgroundColor='#89ADFD';
        //progress.style.color='#89ADFD';
        progress.style.position='absolute';
        progress.style.top='0';
        progress.style.left='0';
        progress.style.zIndex='99999999999';

        document.body.appendChild(progress);

    }

}
