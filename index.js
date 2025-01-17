const Discord = require('discord.js');
const keep_alive = require('./keep_alive.js');

const client = new Discord.Client();
let intervalId;
let reminderInterval = 1800000; // Standaard interval van 30 minuten

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  // Start reminder automatically every day at a specific time
  startDailyReminder();
});

client.on('message', msg => {
  // Check if message isn't from us
  if (msg.author.bot) return;

  // Check if the message is in the "bing" channel
  if (msg.channel.name === 'bing') {
    const content = msg.content.toLowerCase();
    
    // Start sending messages with specified interval if message starts with "elke"
    if (content.startsWith('elke ')) {
      const milliseconds = parseInt(content.split(' ')[1]);
      if (!isNaN(milliseconds) && milliseconds > 0) {
        reminderInterval = milliseconds;
        msg.channel.send(`Interval voor herinnering is veranderd naar ${milliseconds} milliseconden.`);
        if (intervalId) {
          clearInterval(intervalId);
          startReminder(msg.channel);
        }
      } else {
        msg.channel.send('Ongeldige invoer. Gebruik: elke (milliseconden)');
      }
    } 
    // Start sending messages every 10 seconds if message is "start"
    else if (content === 'start') {
      startReminder(msg.channel);
    } 
    // Stop sending messages if message is "stop"
    else if (content === 'stop') {
      stopReminder(msg.channel);
    }
  } 
});

client.login(process.env.TOKEN);

function startReminder(channel) {
  if (!intervalId) {
    intervalId = setInterval(() => {
      channel.send('ZAZAZAZAZAZAZAZAZAZAZAZAZAZAZAZA');
    }, reminderInterval);
  } else {
    channel.send('GOD GOD GOOD GOD GOD');
  }
}

function stopReminder(channel) {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    channel.send('gestopt voor u');
  } else {
    channel.send('al gestopt 👌👍');
  }
}

function startDailyReminder() {
  // Time for the daily reminder (24-hour format, e.g., 10:00 is 10 hours)
  const reminderHour = 10; // Adjust this to the hour you want the reminder to start
  const reminderMinute = 0; // Adjust this to the minute you want the reminder to start

  // Get current date and time
  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  const currentMinute = currentDate.getMinutes();

  // Calculate milliseconds until next reminder time
  let timeUntilReminder = 0;

  if (currentHour < reminderHour || (currentHour === reminderHour && currentMinute < reminderMinute)) {
    const reminderTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), reminderHour, reminderMinute);
    timeUntilReminder = reminderTime.getTime() - currentDate.getTime();
  } else {
    const tomorrowReminderTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1, reminderHour, reminderMinute);
    timeUntilReminder = tomorrowReminderTime.getTime() - currentDate.getTime();
  }

  // Start the reminder after the calculated time
  setTimeout(() => {
    const bingChannel = client.channels.cache.find(channel => channel.name === 'bing');
    if (bingChannel) {
      startReminder(bingChannel);
    }
    // Schedule the next daily reminder
    startDailyReminder();
  }, timeUntilReminder);
}
