import * as React from "react"

const IMG = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8' standalone='no'%3F%3E%3Csvg width='256px' height='256px' viewBox='0 0 256 256' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' preserveAspectRatio='xMidYMid'%3E%3Cdefs%3E%3ClinearGradient x1='50%25' y1='0%25' x2='50%25' y2='100%25' id='linearGradient-1'%3E%3Cstop stop-color='%2358B0E3' offset='0%25'%3E%3C/stop%3E%3Cstop stop-color='%23F44E28' offset='100%25'%3E%3C/stop%3E%3C/linearGradient%3E%3C/defs%3E%3Cg%3E%3Ccircle fill='%23FFFFFF' cx='128' cy='128' r='128'%3E%3C/circle%3E%3Cpath d='M186.831132,49.2103774 L179.056603,49.2103774 L128.232075,122.662264 L127.767925,122.662264 L77.059434,49.2103774 L69.1688679,49.2103774 L123.938679,128.232075 L69.4009434,206.789622 L77.1754717,206.789622 L127.651886,133.569811 L128.116038,133.569811 L178.592453,206.789622 L186.483018,206.789622 L131.945283,128.232075 L186.831132,49.2103774 L186.831132,49.2103774 Z' fill='url(%23linearGradient-1)'%3E%3C/path%3E%3C/g%3E%3C/svg%3E";

interface IProps {
    readonly style?: React.CSSProperties;
    readonly className?: string;
    readonly alt?: string;
}

export default (props: IProps) => (
    <img src={IMG}
         style={props.style}
         className={props.className}
         alt={props.alt}
         />
);
