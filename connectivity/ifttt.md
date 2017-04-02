# Using IFTTT for prototyping

[IFTTT](https://ifttt.com) (IF This Then That) is a free workflow service allowing you to interconnect various apps, devices and network-hosted services.

In this system, workflows are called _applets_, and can be published and made available to others. But it's our purpose to create our own applet.

Applets get _triggered_ after which they perform an _action_ with a _service_. 

Example applets are:
* When the text message 'lost' is received, turn the ringer of the phone to full volume
* When I get home, turn off the wifi on my phone
* Upload any Instagram photos I take to Facebook

Some things to keep in mind:
* Most of the fun controlling-the-phone stuff only works for Android devices.
* IFTTT is not meant for high-volume triggers, but for triggering every minute or so

It's a good idea to sign up for an IFTTT account, and install it on your mobile device, also using the same account.

# Manual triggering

Steps to create a new applet:

1. Make a new applet 
2. Use the 'Maker Webhooks' service as the _if_ part of your applet
3. Select 'Receive a web request'
4. Assign a useful event name, and click 'Create Trigger'

The next stage is to assign what happens when you trigger the applet. When you trigger your applet, you can pass up to four values to it which can be incorporated into how the applet behaves.

As an example, choose the 'Notifications' action. This is useful for testing as it shows a visual notification when the applet is triggered.

You'll see default notification text:

```
    The event named "{{EventName}}" occurred on the Maker service
```

Variables, such as {{EventName}} are automatically replaced with the specifics of the trigger. Clicking on _+Ingredient_ allows you to see other variables on offer. Most useful are the value variables. Try changing the notification to:

```
    {{EventName}} 1: {{Value1}} 2: {{Value2}}
```

And then click 'Create action', followed by 'Finish'.

After this, you need to get the particulars of your Maker Webhooks service. Tap on your user settings (top-right of screen), select _Services_ and then _Maker Webhooks settings_. In the _Account Info_ section, you'll see a URL like:

    https://maker.ifttt.com/user/{key}

Copy that URL and open it in a new tab. You'll see an information page about your servie. It shows you how to trigger the event and pass values to it.

To test, you can trigger your applet from another tab. Recall your event name that you assigned earlier, and the key shown here. Construct a URL as it suggests, replacing the {} stuff with whatever is relevant (don't include the curly braces).

    https://maker.ifttt.com/trigger/{event}/with/key/{key}

Now, since we're going to manually trigger it via a GET request, we can add URL parameters:

    https://maker.ifttt.com/trigger/{event}/with/key/{key}?value1=apple&value2=orange

When you visit the URL, you should get a simple success message displayed. After a moment your device will show the notification. Success!

# Triggering with code

We don't want to be accessing URLs manually, it would be much better to trigger it in response to something else, whenever we determine.

Rather than notifying IFTTT from client-side code, which might be restricted by security policies, the strategy instead is to post data back to the server, and have the server notify IFTTT.

In `ifttt-post.js`, the `trigger` method takes care of posting to its server:

```
function trigger(eventName, value1, value2) {
  $.post('/trigger', {
    eventName: eventName,
    value1:    value1,
    value2:    value2
  });
```

And then in the server, we handle the POSTed data:

```
app.post("/trigger", function (req, res) {
  if (!req.body.eventName) throw new Error("eventName missing");
  var postData = {
    value1: req.body.value1,
    value2: req.body.value2,
  }
  var url = "https://maker.ifttt.com/trigger/" + req.body.eventName + "/with/key/" + process.env.IFTTT_KEY;
  
  // Make a POST request to IFTTT
  request.post(url, {form:postData});
  res.sendStatus(200);
  
});
```


# Activating code from IFTTT

You can also trigger your own code from IFTTT.

1. Make a new applet, setting the _this_ to be what ever you want to trigger your code, eg 'Camera Widget'
2. For the _that_, select 'Maker Webhooks', and then 'Make a web request'
3. Put in the URL of your endpoint, select 'POST' method, set Content Type to 'application/json'
4. Now in the body, list the key value pairs you want to send. These will vary depending on the service triggering your applet. Eg:

```
{
    "privatePhotoURL":"{{PrivatePhotoURL}}",
    "publicPhotoURL": "{{PublicPhotoURL}}"
}
```

In the server's code, you can handle the request when it comes in, say to `/action`. In this case we don't do anything with the data on the server, but pipe it out too all connected clients on our Socket.io instance:

```
// eg: IFTTT posting data to our /action URL
app.post("/action", function (req, res) {
  console.log(req.body);
  res.sendStatus(200);
  
  // Broadcast the same data to all connected clients
    io.sockets.emit('bcast', req.body));
});
```
