[systemd setup on Raspberry PI]
<Move config file to sysstemd directory>
$ sudo cp bleconn.service /etc/systemd/system/;

<Start/Stop bleconn service>
$ sudo systemctl start bleconn;
$ sudo systemctl sop bleconn;

<Check bleconn service status>
$ sudo systemctl status bleconn;

<Add/Remove auto start of bleconn service at of boot sequence>
$ sudo systemctl enable bleconn;
$ sudo systemctl disable bleconn;


