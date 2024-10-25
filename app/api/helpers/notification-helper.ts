import connectDB from "@/lib/mongo";
import Notifications from "@/models/notificationCollection";

import { getPusherInstance } from '@/lib/pusher/server';
const pusherServer = getPusherInstance();

connectDB();

export const sendNotification = async (title: string, description: string, senderid: string, receiverid: string, Type?: NotificationTypes | '', link?: string) => {
    try {
        const newNotification = new Notifications({
            Title: title,
            Description: description,
            SenderId: senderid,
            ReceiverId: receiverid,
            Type: Type || 'role-change',
            Link: link || null
        });
        const savedNotification = await newNotification.save();
        await pusherServer.trigger(
            `chanel-${receiverid}`,
            "notification",
            savedNotification
        );
        return savedNotification;
    } catch (error) {
        console.log("Error on sending notificaion..", error)
    }
}

export const removeNotification = async (receiverid: string, type: string) => {
    try {
        const deletedNotification = await Notifications?.findOneAndDelete({ ReceiverId: receiverid, type: 'head-change' });
        await pusherServer.trigger(
            `chanel-${receiverid}`,
            "remove-notification",
            deletedNotification
        )
    } catch (error) {
        console.log(error);
    }
}

export const sendTrigger = async (channel: string, event: NotificationTypes, data?: any) => {
    try {
        const body = await JSON.stringify({
            channel, event, data
        })
        const response = await fetch(`${process.env.COMM_SERVER_ADDRESS}/event-trigger`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: body,
        });
        console.log("Trigger Send!", response);
        return response;
    } catch (error) {
        console.log("Notification Error: ", error)
    }
}

