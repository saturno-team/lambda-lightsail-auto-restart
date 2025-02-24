# lightsail-auto-restart  
Auto restart for Lightsail  

This code automatically restarts a Lightsail instance by stopping it and waiting for it to fully stop before starting it again.  

I did not use `rebootInstance` because, in some cases, it gets stuck, requiring additional handling to force a stop.  

I run this script daily to prevent excessive continuous CPU usage on low-traffic servers.  

To automate the process, fork this repository, set the required secrets in your repository, and update the instance name in `index.js`.  
