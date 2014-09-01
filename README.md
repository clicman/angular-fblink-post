angular-fblink-post
===================

An angular js library for making posts with facebook features.

This library initially forked from https://github.com/LeonardoCardoso/Facebook-Link-Preview

Features:
----------
 * Link preview in post.
 * Video embedding.
 
Example plunker: http://plnkr.co/edit/d59bhRjrXVnJVsCxPCXh?p=preview


TODO:
----------
 * Beautify layouts.
 * Create one-js library builder.
 * Move php-side preview generation to js side.


# How to use

## Client side:
 * Clone project.
 * Add angular-fblink-post.js script to your index.html.
 * Add angular-fblink-post.css script to your index.html.
 * Insert code <fbpost-input options='options'></fbpost-input> for post input control.
 * Insert code <fbpost-layout posts="posts"></fbpost-layout> for post input control.
  
### Custom attributes reference:
 * "fbpost-input options" passes next object:
            
            options = {
                accountId, //Some id to post storing
                placeholder: "What's in your mind",
                imageQuantity: 10, // Images count to fetch from page. -1 is unlimited
                crawlingUrl, //Url for textCrawling get function on server side.
                createPostUrl:  //Url for saving post function on server side.
            };
            
 * "fbpost-input options" passes next objects in array (normally it returned by server side function):

            posts : [
              text,
              url,
              title,
              image,
              iframe,
              canonicalUrl,
              description
            ];
            
All of these post attributes must be initialized.
    
## Server Side
 * Use php \FbLink\LinkPreview()->crawl($text); for preview data generation.
 * Create your own methods for storing and creating posts in database.


  
