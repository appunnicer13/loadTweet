/**
 * Created by ApunniM on 1/31/2017.
 */
tinymce.PluginManager.add('TwitterPlugin', function(editor) {
    // Add a button that opens a window
    editor.on('paste', handleTwitterLinks.bind(editor));
});

function handleTwitterLinks(e){
    var pasted = e.content;
    //now go through pasted content
    //and find twitter links
    //and update that with some content
    var twitter_links = getTwitterUrls(pasted);
    twitter_links.forEach(getEmbedTweet,this);//context
    //done
}

function getTwitterUrls(content){
    var twitterReg = /http(?:s)?:\/\/(?:www)?twitter\.com\/([a-zA-Z0-9_]+)(?:\/([a-zA-Z0-9_]+)\/([a-zA-Z0-9_]+))?/gi;
    return content.match(twitterReg);
}

function getEmbedTweet(link){
    var self = this;
    //here i have to send request to twitter to get Embed code for each link
    var url = "https://publish.twitter.com/oembed?url="+link;
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.setRequestHeader('Accept', 'application/json');
    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            // Success!
            var data = request.responseText;
            var responseJson = JSON.parse(data);
            if(responseJson.html){
                setEmbedTweet.call(self,link,responseJson.html);
               //changing links
            }
        } else {
             //just ignore
        }
    };
    request.onerror = function () {
        // There was a connection error of some sort
        //i don't know just ignore
    };
    request.send();

}

function setEmbedTweet(link,html){
    var wholeContent = this.getContent();
    wholeContent = wholeContent.replace(link,html);
    this.setContent(wholeContent);
}