export type SearchPrediction = {
    name: string;
    description?: string;
    placeId?: string;
    location?: {
        latitude: number;
        longitude: number;
    };
};
