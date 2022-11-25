import { renderWidget } from './utils';

renderWidget();

(function () {
    // Extend XMLHttpRequest to get info of all XHR requests

    // TODO: Add Fetch extension

    // https://stackoverflow.com/questions/5202296/add-a-hook-to-all-ajax-requests-on-a-page
    // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest#Monitoring_progress
    // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
    // https://developer.mozilla.org/en-US/docs/Web/Events/load

    var origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
        console.log('request open');
        console.log(arguments);
        console.log(this);
        /*
        this.addEventListener('loadstart', function() {
	        console.log('request loadstart');
			console.log(this);
        });
        this.addEventListener('load', function() {
	        console.log('request load');
			console.log(this);
        });
		*/
        this.addEventListener('loadend', function () {
            // if status 2x and responseText...
            console.log('request loadend');
            console.log(this);
        });
        /*
        this.addEventListener('progress', function() {
	        console.log('request progress');
			console.log(this);
        });
        this.addEventListener('readystatechange', function() {
	        console.log('request readystatechange');
			console.log(this);
        });
		*/
        this.addEventListener('abort', function () {
            console.log('request abort');
            console.log(this);
        });
        this.addEventListener('error', function () {
            console.log('request error');
            console.log(this);
        });
        this.addEventListener('timeout', function () {
            console.log('request timeout');
            console.log(this);
        });
        // @ts-ignore
        origOpen.apply(this, arguments);
    };

    // var oReq = new XMLHttpRequest();
    // oReq.open('GET', 'https://www.google.com');
    // oReq.send();
})();
