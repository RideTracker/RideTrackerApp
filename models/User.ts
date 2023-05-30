export type User = {
    user?: {
        id: string;
        avatar: string;
        name: string;
    };

    key?: string;
    theme?: string;

    filters: {
        [filterType: string]: {
            [key: string]: string;
        }
    }
};
