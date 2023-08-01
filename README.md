# ESVA MODULE

## Summary
This document describes the deployment of the ESVA Module and its endpoints. 

## Deployment
Each partner is responsible for its own instalation of this module in their own machines. To install the module, 5 steps are required for the reader to make:

### 1. Create the Home Folder
In your machine, create a home directory for the module in your `/data` folder called "esva".
E.g.: `mkdir /data/esva`

### 2. Place the needed certificates
You will need to have 2 sets of certificates: 
 - the certificate, public and private key to perform the HTTP-signature requests to your EWP node;
 - the SSL certificates for NGINX. This set should be generated by you.
 
You will need to create two directories inside the `/data/esva`:

 - one is called "ewp_certs" and it will contain the EWP node certificate set. These files ought to follow the name schema of your institution schac_code followed by the file extension (e.g. ewp.up.pt.crt, ewp.up.pt.key, ewp.up.pt.pub);
 - one is called "ssl_certs" and it will contain the NGINX certificate set. The certificate file must be named as "fullchain.pem" and the key must be named "privkey.pem"

### 3. Clone the Repository and fill in the Environment Variables
You should clone the repository in the `/data/esva` directory and check the ".env.example" file inside the repository and follow its guidelines, adjusting the variables to your specific needs. For that, create a .env file in the repository folder you cloned and fill it in with the variables adjusted to you.

### 4. Run the installation script
Finally, in order to set up the containers and run the program, run one of the scripts in the "deployment" folder. 
There is a script that compiles the code in the development or production branch. You must be working on the respective branch to run the script (e.g.`git checkout development` before running the buildContainersDevelopment.sh script).
After you run the script, the containers will be up and you will be able to use ESVA module.
If you cannot run the script, give it executable permission (e.g. `chmod +x <script>`)