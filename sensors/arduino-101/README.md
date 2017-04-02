# Arduino 101

This demo is built from the Evothings samples for the TI-SensorTag, as well as [Greg V's example](https://create.arduino.cc/projecthub/gov/imu-to-you-ae53e1).

It will stream acceleration and gyroscope data from the 101's inbuilt IMU via Bluetooth Low Energy (BLE) to a mobile web app.

# Setup

## Arduino

Write the Arduino script to your 101. On line 124, change the local name to something to identify your board. Keep in mind you can only use a few characters. Keep the Arduino powered via USB power or whatever.

## On your mobile device

Install 'Evothings Viewer' or 'CGTek Viewer' for your Android or iOS phone or tablet. Start it up and it will prompt for a 'connect key'.

## Evothings

1. Install [Evothings Studio](https://evothings.com/download)
2. Boot it up, and select 'New' from the tabs. Make a note of the folder name, and copy the _contents_ of the 'evothings' directory into it, overwriting existing files
3. Edit 'client.js' and set `client.TAG_NAME` to be the same as the tag name used in your Arduino code.
4. Jump to the 'Connect' tab, and press 'Get Key'. This is the key you'll need to plug into the viewer running on your mobile app
5. Click 'Run' for your project into Evothings. This will deploy your code to a web-accessible location so your mobile device (or someone else's) can access it
6. After entering the key and tapping 'Connect', you should see your web app running.

* The 'Tools' menu option in Evothings lets you see `console.log` messages from your web app.
* Evothings will automatically update the mobile viewer when you make changes to your code



