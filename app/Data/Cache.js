import API from "app/Services/API";

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

    static activityComment = [];

    static async getActivityComment(comment) {
        let activityComment = this.activityComment.find(x => x.comment == comment);

        if(!activityComment) {
            const data = (await API.get("/api/activity/comment", { comment })).content;
            data.user = (await this.getUser(data.user));
            
            activityComment = {
                comment,

                data
            };

            this.activityComment.push(activityComment);
        }

        return activityComment.data;
    };

    static activityComments = [];

    static async getActivityComments(activity, forceRefresh = false) {
        if(forceRefresh)
            this.activityComments = this.activityComments.filter(x => x.activity != activity);

        let activityComments = this.activityComments.find(x => x.activity == activity);

        if(!activityComments) {
            const data = (await API.get("/api/activity/comments", { activity })).content;
            
            activityComments = {
                activity,

                data
            };

            this.activityComments.push(activityComments);
        }

        return activityComments.data;
    };

    static activityRide = {};

    static async getActivityRide(id) {
        if(this.activityRide[id] == undefined)
            this.activityRide[id] = (await API.get("/api/activity/map?id=" + id)).content;

        return this.activityRide[id];
    };
    
    static user = [];

    static async getUser(id, forceRefresh = false) {
        if(forceRefresh)
            this.user = this.user.filter(x => x.id != id);

        let user = this.user.find(x => x.id == id);

        if(user == null) {
            const data = await API.get("/api/user", { id });

            user = data.content;

            this.user.push(user);
        }

        return user;
    };
};
