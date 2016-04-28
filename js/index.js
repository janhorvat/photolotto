/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {

        $("#share-button").click(function() {
                var options = {
          message: 'share this', // not supported on some apps (Facebook, Instagram)
          subject: 'the subject', // fi. for email
          files: ['', ''], // an array of filenames either locally or remotely
          url: 'https://www.website.com/foo/#bar?a=b',
          chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
        }

        var onS = function(result) {
          console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
          console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
        }

        var onE = function(msg) {
          console.log("Sharing failed with message: " + msg);
        }

        window.plugins.socialsharing.shareWithOptions(options, onS, onE);
});




        $("#take-a-photo").click(function() {
            navigator.camera.getPicture(
                onSuccess,
                onFail, {
                    quality: 50,
                    targetWidth: 1280,
                    targetHeight: 1280,
                    allowEdit : true,
                    destinationType: Camera.DestinationType.FILE_URI
                }
            );
        });

        function onSuccess(imageURI) {
            $("#loader").css("display", "block");
            $("#photo").css("display", "none");
            var options = new FileUploadOptions();
            options.fileKey="file";
            options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
            options.mimeType="image/jpeg";

            var params = new Object();
            params.value1 = "test";
            params.value2 = "param";

            options.params = params;
            options.chunkedMode = false;
            var ft = new FileTransfer();
            ft.upload(imageURI, "http://ec2-52-58-16-37.eu-central-1.compute.amazonaws.com/api/v1/photos/upload", win, fail, options);
        }

        function win(r) {
            var res = jQuery.parseJSON(r.response);
            console.log(res.picture);
            $("#loader").css("display", "none");
            $("#photo").css("display", "block").attr('src', res.picture);
        }

        function fail(error) {
            //console.log("An error has occurred: Code = " = error.code);
        }

        function onFail(message) {
            console.log('Failed because: ' + message);
        }


    }
};
