# Ride Tracker

## Inspiration
I am a cyclist and a software developer, I like to keep track of my activity progress and I like to talk about cycling. However, I find it hard to on any of the existing platforms to engage with your local community. From my experience being a _user_ of Strava, unless I started following people _by name_, my feed was just flooded with my own activities. My application is designed to make the user experience as smooth and easy as possible, while giving the user very detailed information from the data they've recorded.

I would be misguiding if I said this app _isn't_ inspired by existing and major fitness platforms such as Strava, but the goal isn't to create another fitness app just like every other existing fitness app. I have a vision of creating a platform for cyclists to come together and unite with local peers.

I very much dislike how the majority of all fitness apps require a recurring subscription in order to access _base_ data and functions. My goal is to provide a platform where you're not put behind a paywall to access your own routes that you recorded using the app.

## What it does
The main functionality is recording your bike rides but it comes with a variety of functions that is designed to make planning your bike rides much easier, as well as reviewing your performance. You can for example, record a bike ride, review the ride in 3d (or 2d) with real time performance stats, plan your rides ahead, receive randomized routes to try out so that you don't have to spend time finding the routes yourself, attach your different bikes to your rides and overview specific bike data, export all your rides as GPX format, etc.

## How we built it
The app is built using React Native together with an NodeJS server using the HTTP API. I used a https://linear.app/ board to stay focused on what stories and tasks I had to prioritize and wanted to implement. I think it helped keep me motivated throughout this project.

I'm not a fan of using thousands of depencies for a very small package so naturally, I only added packages with the core functions that I actually needed. I like to keep an eye on performance levels and to do so, I prefer to keep track of what's happening under the hood at all times.

This led to me implementing some components that I've extracted from the application and made into external packages for anyone to use; as a "competitor" to packages with hundreds or thousands of depencies. Some of these are:

### [react-native-webview-canvas](https://github.com/nora-soderlund/react-native-webview-canvas#readme)
React Native WebView Canvas is a component and function mapper between your React Native application and canvas' inside of a WebView component. It allows you to use the Canvas API without having to port the communication with a WebView yourself or use a second route to manage the WebView scripts.

### [@nora-soderlund/xml](https://github.com/nora-soderlund/xml#readme)
This is a paused package (due to shortage of time) but it's designed to both parse and print XML documents. The implementation of this came from the need of being able to export ride recordings as GPX (a common GPS formatted XML document) and the XML packages I found had over 1,500 dependents... I will be continuing to develop on this package after the submission of my project!

## Challenges we ran into
I come from no formal education but I have done web- and software development since I was in middle school and I now work professionally as a C# software developer. I have previously made some pretty large projects in JavaScript so I'm not new to that end, either way, my first challenge getting into this was learning the unique aspects and principles of React Native, some of which my mind really did not agree upon.

Otherwise, I came across a lot of challenges in the making of specific functions, some of which were rendering a 3d playback of bike rides. I came across a lot of technical restrictions that I had to bypass with a few tips and tricks I'm not a big fan of and I'll definitely look forward to refactoring these bits of codes.

The biggest challenge that I had to solve was changing the heading in the Google Maps platform while building extrusions were enabled which in most cases would cause large delta delays and I spent quite some time thinking about the logistics and reality of this specific feature and I came down to an "algorithym" that in the end works well enough for the current state of this project.

## Accomplishments that we're proud of

## What we learned

## What's next for Ride Tracker
