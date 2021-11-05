import * as React from "react"

const IMG = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8' standalone='no'%3F%3E%3Csvg width='256px' height='257px' viewBox='0 0 256 257' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' preserveAspectRatio='xMidYMid'%3E%3Cg%3E%3Cpath d='M0,36.3573818 L104.619084,22.1093454 L104.664817,123.02292 L0.0955693151,123.618411 L0,36.3573818 Z M104.569248,134.650129 L104.650452,235.651651 L0.0812046021,221.274919 L0.0753414539,133.972642 L104.569248,134.650129 Z M117.25153,20.2454506 L255.967753,6.21724894e-15 L255.967753,121.739477 L117.25153,122.840723 L117.25153,20.2454506 Z M256,135.599959 L255.96746,256.791232 L117.251237,237.213007 L117.056874,135.373055 L256,135.599959 Z' fill='%2300ADEF'%3E%3C/path%3E%3C/g%3E%3C/svg%3E";

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
