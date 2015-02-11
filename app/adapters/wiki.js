import ApplicationAdapter from './application';
import Ember from 'ember';

export default ApplicationAdapter.extend({
  host: 'http://en.wikipedia.org',
  namespace: 'w/api.php',
  buildURL: function(type, searchTerm /*, record*/) {
    var url = [],
      host = this.get('host'),
      prefix = this.urlPrefix(),
      queryParams = [];

    if (type) { url.push(this.pathForType(type)); }
    //from http://www.mediawiki.org/wiki/API:Search
    //action=parse&format=json&prop=text&section=0&page=Jimi_Hendrix&callback=?"
    //&list=search&srsearch=wikipedia&srprop=timestamp
    queryParams.push('action=query');
    queryParams.push('prop=text');
    queryParams.push('list=search');
    queryParams.push('srsearch='+searchTerm);
    queryParams.push('format=json');
    queryParams.push('srprop=timestamp|snippet');

    queryParams.push('callback=?');

    if (prefix) { url.unshift(prefix); }

    url = url.join('/');
    url += "?"+ queryParams.join("&");
    if (!host && url) { url = '/' + url; }
    Ember.Logger.info("Wikipedia search url : "+ url);
    return url;
  },
  find: function(store, type, searchTerm) {
    var requestUrl = this.buildURL(type.typeKey, searchTerm);
    return this.ajax(requestUrl, "GET", {
      contentType: "application/json; charset=utf-8",
      async: false,
      dataType: "json"
    });
    /*
     success: function (data, textStatus, jqXHR) {

     var markup = data.parse.text["*"];
     var blurb = $('<div></div>').html(markup);
     $('#article').html($(blurb).find('p'));

     },
     error: function (errorMessage) {
     }
     */


  }
});
