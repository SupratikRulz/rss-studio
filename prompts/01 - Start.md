# Simple RSS Reader

## Architecture Overview
You need to build a NextJS based RSS Reader app which should be mobile responsive. You can take inspiration from this [image](https://feedly.com/_next/static/chunks/images/news-hero.c1b26866_3840.png) for desktop and mobile responsive design. Feel free to tweak tailwindcss colors to give a subtle minimal theme with white spaces. Use Geist font throughout the app. Use react-lucide icon pack for icon design throughout the app. Use localStorage or IndexDB to store the data. We will introduce auth later, so make a provision so that it can be migrated easily later with minimal changes. You are not allowed to use any external component library. Use zustand for state management and zod for schema validation. Use any xml parser for parsing RSS feed sources. Use free external apis for getting rss feeds - google news and other sources.

## Mandatory Requirements
- There should be a Today menu which should have 2 tabs - Me, Explore. Me tabs should display RSS feeds that I am subscribed to and Explore should show public RSS feeds.
- The RSS feed displayed should have headline, source, description, date and hero image. Clicking on the feed would take to the individual article in a seperate page but rendered within the app.
- The feed list should be able to view multiple feeds from different sources that are subscribed.
- The feed should have a bookmark button below which on clicked should be saved for that user.
- There should be Bookmark menu which should show all the feeds that are bookmarked. Allow users to delete from bookmark as well with a warning dialogbox.
- There should be a Follow Sources menu, which should allow users to add RSS using website or RSS link and add it to a folder. It should prompt user to Add it to specific folder or create new folder.
- There should be a Feeds menu which contains all the RSS feeds organised by Folders it is added to. Should contain a small + sign to add a folder and - sign to delete a folder.
- Social buttons like Facebook Like, Tweet, Share or Email with icons should be present for sharing the articles
