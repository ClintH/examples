var client = {};
// TODO: Change this to match Arduino code
client.TAG_NAME = "imclint";
client.ax = client.ay = client.az = -1;
client.gx = client.gy = client.gz = -1;


client.init =  function() {
    console.log("init!");
    document.addEventListener(
        'deviceready',
        function() { 
            evothings.scriptsLoaded(client.onReady); 
        },
        false);
}

client.onReady = function() {
    client.displayStatus("Ready");
}

client.connect = function() {
    client.displayStatus("Scanning");
    evothings.easyble.startScan(
        client.onDeviceFound,
        client.onScanError);   
}

client.disconnect = function() {
    client.displayStatus("Disconnecting");
    client.device.close();
}

// This function is called when a device is detected, here
// we check if we found the device we are looking for.
client.onDeviceFound = function(device) {
    if (typeof device.advertisementData.kCBAdvDataLocalName == 'undefined') return;
    console.log("onDeviceFound: " + device.advertisementData.kCBAdvDataLocalName);
    if (device.advertisementData.kCBAdvDataLocalName == client.TAG_NAME) {
        client.displayStatus("Found " + client.TAG_NAME);

        // Stop scanning.
        evothings.ble.stopScan()

        // Connect
        client.device = device;
        client.device.connect(
            client.onConnected,
            client.onConnectError);
    }
}

client.writeDescriptor = function(code, descriptor) {
      // Set accelerometer notifications to ON.
  client.device.writeDescriptor(
    client.IMU_ACC,
    client.IMU_AXDESCRIPTOR, // Notification descriptor.
    new Uint8Array([1,0]),
    function() {
      console.log('client.writeDescriptor: ok.');
    },
    function(errorCode) {
      console.log('client.writeDescriptor: Error ' + errorCode + '.');
    });
}

// Called when device is connected.
client.onConnected = function(device) {
    client.displayStatus('Connected to device: ' + device);

    device.readServices(null,
        function(service) {
            console.log("client.onConnected: Services read");
            client.handleAcceleration();
            client.handleGyro();
        },
        function(error) {
            console.log("client.onConnected: Could not read services: " + error);
        }
    );
}

client.IMU_ACC = '917649a1-d98e-11e5-9eec-0002a5d5c51b';
client.IMU_AXDESCRIPTOR = '00002902-0000-1000-8000-00805f9b34fb';
client.IMU_GYRO = '917649a2-d98e-11e5-9eec-0002a5d5c51b';
client.IMU_GXDESCRIPTOR = '00002902-0000-1000-8000-00805f9b34fb';

client.handleAcceleration = function() {
    client.writeDescriptor(client.IMU_ACC, client.IMU_AXDESCRIPTOR);

    client.device.enableNotification(
        client.IMU_ACC,
        function(data) {
            client.ax = new DataView(data).getFloat32(0, true);
            client.ay = new DataView(data).getFloat32(4, true);
            client.az = new DataView(data).getFloat32(8, true);
            
            //console.log( '(ax,ay,az):' + '(' + client.ax + ',' + client.ay + ',' + client.az + ')' );
        },
        function(error) {
            console.log('Error: handleAcceleration: ' + error + '.');
        }
    );
}

client.handleGyro = function() {
    client.writeDescriptor(client.IMU_GYRO, client.IMU_GXDESCRIPTOR);
    client.device.enableNotification(
        client.IMU_GYRO,
        function(data) {
            client.gx = new DataView(data).getFloat32(0, true);
            client.gy = new DataView(data).getFloat32(4, true);
            client.gz = new DataView(data).getFloat32(8, true);            
        },
        function(error) {
            console.log('Error: handleGyro: ' + error + '.');
        }
    );
}
// Called if device disconnects.
client.onDisconnected = function(device) {
    client.displayStatus('Disconnected from device')
}

client.onScanError = function(error) {
    client.displayStatus('Scan error: ' + error)
}
// Called when a connect error occurs.
client.onConnectError = function(error) {
    client.displayStatus('Connect error: ' + error)
}

client.displayStatus = function(status) {
    document.getElementById('status').innerHTML = status
}
client.init();