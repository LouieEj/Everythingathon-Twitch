# Everythingathon-Twitch
A timer for an "Everythingathon" for streaming platform Twitch.
The stream lasts as long as the timer does not hit 0, and different events adds more time to the timer.
An Everythingathon is similar to a Subathon, but in a Subathon only subscriptions add time to the timer, whereas in an Everythingathon other events add time too (following, cheering bits, donating, raiding).

## SETUP
## Create a Twitch Application
1. Head to [Twitch Developer Console Portal](https://dev.twitch.tv/console) and log in with your Twitch details.
2. Create an application by clicking `Register Your Application` from the `Dashboard` page.
3. Give the application a name and select `Chat Bot` as the category.
4. For the OAuth Redirect URL, enter `https://twitchapps.com/tokengen/`
5. Click `Create` to finish creating the Twitch application.

## Setup Node.js and download the source code
1. Download Node.js using the [installer on their website.](https://nodejs.org/en/download)
2. [Download the source code](https://github.com/LouieEj/Everythingathon-Twitch/archive/refs/heads/main.zip) for Everythingathon-Twitch.
3. Extract the files into a single folder.
4. Open a command prompt window in this directory (Shift + Right Click in the folder is an easy way to do this), and then type `npm install`.

## Setup the variables in .env file
1. Open the `.env` file, in the Everythingathon-Twitch directory, in a text editor.
2. To get `TMI_PASSWORD`: 
  - Go to [this website](https://twitchapps.com/tmi/) and click `Connect`.
  - Copy the provided OAuth password (e.g. `oauth:c6ababco2v8120abcd5ei3f315g5h`) and paste it in the speech marks for `TMI_PASSWORD` in the `.env` file.
3. To get `CLIENT_ID`:
  - Go to the [Twitch Developer Console Portal](https://dev.twitch.tv/console), find your Application, and click `Manage`.
  - Copy the value for `Client ID` (e.g. `ab5cd4efghij355kl6m1nop4q7038r`) and paste it in the speech marks for `CLIENT_ID` in the `.env` file.
4. To get `ACCESS_TOKEN`:
  - Go to [this website](https://twitchapps.com/tokengen/) and paste the Client ID you have previously found (step 3) in the appropriate input box.
  - In the scopes input box, enter: `moderator:read:followers bits:read channel:read:subscriptions` (make sure they are separated by spaces as shown).
  - Click connect, and then copy the provided Access Token (e.g. `a2bcd5efg1hijklmn3o2pqrstu2v2w`) into the speech marks for `ACCESS_TOKEN` in the `.env` file.
5. To get `SOCKET_TOKEN`:
  - Go to [Streamlabs API Settings page](https://streamlabs.com/dashboard#/settings/api-settings) and then click on `API Tokens`.
  - Copy the Socket API Token (it is very long, so no example given) and paste it in the speech marks for `SOCKET_TOKEN` in the `.env` file.

## CONFIGURATION
### Initial time
- You can set the time at which the timer will start at by inputting the time in seconds in the `time.txt` file.
  - e.g. if you want the timer to start at 10 hours, you would put set the value in `time.txt` to 36000, as there are 36000 seconds in 10 hours.

### Setting Twitch channel name
- Open `index.js` and set the constant `channelToMonitor` equal to the name of the channel for the Everythingathon (caps do not matter).
  - e.g. set `channelToMonitor = 'louieej'` if the Twitch channel for this Everythingathon is LouieEj.

### Setting a moderator's ID
- The user ID for a moderator of the channel for the subathon (which has just been set to `channelToMonitor`) needs to be provided.
  - To do this [go to this website](https://www.streamweasels.com/tools/convert-twitch-username-to-user-id/), type in the name of a moderator for the channel, and then copy and paste the user ID.

### Configure time for each event
- The time which gets added to the timer, in seconds, can be configured at the top of `index.js`.
  - IMPORTANT: Make sure all values are in seconds, e.g. 10 minutes should be the value 600.
- You can also specify the minimum Streamlabs donation amount which will add time to the timer; by default it is set to 0, which means any Streamlabs donation amount will add time.

## OBS SETUP
- Open OBS and create a new browser source.
- - Tick `Local File` and then navigate to the Everythingathon-Twitch directory, and choose the `index.html` file.
  - Set the width to 600 and the height to 180. Click OK.
- The timer should now display the time.
- NOTE: If the timer ever hits 0, the timer will stay at 0, even if the value in `time.txt` increases.
  - To force the timer to update in a situation like this, right click the Browser source, click `Properties`, scroll down and click `Refresh cache of current page`.

## RUNNING THE TIMER
- Go to the directory of the timer and open a command prompt/terminal window.
- Type `node index.js` and the timer should start running.
- If you ever need to stop the timer, you can press Control + C in the terminal window.
- When running the bot for an actual Everythingathon, and not for testing, you should set the value for `DEBUG_MODE` near the top of `index.js` to false.