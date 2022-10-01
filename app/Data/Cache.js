import API from "app/API";

export default class Cache {
    static activity = [];

    static async getActivity(id) {
        let activity = this.activity.find(x => x.id == id);

        if(activity == null) {
            const data = await API.get("/api/activity", { id });

            activity = data.content;

            this.activity.push(activity);
        }

        return activity;
    };

    static activityComments = [];

    static async getActivityComments(activity) {
        let activityComments = this.activityComments.find(x => x.activity == activity);

        if(activityComments == null) {
            activityComments = (await API.get("/api/activity/comments", { activity })).content;

            this.activityComments.push(activityComments);
        }

        return activityComments;
    };

    static activityRide = {};

    static async getActivityRide(id) {
        if(this.activityRide[id] == undefined)
            this.activityRide[id] = (await API.get("/api/activity/map?id=" + id));

        return this.activityRide[id];
    };
    
    static user = [];

    static async getUser(id) {
        let user = this.user.find(x => x.id == id);

        if(user == null) {
            const data = await API.get("/api/user", { id });

            user = data.content;

            this.user.push(user);
        }

        return user;
    };
};
