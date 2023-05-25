//Created by Louie: https://github.com/LouieEj


//------------------------- GLOBAL VARIABLES TO EDIT -------------------------//
//scopes: moderator:read:followers bits:read channel:read:subscriptions
const channelToMonitor = 'louieejay';
const followersIDCSV = 'followersID.csv'; //CSV file should be downloaded just before start of Everythingathon
                                        //can be downloaded from: https://twitch-tools.rootonline.de/followerlist_viewer.php
const moderatorID = '783929864'; //a moderator's ID is needed to be able to subscribe to event subs
                                 //can be fetched using: https://twitch-tools.rootonline.de/followerlist_viewer.php

//Configure the amount of seconds each event adds to the timer
const followersTime = 60; //60 seconds add to the timer when someone new follows
const tier1SubsTime = 300; //5 mins for tier 1 subs
const tier2SubsTime = 600; //10 mins for tier 2 subs
const tier3SubsTime = 900; //15 mins for tier 3 subs
const cheer100Time = 60; //1 minute for 100 bits - scales with number of bits, e.g. 500 bits will be 5 mins, 1000 bits will be 10 mins, etc
const secondsPerViewerFromRaid = 1; //1 second gets added to the timer per viewer that was part of a raid, e.g. raid with 100 viewers will add 100 secs
const donation1PoundTime = 60; //1 minute for £1 donated - scales with amount donated, e.g. £5 donated will be 5 mins, £10 will be 10 mins, etc
const minimumDonationAmountToAddTime = 0; //Only adds time to the timer when more than this amount has been added...
                                          //..by default, there is no minimum, so even if a user donates £0.01, 1 second will be added



//------------------------- CODE -------------------------//
require("dotenv").config();

// ----- GLOBAL VARIABLES DO NOT EDIT ----- //
var timerSpeed = 1000;

//Add time function
const timeScript = require('./timeScript');
function addToTimer(time){
    timeScript.addTime(time);
}

//Update time loop (every X seconds, determined by timerSpeed [default = 1000ms/1 second])
let run = setInterval(() => {
    timeScript.updateTime();
}, timerSpeed);


//TMI library used to communicate with Twitch chat (mainly for commands)
const tmiLib = require('tmi.js');

//Configure Twitch chat bot connection
const tmi = new tmiLib.Client({
    channels: [channelToMonitor],
    identity:{
        username: channelToMonitor,
        password: `oauth:${process.env.TMI_PASSWORD}`
    },
    options: {debug: true}
})

// ----- COMMANDS ----- //
tmi.on('chat', (channel, userstate, message, self) => {
    if (!self && userstate.mod){
        //Check that bot is awake, or get help
        if (message.split(' ')[0] == "!everythingathon"){
            if (message.split(' ').length > 1){
                if (message.split(' ')[1].toLowerCase() == "help" || message.split(' ')[1].toLowerCase() == "h"){
                    console.log(
                        `!starttimer - start the timer, if it is paused -- timer started by default\n
                        !pausetimer - pause the timer, if it is running\n
                        !settimer <DD:HH:MM:SS> (e.g. !settime 01:02:12:58) - sets the timer's time to the one provided - MUST follow format DD:HH:MM:SS\n
                        !addmins <minutes> - use to add minutes (integer) to the timer\n
                        !addsecs <seconds> - use to add seconds (integer) to the timer\n
                        !subtractmins <minutes> - use to subtract minutes (integer) from the timer\n
                        !subtractsecs <seconds> - use to subtract seconds (integer) from the timer\n
                        !followbots <number_of_bots> - use to subtract the amount of time that was added from X number of follow bots\n
                        !setspeed <seconds> - use to set how quickly the timer\n`);
                }
            }
            else{
                tmi.say(channel, "Everythingathon Bot is awake! To get help with the bot, use: !everythingathon help");
            }
            console.log("Bot is awake!");
        }

        //!starttimer - start the timer, if it is paused
        if (message == "!starttimer"){
            timeScript.startTimer();
            tmi.say(channel, "Timer started!");
        }

        //!pausetimer - pause the timer, if it is running
        if (message == "!pausetimer"){
            timeScript.pauseTimer();
            tmi.say(channel, "Timer paused!");
        }

        //!settime <DD:HH:MM:SS> - sets the timer's time to the one provided
        if (message.split(' ')[0].toLowerCase() == "!settimer"){
            try{
                let timerTime = message.split(' ')[1].toString();
                if(timerTime.split(':').length == 4){
                    let days = parseInt(timerTime.split(':')[0]);
                    let hours = parseInt(timerTime.split(':')[1]);
                    let mins = parseInt(timerTime.split(':')[2]);
                    let seconds = parseInt(timerTime.split(':')[3]);

                    let totalSeconds = (days * 86400) + (hours * 3600) + (mins * 60) + seconds;
                    timeScript.setTimer(totalSeconds);
                    tmi.say(channel, `Updated the timer to ${timerTime} successfully!`);
                }
                else{
                    tmi.say(channel, "Please input a valid time in the format DD:HH:MM:SS");
                }
            }
            catch{
                tmi.say(channel, "Please input a valid time in the format DD:HH:MM:SS");
            }
        }

        //!addmins <minutes> - command to add minutes to timer
        if (message.split(' ')[0].toLowerCase() == "!addmins"){
            try{
                let minutes = parseInt(message.split(' ')[1]);
                console.log(minutes);
                if (Number.isInteger(minutes)){
                    let seconds = minutes * 60;
                    addToTimer(seconds);
                    tmi.say(channel, `Added ${minutes} minutes to the timer!`);
                }
                else{
                    tmi.say(channel, "USER ERROR: Please input a valid number for minutes!");
                }
            }
            catch{
                tmi.say(channel, "SYSTEM ERROR: Please input a valid number for minutes!");
            }
        }

        //!addsecs <seconds> - command to add seconds to timer
        if (message.split(' ')[0].toLowerCase() == "!addsecs"){
            try{
                let seconds = parseInt(message.split(' ')[1]);
                if (Number.isInteger(seconds)){
                    addToTimer(seconds);
                    tmi.say(channel, `Added ${seconds} seconds to the timer!`)
                }
                else{
                    tmi.say(channel, "USER ERROR: Please input a valid number for seconds!");
                }
            }
            catch{
                tmi.say(channel, "SYSTEM ERROR: Please input a valid number for seconds!");
            }
        }

        //!subtractmins <minutes> - use to subtract minutes (integer) from the timer
        if (message.split(' ')[0].toLowerCase() == "!subtractmins"){
            try{
                let minutes = parseInt(message.split(' ')[1]);
                console.log(minutes);
                if (Number.isInteger(minutes)){
                    let seconds = minutes * 60;
                    addToTimer(Math.abs(seconds) * -1);
                    tmi.say(channel, `Subtracted ${minutes} minutes from the timer!`);
                }
                else{
                    tmi.say(channel, "USER ERROR: Please input a valid number for minutes!");
                }
            }
            catch{
                tmi.say(channel, "SYSTEM ERROR: Please input a valid number for minutes!");
            }
        }

        //!subtractsecs <seconds> - use to subtract seconds (integer) from the timer
        if (message.split(' ')[0].toLowerCase() == "!subtractsecs"){
            try{
                let seconds = parseInt(message.split(' ')[1]);
                if (Number.isInteger(seconds)){
                    addToTimer(Math.abs(seconds) * -1);
                    tmi.say(channel, `Subtracted ${seconds} seconds from the timer!`)
                }
                else{
                    tmi.say(channel, "USER ERROR: Please input a valid number for seconds!");
                }
            }
            catch{
                tmi.say(channel, "SYSTEM ERROR: Please input a valid number for seconds!");
            }

        }

        //!followbots <number_of_bots> - use to subtract the amount of time that was added from X number of follow bots
        if (message.split(' ')[0].toLowerCase() == "!followBots"){
            try{
                let numOfFollowers = parseInt(message.split(' ')[1]);
                if (Number.isInteger(numOfFollowers)){
                    let seconds = followersTime * numOfFollowers;
                    addToTimer(Math.abs(seconds) * -1);
                    tmi.say(channel, `Subtracted ${seconds} seconds from the timer, equivalent of ${numOfFollowers} follows!`)
                }
                else{
                    tmi.say(channel, "USER ERROR: Please input a valid number for number of bots followed!");
                }
            }
            catch{
                tmi.say(channel, "SYSTEM ERROR: Please input a valid number for number of bots followed!");
            }
        }

        //!setspeed <seconds> - use to set how quickly the timer decreases by 1 second; seconds = 1 will decrease every second, seconds = 2 will decrease every 2 seconds, etc
        if (message.split(' ')[0].toLowerCase() == "!setspeed"){
            try{
                let speed = parseInt(message.split(' ')[1]);
                if (Number.isInteger(speed)){
                    timerSpeed = speed * 1000;
                    clearInterval(run);
                    run = setInterval(() => {
                        timeScript.updateTime();
                    }, timerSpeed);
                    tmi.say(channel, `Success! Timer will now go down 1 second every ${speed} second(s).`)
                }
                else{
                    tmi.say(channel, "USER ERROR: Please input a valid number for the speed to decrease a second from the timer!");
                }
            }
            catch{
                tmi.say(channel, "SYSTEM ERROR: Please input a valid number for the speed to decrease a second from the timer!");
                console.log(channel, "SYSTEM ERROR: Please input a valid number for the speed to decrease a second from the timer!");
            }
        }
    }
})

// ---- COMMENTED OUT AS TWITCH API CAN HANDLE RAIDS ---- //
// // ----- Raids ----- //
// //uses tmi library to read when a raid occurs
// tmi.on("raided", (channel, username, viewers) => {
//     console.log(channel, `raid detected by ${username} with ${viewers} viewers!`);
//     //Increase timer by X amount
//     addToTimer(viewers * secondsPerViewerFromRaid);
// })

//Connect TMI client to the channel specified
tmi.connect();




// ----- DONATIONS THROUGH STREAMLABS ----- //
//requires socket.io client
const io = require('socket.io-client')
const streamlabs = io(`https://sockets.streamlabs.com?token=${process.env.SOCKET_TOKEN}`, {transports: ['websocket']});

streamlabs.on('event', (eventData) => {
    //subscribe to StreamLabs Socket API endpoint for donations
    if (!eventData.for && eventData.type == 'donation'){
        try{
            let result = JSON.parse(eventData.message);
            console.log(result);
            const currency = eventData.message.currency;
            const amount = eventData.message.amount;
            try{
                const CC = require('currency-converter-lt');
                let currencyConverter = new CC({from:"USD", to: "GBP", amount: 1.3});
                currencyConverter.convert().then((res) =>{
                    //Round converted value to 2 decimals
                    console.log(res.toFixed(2));
                    if (res > minimumDonationAmountToAddTime){
                        let seconds = donation1PoundTime * res.toFixed(2);
                        addToTimer(seconds);
                    }
                })
            }
            catch{
                console.log("Error reading/converting currency from StreamLabs donation!");
            }

        }
        catch{
            console.log("Error getting donation amount!");
        }
    }
})





//Twitch API used for followers, subscriptions, cheers
const request = require("request");

//Access token expires after 60 days
var accessToken = process.env.ACCESS_TOKEN;

//Get UserID using Twitch username (channelToMonitor)
var userID = '';
function getID(){
    console.log(`Attempting to get user ID for ${channelToMonitor}...`)
    request(`https://api.twitch.tv/helix/users?login=${channelToMonitor}`, {
        headers: {
        'Authorization': 'Bearer ' + accessToken,
        'Client-ID': process.env.CLIENT_ID
        },
    },(err,res,body) => {
        if(err){    
            return console.log(err);
        }
        console.log(`   Status: ${res.statusCode}`);
        userID = JSON.parse(body).data[0].id;
        console.log(`   UserID for ${channelToMonitor}: ${userID}`);
        startListener();
    });
}

getID(); //Initial function call to start follower monitoring

//Set up objects to communicate with Twurple library...
//...for authentication,
const twurpleAuth = require('@twurple/auth');
const authProvider = new twurpleAuth.StaticAuthProvider(process.env.CLIENT_ID, process.env.ACCESS_TOKEN);
//for the Twitch API communication,
const twurpleApi = require('@twurple/api');
const apiClient = new twurpleApi.ApiClient({authProvider});
//for Twitch API Event Sub endpoints.
const twurpleEventSub = require('@twurple/eventsub-ws');
const listener = new twurpleEventSub.EventSubWsListener({apiClient});

//All listener functions are emplaced in a separate function, which is only called after the user ID of channelToMonitor has been fetched
function startListener(){
    // ---- FOLLOW EVENT ---- //
    listener.onChannelFollow(userID, userID, e =>{
        console.log(`TWURPLE: ${e.userDisplayName} (${e.userId}) just followed!`);
        readFollowersID(e.userId, e.userDisplayName);
        addToTimer(followersTime);
    })

    // ---- CHEER/BITS EVENT ---- //
    listener.onChannelCheer(userID, moderatorID, e => {
        console.log(`TWURPLE: ${e.bits} were cheered by ${e.userDisplayName}`);
        addToTimer(Math.round(cheer100Time * (e.bits / 100)))
    })
    
    // ---- SUB EVENT ---- //
    listener.onChannelSubscription(userID, moderatorID, e =>{
        console.log(`TWURPLE: ${e.userDisplayName} (${e.userId}) just subscribed with tier: ${e.tier}`);
        if (e.tier == 1000){
            addToTimer(tier1SubsTime);
        }
        if (e.tier == 2000){
            addToTimer(tier2SubsTime);
        }
        if (e.tier == 3000){
            addToTimer(tier3SubsTime);
        }
    })
    
    // ---- RAID EVENT ---- //
    listener.onChannelRaidFrom(userID, moderatorID, e =>{
        console.log(`TWURPLE: ${e.userDisplayName} (${e.userId}) just raided with ${e.viewers} viewers!`);
        addToTimer(secondsPerViewerFromRaid * e.viewers);
    })

    listener.start();
}


// ----- Unique follower checker ----- //
//Functionality:
//  1) Subscribed to Twitch Event Sub - when a new follower followers, run following code:
//  2) Fetch the new follower's ID and check if it already exists in the CSV of follower's IDs
//  3) If user(s) hasn't followed before (their ID is not in the CSV file), adds time to the timer, and adds the user's ID to the CSV file

//Read the ID of all followers from CSV file, to check if the user has already followed before (prevent follow exploit)
var found = false;
const csv = require('csv-parser');
const fs = require('fs');
async function readFollowersID(followerID, followerUsername){
    console.log(`   Attempting to read followers ID from ${followersIDCSV}...`)
    try{
        fs.createReadStream(followersIDCSV)
        .pipe(csv())
        .on('data', (row) => {
          if (row.ID == followerID){
            //new follower has already followed (their ID is in the CSV file)
            found = true;
          }
        })
        .on('end', () =>{
            if(found){
                console.log(`       ${followerUsername} (${followerID}) has already followed!`);
                found = false;
            }
            else{
                console.log(`       Attemping to add the new follower's ID to ${followersIDCSV}...`)
                try{
                    //Write the follower's ID to followers ID csv file
                    fs.appendFile(followersIDCSV, followerID + '\r\n', (err) =>{
                        if (err) throw err;
                        console.log(`           Successfully added ${followerUsername}'s ID (${followerID}) to ${followersIDCSV}`);
                        //Add time to timer
                        addToTimer(60);
                    })
                }
                catch (e){
                    console.log(`           An error occured when writing to ${followersIDCSV}: ` + e);
                }
            }
        });
    }
    catch{
        console.log(`   Cannot find the file ${followersIDCSV} in the root directory!`);
    }
}