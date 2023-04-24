import { useNavigation, useSearchParams } from "expo-router";
import { useSelector } from "react-redux";
import Profile from "../profile/[userId]";
import { useEffect } from "react";
import { Alert } from "react-native";

export default function ProfilePage() {
    return (<Profile/>);
};
