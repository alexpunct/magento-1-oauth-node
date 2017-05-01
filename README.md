# Magento 1.x oAuth Token Generation

This is a small app to help you generate a Magento REST Api Authorised Token and Token Secret which you need in order to make API Requests. Or you can use a similar logic in your existing app. 

### 1 - Magento Admin Configuration

First step is to setup the API Role, User and consumer

* Create an Admin Role in `System > Web Services > REST Roles`
* Assign the Admin Role to the Admin Users that are allowed to use the API in `System > Permissions > User`
* Create a new Consumer in `System > Web Services > REST OAuth Consumers` and copy the Key and Secret which we will use later.

### 2 - Clone this repo

* Make sure you have **Node** and **Npm** installed
* Clone the repository
* Install dependencies with `npm install`
* Start the server with `npmm start`
 
### 3 - Usage

* Open the app in a browser. By default `http://localhost:3000/`
* Fill in the details:
    * Magento URL - the URL to your Magento installation (Ex: `http://mystore.com/`)
    * Admin path - the path to admin (Default: `admin` but change if you've setup a custom path in local.xml)
    * Client Key - the consumer key generated at step 1
    * Client Secret - the consumer secret generated at step 1
    * API User Type - if to authenticate as an Admin user or regular Customer

Now if you **Submit** the form, if all the details are ok, it should ask you to login/authorize the App, then come back on the success page and show you:
 
 * Consumer key (same as in step 1) 
 * Consumer secret (same as in step 1) 
 * Authorized Token 
 * Token Secret
 
You can use these details to make API requests authenticating using an oAuth client like [oauth-1.0a](https://www.npmjs.com/package/oauth-1.0a).  
