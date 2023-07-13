import { Provider } from "react-native-maps";

export type User = {
    user?: {
        id: string;
        avatar: string;
        name: string;
        subscribed: boolean;
    };

    mapProvider: Provider;

    email?: string;
    token?: {
        key: string;
    };

    theme?: string;

    filters: {
        [filterType: string]: {
            key: string;
            value: any;
        }[];
    }
};
