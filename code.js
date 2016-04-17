var loginPanel;

var connectButton;

var connectingImage;
var authorizingImage;

var screenShadow;

var relayAddress;
var serverAddress;
var serverPort;

var userName;
var userNameField;
var userPassword;
var userPasswordField;

var rememberPasswordBoolean;
var rememberPasswordTickbox;

var errorMessagePanel;
var errorMessageHeader;
var errorMessageBody;
var errorMessageButton;

//Network Variables
var LOGON_MESSAGE="4F";
var FLAGS="01000000";
var WEIRDTHING="01000000";
var DELIMITER="00";
var VERSION=100;
var SUBVERSION=2;

var CLIENTID;
var CLIENTID;

//Initialization Functions
$( document ).ready(function() {
    documentIsReady();
});

function documentIsReady() {
    initialize();
}

function initialize() {
    log("Initializing...");
    
    loadConfig();
    findAllElements();
    addFunctionsToElements();
    initializeNetworking();
    setupLogin();
    
    log("Initialization finished.");
}
function findAllElements() {
    log("Locating all elements...");
    
    loginPanel=document.getElementById("loginPanel");
    
    connectButton=document.getElementById("connectButton");
    
    connectingImage=document.getElementById("connectingGifWrapper");
    authorizingImage=document.getElementById("authorizingGifWrapper");
    
    screenShadow=document.getElementById("screenShadow");
    
    userNameField=document.getElementById("usernameField");
    userPasswordField=document.getElementById("passwordField");
    
    rememberPasswordTickbox=document.getElementById("passwordRememberTickbox");
    
    errorMessagePanel=document.getElementById("errorMessagePanel");
    errorMessageHeader=document.getElementById("errorMessageHeader");
    errorMessageBody=document.getElementById("errorMessageBody");
    errorMessageButton=document.getElementById("errorMessageOKButton");
    
    log("Elements located.");
}

function initializeNetworking() {
    log("Starting up networking...");
    
    relayAddress=window.location.href+"relay.php";
    serverAddress="liberty.starsonata.com";
    serverPort=3030;
    
    log("Network startup finished.");
}

function setupLogin() {
    log("Setting up login screen...");
    
    if(userName!="") {
        userNameField.value=userName;
    }
    
    if(rememberPasswordBoolean==true) {
        rememberPasswordTickbox.checked=true;
    } else {
        rememberPasswordTickbox.checked=false;
    }
    
    if(rememberPasswordBoolean==true) {
        userPasswordField.value=userPassword;
    }
    
    log("Login screen population finished.");
}

//Config Loading and Saving Functions
function loadConfig() {
    log("Loading configuration...");
    
    userName=getCookie("username");
    
    rememberPasswordBoolean=getCookie("rememberPassword");
    
    if(rememberPasswordBoolean=="true") {
        userPassword=getCookie("userpass");
        rememberPasswordBoolean=true;
    }
    
    log("Configuraton loaded.");
}

function saveConfig() {
    log("Saving configuration...");
    
    saveCookie("username",userName);
    
    saveCookie("rememberPassword",rememberPasswordBoolean);
    
    if(rememberPasswordBoolean==true) {
        saveCookie("userpass",userPassword);
    }
    
    log("Configuraton saved.");
}

//Cookie Saving and Loading Functions
function saveCookie(name, value) {
    localStorage.setItem(name, value);
}

function getCookie(name) {
    return localStorage.getItem(name);
}

//Element Manipulation Functions
function addFunctionsToElements() {
    log("Adding functions to elements...");
    
    $(connectButton).click(function() { connectButtonClick(); });
    
    $(errorMessageButton).click(function() { hideErrorWindow(); });
    
    $(rememberPasswordTickbox).parent().click(function() { rememberPasswordTickboxCheck(); });
    
    log("Functions added.");
}

function showElement(em) {
    if(em!=null) {
        var currentClass=em.className;
        
        em.className=removeFromClass(currentClass,"hidden");
    } else {
        log("Attempted to unhide nonexistent element.");
    }
}

function hideElement(em) {
    if(em!=null) {
        var currentClass=em.className;
        
        em.className=addToClass(currentClass,"hidden");
    } else {
        log("Attempted to unhide nonexistent element.");
    }
}

function showErrorWindow(message) {
    var headerText="Oops";
    
    errorMessageHeader.innerHTML=headerText;
    errorMessageBody.innerHTML=message;
    
    showElement(errorMessagePanel);
}

function showErrorWindowWithHeader(header, message) {
    
    errorMessageHeader.innerHTML=header;
    errorMessageBody.innerHTML=message;
    
    showElement(errorMessagePanel);
}

function hideErrorWindow() {
    hideElement(errorMessagePanel);
}

function resetToLogin() {
    hideElement(screenShadow);
    hideElement(connectingImage);
    showElement(loginPanel);
}

//Element Logic Functions
function connectButtonClick() {
    var infoIsEntered=grabUserInfo();
    
    if(infoIsEntered) {
        beginConnecting();
    } else {
        err("Please enter your username and password.");
    }
}

function rememberPasswordTickboxCheck() {
    if(userPasswordField.value=="") {
        errAdvanced("Seriously?","I can't remember a password you haven't given me!");
        rememberPasswordBoolean=false;
        rememberPasswordTickbox.checked=false;
    } else {
        rememberPasswordBoolean=rememberPasswordTickbox.checked;
    }
}

//General Logic Functions


//Grabbing Functions (get values from elements)
function grabUserInfo() {
    var userNameString=userNameField.value;
    var userPasswordString=userPasswordField.value;
    
    if(userNameString=="" || userNameString==null || userPasswordString=="" || userPasswordString==null) {
        return false;
    }
    
    userName=userNameString;
    userPassword=userPasswordString;
    
    saveConfig();
    
    return true;
}

//Parsing Functions
function removeFromClass(original, removal) {
    return original.replace(new RegExp('\\b' + removal + '\\b'),'');
}

function addToClass(original, addition) {
    return original + " " + addition;
}

//Networking Logic Functions

function beginConnecting() {
    hideElement(loginPanel);
    showElement(connectingImage);
    showElement(screenShadow);
    
    //relayOpenSocket();
    
    sendLoginMessage();
}

function authorize() {
    showElement(authorizingImage);
}

function connectedToServer(id) {
    log("Server connection established. Client ID " + id);
    
    CLIENTID=Number(id);
    
    hideElement(connectingImage);
    
    authorize();
}

//Networking Functions
function relayOpenSocket() {
    relayCaller("connect=1&ttw=5");
}

function relayCaller(operation) {
    var finalUrl=relayAddress+"?"+operation;
    
    log("Sending relay request to "+finalUrl);
    
    getRequest(finalUrl,relayCallbackSuccess,relayCallbackFailure);
}

function relayCallerWithParams(operation, value) {
    var finalUrl=relayAddress+"?"+operation+"="+value;
    
    log("Sending relay operation request to "+finalUrl);
    
    getRequest(finalUrl,relayCallbackSuccess,relayCallbackFailure);
}

function relaySendMessage(message) {
    
    var byteLength=(message.length)/2;
    
    var finalMessage=backwardsDecToHex(byteLength-1,4)+message;
    
    var finalUrl=relayAddress+"?userID="+CLIENTID+"&message="+finalMessage;
    
    log("Sending relay message request to "+finalUrl+" with value "+message);
    
    getRequest(finalUrl,relayCallbackSuccess,relayCallbackFailure);
}

function relaySendMessageWithTime(value, ttw) {
    
    var byteLength=(message.length)/2;
    
    var finalMessage=backwardsDecToHex(byteLength-1,4)+message;
    
    var finalUrl=relayAddress+"?ttw="+ttw+"&userID="+CLIENTID+"&message="+finalMessage;
    
    log("Sending relay message request to "+finalUrl+" with value "+message);
    
    getRequest(finalUrl,relayCallbackSuccess,relayCallbackFailure);
}

// helper function for cross-browser request object
function getRequest(url, success, error) {
    var req = false;
    try{
        // most browsers
        req = new XMLHttpRequest();
    } catch (e){
        // IE
        try{
            req = new ActiveXObject("Msxml2.XMLHTTP");
        } catch(e) {
            // try an older version
            try{
                req = new ActiveXObject("Microsoft.XMLHTTP");
            } catch(e) {
                return false;
            }
        }
    }
    if (!req) return false;
    if (typeof success != 'function') success = function () {};
    if (typeof error!= 'function') error = function () {};
    req.onreadystatechange = function(){
        if(req.readyState == 4) {
            return req.status === 200 ? 
                success(req.responseText) : error(req.status);
        }
    }
    req.open("GET", url, true);
    req.send(null);
    return req;
}

function sendLoginMessage() {
    var usernameHex=userName.hexEncode();
    var passwordHex=userPassword.hexEncode();
    
    //log(usernameHex);
    //log(passwordHex);
    
    var hash=hashBrownsII(userName,userPassword);
    
    //log(hash);
    
    var versionHex=backwardsDecToHex(VERSION,4);
    var subversionHex="0"+backwardsDecToHex(SUBVERSION,3);
    //var modifiedHash=hash*0.97688661648333229143530725837305;
    var hashHex=prettyHex(hash);
    
    //Swap the hash Hex around.
    /*var hashP1=hashHex.substring(0,2);
    var hashP2=hashHex.substring(2,4);
    var hashP3=hashHex.substring(4,6);
    var hashP4=hashHex.substring(6,8);
    
    var finalHash;
    
    if((usernameHex+passwordHex).length>=20) {
        finalHash=hashP3+hashP2+hashP1+hashP4;
    } else {
        //finalHash=
    }*/
    
    //length (4), logonconst (2), 0x01 (8), version (4), 0x01 (8), username (?), delimiter (2), password (?),  delimiter (2), delimiter (2), subversion (4), hash (8)
    var messageContents=LOGON_MESSAGE + WEIRDTHING + versionHex + FLAGS + usernameHex + DELIMITER + passwordHex + DELIMITER + DELIMITER + subversionHex + hashHex;
    
    //log(messageContents);
    
    relaySendMessage(messageContents);
}

//Network Callback Functions
function relayCallbackSuccess(response) {
    
    log(response);
    
    var responseSections=response.split(',');
    
    var responseType=responseSections[0];
    
    switch(responseType) {
        case "connection":
            var connectionStatus=responseSections[1];
        
            if(connectionStatus=="success") {
                connectedToServer(responseSections[2]);
            } else {
                err("Could not connect to server...");
                resetToLogin();
            }
        break;
        case "messageresponse":
            processMessage(responseSections);
        break;
        default:
            log("Unknown relay response: " + response);
            break;
    }
}

function relayCallbackFailure(response) {
    log("Relay failed with response: " + response);
}

//Network Messages Processing Functions
function processMessage(responseSections) {
    
    var response=responseSections[1];
    
    log(response);
    
    if(response.contains("Incorrect log-in")) {
        errAdvanced("Login Error","Your username or password is incorrect.");
        resetToLogin();
    }
}

//Math Functions
function hashBrowns(user, pass) {
    var hash=666;
    
    for(var i=0; i<user.length; ++i) {
        hash ^= user.charCodeAt(i) << (i & 0xFFF);
    }
    
    for(var i=0; i<pass.length; ++i) {
        hash ^= pass.charCodeAt(i) << ((pass.length-i) & 0xFFF);
    }
    
    hash ^= SUBVERSION + (SUBVERSION << 4) + (SUBVERSION + 15);
    
    return hash;
}

/*
function hashBrowns(user, pass) {
    var hash=666;
    
    for(var i=0; i<user.length; ++i) {
        hash ^= user.charCodeAt(i) * (2^i);
    }
    
    for(var i=0; i<pass.length; ++i) {
        hash ^= pass.charCodeAt(i) * (2^(pass.length-i));
    }
    
    hash ^= SUBVERSION + (SUBVERSION * (2^4)) + (SUBVERSION + 15);
    
    return hash;
}*/

function hashBrownsII(user, pass)
{
    var hash = 666;
    
    for (var i = 0; i < user.length; ++i) {
        hash = (hash ^ ((user.charCodeAt(i) & 0xFF) << (i & 0xFFFF))) & 0xFFFFFFFF;
    }
    for (var i = 0; i < pass.length; ++i) {
        hash = (hash ^ ((pass.charCodeAt(i) & 0xFF) << (pass.length - i))) & 0xFFFFFFFF;
    }

    hash = (hash ^ (SUBVERSION + (SUBVERSION << 4) + (SUBVERSION + 15))) & 0xFFFFFF;
    
    return hash;
}

String.prototype.hexEncode = function(){
    var hex, i;

    var result = "";
    for (i=0; i<this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        //result += ("000"+hex).slice(-4);
        result+=hex;
    }

    return result;
}

String.prototype.hexDecode = function(){
    var j;
    var hexes = this.match(/.{1,4}/g) || [];
    var back = "";
    for(j = 0; j<hexes.length; j++) {
        back += String.fromCharCode(parseInt(hexes[j], 16));
    }

    return back;
}

String.prototype.contains = function(it) { return this.indexOf(it) != -1; };

function decimalToHex(d) {
  var hex = Number(d).toString(16);
  hex = "000000".substr(0, 6 - hex.length) + hex; 
  return hex;
}

function backwardsDecToHex(d, padding) {
    var hex = Number(d).toString(16);
    padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

    while (hex.length < padding) {
        hex = hex + "0";
    }

    return hex;
}

function prettyHex(x)
{
    var print = "";
    for (var i = 0; i < 4; ++i)
    {
        var b = (x >> (i * 8)) & 0xFF;
        var s = b.toString(16);
        if (s.length == 1) {
            s = "0" + s;
        }
        print += s;
    }
    return print;
}

//Logging Functions
function log(message) {
    console.log(message);
}

function err(message) {
    showErrorWindow(message);
}

function errAdvanced(header, message) {
    showErrorWindowWithHeader(header, message);
}