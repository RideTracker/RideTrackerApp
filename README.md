# Ride Tracker

## Inspiration
I am a cyclist and a software developer, I like to keep track of my activity progress and I like to talk about cycling. However, I find it hard to on any of the existing platforms to engage with your local community. From my experience being a _user_ of Strava, unless I started following people _by name_, my feed was just flooded with my own activities. My application is designed to make the user experience as smooth and easy as possible, while giving the user very detailed information from the data they've recorded.

I would be misguiding if I said this app _isn't_ inspired by existing and major fitness platforms such as Strava, but the goal isn't to create another fitness app just like every other existing fitness app. I have a vision of creating a platform for cyclists to come together and unite with local peers.

I very much dislike how the majority of all fitness apps require a recurring subscription in order to access _base_ data and functions. My goal is to provide a platform where you're not put behind a paywall to access your own routes that you recorded using the app.

## What it does

## How we built it
The app is built using React Native together with an NodeJS API server using the HTTP API.

I'm not a fan of using thousands of depencies for a very small package so naturally, I only added packages with the core functions that I actually needed. I like to keep an eye on performance levels and to do so, I prefer to keep track of what's happening under the hood at all times.

This led to me implementing some components that I've extracted from the application and made into external packages for anyone to use; as a "competitor" to packages with hundreds or thousands of depencies. Some of these are:

### [react-native-webview-canvas](https://github.com/nora-soderlund/react-native-webview-canvas#readme)
React Native WebView Canvas is a component and function mapper between your React Native application and canvas' inside of a WebView component. It allows you to use the Canvas API without having to port the communication with a WebView yourself or use a second route to manage the WebView scripts.

### [@nora-soderlund/xml](https://github.com/nora-soderlund/xml#readme)

## Challenges we ran into
I come from no formal education but I have done web- and software development since I was in middle school and I now work professionally as a C# software developer. I had never done app development before this, so the first challenge was to learn React Native and get the hang of it.

...

## Accomplishments that we're proud of

## What we learned

## What's next for Ride Tracker
