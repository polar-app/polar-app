export class Links {

    public static create(id: string, type: LinkType) {
        return `${type}:${id}`;
    }
    
}

export type LinkType = 'page' | 'comment' | 'pagemark' | 'note' | 'question' | 'flashcard' | 'text-highlight' | 'area-highlight';
