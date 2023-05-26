# Everythingathon-Twitch
A timer for an "Everythingathon" for streaming platform Twitch.
The stream lasts as long as the timer does not hit 0, and different events adds more time to the timer.
An Everythingathon is similar to a Subathon, but in a Subathon only subscriptions add time to the timer, whereas in an Everythingathon other events add time too (following, cheering bits, donating, raiding).

# SETUP
1. Download Node.js using the [installer on their website.](https://nodejs.org/en/download)
2. [Download the source code](https://github.com/LouieEj/Everythingathon-Twitch/archive/refs/heads/main.zip) for Everythingathon-Twitch.
3. Extract the files into a single folder.
4. Open a command prompt window in this directory (Shift + Right Click in the folder is an easy way to do this), and then type `npm install`.
5. Open the `.env` file in a text editor program and set all attributes to the required values.

# CONFIGURATION
## Initial time
- You can set the time at which the timer will start at by inputting the time in seconds in the `time.txt` file.
  - e.g. if you want the timer to start at 10 hours, you would put set the value in `time.txt` to 36000, as there are 36000 seconds in 10 hours.

## Setting Twitch channel name
- Open `index.js` and set the constant `channelToMonitor` equal to the name of the channel for the Everythingathon (caps do not matter).
  - e.g. set `channelToMonitor = 'louieej'` if the Twitch channel for this Everythingathon is LouieEj.

## Setting a moderator's ID
- The user ID for a moderator of the channel for the subathon (which has just been set to `channelToMonitor`) needs to be provided.
  - To do this [go to this website](https://www.streamweasels.com/tools/convert-twitch-username-to-user-id/), type in the name of a moderator for the channel, and then copy and paste the user ID.

## Configure time for each event
- The time which gets added to the timer, in seconds, can be configured at the top of `index.js`.
  - IMPORTANT: Make sure all values are in seconds, e.g. 10 minutes should be the value 600.
- You can also specify the minimum Streamlabs donation amount which will add time to the timer; by default it is set to 0, which means any Streamlabs donation amount will add time.

# OBS SETUP
- Open OBS and create a new browser source.
- - Tick `Local File` and then navigate to the Everythingathon-Twitch directory, and choose the `index.html` file.
  - Set the width to 600 and the height to 180. Click OK.
- The timer should now display the time.
- NOTE: If the timer ever hits 0, the timer will stay at 0, even if the value in `time.txt` increases.
  - To force the timer to update in a situation like this, right click the Browser source, click `Properties`, scroll down and click `Refresh cache of current page`.

# RUNNING THE TIMER
- Go to the directory of the timer and open a command prompt/terminal window.
- Type `node index.js` and the timer should start running.
- If you ever need to stop the timer, you can press Control + C in the terminal window.
