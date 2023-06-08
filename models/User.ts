import { Provider } from "react-native-maps";

export type User = {
    user?: {
        id: string;
        avatar: string;
        name: string;
    };

    mapProvider: Provider;

    key?: string;
    theme?: string;

    filters: {
        [filterType: string]: {
            key: string;
            value: string;
        }[];
    }
};
