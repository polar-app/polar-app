import * as React from 'react';

export class Styles {

    public static BottomBar: React.CSSProperties = {
        display: 'flex'
    };

    public static BottomBarItem: React.CSSProperties = {
        marginTop: 'auto',
        marginBottom: 'auto',
    };

    public static BottomBarItemRight: React.CSSProperties = {
        marginTop: 'auto',
        marginBottom: 'auto',
        width: '100%'
    };

}

export type HtmlString = string;

export type FlashcardInputFieldsType = FrontAndBackFields | ClozeFields;

export interface ClozeFields {
    text: HtmlString;
}

export interface FrontAndBackFields {
    front: HtmlString;
    back: HtmlString;
}



