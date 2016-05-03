var app = {

    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },

    receivedEvent: function(id) {




        $("#share-twitter").click(function() {
            window.plugins.socialsharing.shareViaTwitter('via PhotoLotto', $('#photo').attr('src'), "http://photolotto.io");
        });

        $("#share-facebook").click(function() {
            window.plugins.socialsharing.shareViaFacebook('via PhotoLotto', $('#photo').attr('src'), "http://photolotto.io");
        });

        $("#share-instagram").click(function() {
            window.plugins.socialsharing.shareViaInstagram('via PhotoLotto', $('#photo').attr('src'), "http://photolotto.io");
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
            $("#loader").css("display", "none");
            $("#photo").css("display", "block").attr('src', res.picture);
            $(".share-toolbar").css("display", "block");

            if(device.platform === 'iOS') {
                twitter = 'twitter://';
            }
            else if(device.platform === 'Android') {
                twitter = 'com.twitter.android';
            }

            appAvailability.check(
                twitter,
                function() {
                    $("#share-twitter").css("display", "block")
                },
                function() {

                }
            );
        }

        function fail(error) {

        }

        function onFail(message) {

        }
    }
};
