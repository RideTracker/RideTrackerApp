import ActivityAuthor from "./author";
import ActivityComment from "./comment";

import ActivityMap from "./map";
import ActivityMapStats from "./mapStats";
import ActivityStats from "./stats";

export default class Activity {
    static Author = ActivityAuthor;

    static Map = ActivityMap;
    static MapStats = ActivityMapStats;

    static Stats = ActivityStats;

    static Comment = ActivityComment;
};
