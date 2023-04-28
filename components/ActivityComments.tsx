import { useEffect, useState } from "react";
import { View } from "react-native";
import { getActivityComments } from "../models/activity";
import { useUser } from "../modules/user/useUser";

type ActivityCommentsProps = {
    id: string;
};

export default function ActivityComments(props: ActivityCommentsProps) {
    const { id } = props;

    const user = useUser();

    const [ comments, setComments ] = useState<any | null>(null);

    useEffect(() => {
        getActivityComments(user.key, id).then((result) => {
            if(!result.success)
                return;

            setComments(result.comments);
        });
    });

    return (
        <View>

        </View>
    );
};
