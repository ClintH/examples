var charter = {}
// How often charter should use data
charter.updateMs = 500;


charter.lineAX = new TimeSeries();
charter.lineAY = new TimeSeries();
charter.lineAZ = new TimeSeries();

charter.lineGX = new TimeSeries();
charter.lineGY = new TimeSeries();
charter.lineGZ = new TimeSeries();
charter.smoothieAcc = null;
charter.smoothieGyro = null;

charter.init = function() {
  if (document.readyState != 'loading'){
    charter.setUpSmoothie();
  } else {
    document.addEventListener('DOMContentLoaded', charter.setUpSmoothie);
  }
}

charter.setUpSmoothie = function() {
  charter.smoothieAcc = new SmoothieChart({
    maxValue:2.05,minValue:-2.05,
    grid: { strokeStyle:'rgb(125, 0, 0)', fillStyle:'rgb(60, 0, 0)',
    lineWidth: 1, millisPerLine: 250, verticalSections: 6, },
    labels: { fillStyle:'rgb(60, 0, 0)' }
  });
    
  charter.smoothieGyro = new SmoothieChart({
    maxValue:300.00,minValue:-300.00,
    grid: { strokeStyle:'rgb(125, 0, 0)', fillStyle:'rgb(60, 0, 0)',
    lineWidth: 1, millisPerLine: 250, verticalSections: 6, },
    labels: { fillStyle:'rgb(60, 0, 0)' }
  });
    
  charter.smoothieAcc.streamTo(document.getElementById("canvasAcc"), charter.updateMs);
  charter.smoothieGyro.streamTo(document.getElementById("canvasGyro"), charter.updateMs);
  
  // Fetch latest data according to updateMs
  setInterval(function() {        
      charter.lineAX.append( new Date().getTime(), client.ax );
      charter.lineAY.append( new Date().getTime(), client.ay );
      charter.lineAZ.append( new Date().getTime(), client.az );
       
      charter.lineGX.append( new Date().getTime(), client.gx );
      charter.lineGY.append( new Date().getTime(), client.gy );
      charter.lineGZ.append( new Date().getTime(), client.gz );   
    }, charter.updateMs);
    
    charter.smoothieAcc.addTimeSeries(charter.lineAX,  { strokeStyle:'rgb(0, 255, 0)', lineWidth:3 });
    charter.smoothieAcc.addTimeSeries(charter.lineAY,  { strokeStyle:'rgb(255, 0, 0)', lineWidth:3 });
    charter.smoothieAcc.addTimeSeries(charter.lineAZ,  { strokeStyle:'rgb(0, 0, 255)', lineWidth:3 });
    charter.smoothieGyro.addTimeSeries(charter.lineGX,  { strokeStyle:'rgb(0, 255, 0)', lineWidth:3 });
    charter.smoothieGyro.addTimeSeries(charter.lineGY,  { strokeStyle:'rgb(255, 0, 0)', lineWidth:3 });
    charter.smoothieGyro.addTimeSeries(charter.lineGZ,  { strokeStyle:'rgb(0, 0, 255)', lineWidth:3 });  
};
charter.init();