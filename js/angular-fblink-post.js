/*
* Author: Viktor Sidochenko viktor.sidochenko@gmail.com
* Licensed to GPL v.3
*/

angular.module('fblink-post', [])
        .controller('AngularFblinkPostController', function($scope, $http) {
            $scope.styles = {
                previewLoaderShow: false,
                previewShow: false,
                disableThumb: false,
                previewImageBlock: {'display': 'block'},
                previewImageNone: {'display': 'none'},
            };

            $scope.crawl = {};

            $scope.previewContentClass = 'previewContent';

            //Block posting
            var isBlockedForPosting = false;
            //block additional crawling
            var isCrawled = false;

            //Url regex
            var urlRegex = /(https?\:\/\/|\s)[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})(\/+[a-z0-9_.\:\;-]*)*(\?[\&\%\|\+a-z0-9_=,\.\:\;-]*)?([\&\%\|\+&a-z0-9_=,\:\;\.-]*)([\!\#\/\&\%\|\+a-z0-9_=,\:\;\.-]*)}*/i;

            $scope.input = {
                actions: {
                    paste: function(e) {
                        setTimeout(function() {
                            $scope.crawlText($scope.input.text);
                        }, 100);
                    },
                    keyUp: function(event) {
                        if ((event.which === 10 || event.which === 13 || event.which === 32)) {
                            $scope.crawlText($scope.input.text);
                        }
                    },
                    keyPress: function(event) {
                        var keyCode = (event.which ? event.which : event.keyCode);

                        if (keyCode === 10 || keyCode === 13 && event.ctrlKey) {
                            $scope.submitPost($scope.input.text);
                            return false;
                        }

                        return true;
                    }
                }
            };
            $scope.activeImage = -1;
            $scope.isActiveImage = function(index) {
                if (index === $scope.activeImage) {
                    return true;
                } else {
                    return false;
                }
            }

            $scope.removePreview = function() {
                $scope.styles.previewShow = false;
                $scope.crawl = {};
                isBlockedForPosting = false;
                isCrawled = false;

            };

            $scope.previousImageAction = function() {
                if ($scope.activeImage > 0) {
                    $scope.activeImage--;
                    $scope.isActiveImage($scope.activeImage - 1);
                }
            };
            $scope.nextImageAction = function() {
                if ($scope.activeImage + 1 < $scope.crawl.images.length) {
                    $scope.activeImage++;
                    $scope.isActiveImage($scope.activeImage + 1);
                }
            };

            $scope.$watch('styles.disableThumb', function(newValue, oldValue) {
                if (newValue) {
                    $scope.previewContentClass = 'previewContentText';

                } else {
                    $scope.previewContentClass = 'previewContent';

                }
            });

            $scope.crawlText = function(text) {



                if (!isBlockedForPosting && !isCrawled && urlRegex.test(" " + text)) {

                    isBlockedForPosting = true;

                    $scope.previewButtonsStyle = {'display': 'hidden'};
                    $scope.styles.previewLoaderShow = true;

                    $http.post($scope.options.crawlingUrl, {
                        text: $scope.input.text,
                        imagequantity: $scope.options.imageQuantity
                    }).success(function(data) {

                        $scope.crawl = data.crawl;

                        if ($scope.crawl.images) {
                            $scope.crawl.images = ($scope.crawl.images).split("|");
                            $scope.activeImage = 0;
                        }
                        $scope.styles.previewLoaderShow = false;

                        $scope.styles.previewShow = true;

                        isCrawled = true;
                        isBlockedForPosting = false;
                    }, "json");

                }

            };

            $scope.submitPost = function() {

                if (!isBlockedForPosting && (" " + $scope.input.text).trim() !== "") {
                    isBlockedForPosting = true;
                    var image = false;
                    if ($scope.crawl.images && !$scope.styles.disableThumb) {
                        image = $scope.crawl.images[$scope.activeImage];
                    }

                    $http.post($scope.options.createPostUrl, {
                        accountId: $scope.options.accountId,
                        post: {
                            text: $scope.input.text,
                            image: image,
                            title: $scope.crawl.title || "",
                            canonicalUrl: $scope.crawl.canonicalUrl || "",
                            url: $scope.crawl.url || "",
                            description: $scope.crawl.description || "",
                            iframe: $scope.crawl.videoIframe || ""
                        }
                    });
                    var post = $scope.crawl;
                    post.text = $scope.input.text;
                    post.image = image;

                    $scope.input.text = "";
                    $scope.removePreview();
                    isBlockedForPosting = false;

                    $scope.$parent.posts.unshift(post);
                }
            };


        }).directive('fbpostInput', function() {
    return {
        restrict: 'E',
        controller: 'AngularFblinkPostController',
        scope: {
            options: '='
        },
        templateUrl: 'angular-fblink-post/templates/input-layout.html'
    };
        }).directive('fbpostsLayout', function() {            
    return {
        restrict: 'E',                 
        controller: 'AngularFblinkPostController',
        scope: {
            posts: '='
        },
        templateUrl: 'angular-fblink-post/templates/posts-layout.html'
    };
        });



