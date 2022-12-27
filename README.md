# Ride Tracker

A mobile application to record and share bike activities, plan routes, and replay your rides! See also [Ride Tracker Server](https://github.com/nora-soderlund/RideTrackerServer#readme).

## Inspiration
I'm a big cyclist hobbyist and I love to keep track of my activities and look back at what sections I can try to improve on. I also love exploring new places and routes around me. I wanted to create a community where you can easily share your bike activities, thoughts, images, and videos. From my experience using fitness apps, the focus on the hobby part is very low and everything is very private. I wanted the community to be connected to an mobile application where you can do all of the technical stuff, such as planning your route, and I wanted it to be as straight forward as possible.

My goal is to also provide the user with all of the data and statistics they may want, and I don't want to hide the very basic statistics and data behind a paywall (such as being able to export your recorded rides in a GPX format, view your performance, etc).

## What it does
The main functionality is recording your bike rides but it comes with a variety of functions that is designed to make planning your bike rides much easier, as well as reviewing your performance. You can for example, record a bike ride, review the ride in 3d (or 2d) with real time performance stats, plan your rides ahead, receive randomized routes to try out so that you don't have to spend time finding the routes yourself, attach your different bikes to your rides and overview specific bike data, export all your rides as GPX format, etc.

## How we built it
The app is built using React Native and powered by Expo together with several native Node.js HTTP servers ("web server, production API, and demo API" proxied behind another web server). See [infrastructure visualization](https://github.com/nora-soderlund/RideTrackerServer#infrastructure). The servers are hosted on a Google Cloud virtual machine.

The application uses a total of 5 Google Maps Platform APIs:
#### Maps SDK for Android
Used in various ways in the mobile application, such as displaying an activity map thumbnail, full activity map, route planning (and drawing), route map thumbnail, etc.
#### Maps JavaScript API
Used to render the playback of activities. The JavaScript API was chosen over the Android API because technical limitations in the 3d playback implementation.
#### Roads API
Used to map match coordinates in an activity map to the closest roads within the accuracy radius.
#### Geocoding API
Used to reverse route planning coordinates to place identifiers to assist with the Directions API.
#### Directions API
Used to generate routes through by drawings or waypoints and then offer directions during the recording with a route.

I'm not a fan of using thousands of depencies for a very small package so naturally, I only added packages with the core functions that I actually needed. I like to keep an eye on performance levels and to do so, I prefer to keep track of what's happening under the hood at all times.

This led to me implementing some components that I've extracted from the application and made into external packages for anyone to use; as a "competitor" to packages with hundreds or thousands of depencies. Some of these are:

### [react-native-webview-canvas](https://github.com/nora-soderlund/react-native-webview-canvas#readme)
React Native WebView Canvas is a component and function mapper between your React Native application and canvas' inside of a WebView component. It allows you to use the Canvas API without having to port the communication with a WebView yourself or use a second route to manage the WebView scripts.

### [@nora-soderlund/xml](https://github.com/nora-soderlund/xml#readme)
This is a paused package (due to shortage of time) but it's designed to both parse and print XML documents. The implementation of this came from the need of being able to export ride recordings as GPX (a common GPS formatted XML document) and the XML packages I found had over 1,500 dependents - absolutely ridiculous.

## What's next for Ride Tracker
Ride Tracker is in the process of being published to the Google Play store, I've got a lot more of features and functions to implement before I plan on releasing it as an app.

![Ride Tracker](https://i.imgur.com/9yNnJBL.jpg)
