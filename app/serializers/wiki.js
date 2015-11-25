import DS from 'ember-data';

export default DS.RESTSerializer.extend({
  generateUUID: function(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c==='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
  },
  /**
   * Ember expects your data to look like this:
   * {
   *   "person": {
   *     "firstName": "Barack",
   *     "lastName": "Obama",
   *     "isPersonOfTheYear": true
   *   }
   * }
   * Since wikimedia returns info like this:
   * {"query-continue":{"search":{"sroffset":10}},"warnings":{"main":{"*":"Unrecognized parameters: 'formate', '_'"},"query":{"*":"Unrecognized value for parameter 'prop': text\nFormatting of continuation data will be changing soon. To continue using the current formatting, use the 'rawcontinue' parameter. To begin using the new format, pass an empty string for 'continue' in the initial query."}},"query":{"searchinfo":{"totalhits":119925},"search":[{"ns":0,"title":"Something","timestamp":"2015-02-11T13:06:30Z"},{"ns":0,"title":"Something (Beatles song)","timestamp":"2015-02-10T04:21:14Z"},{"ns":0,"title":"Something, Something, Something, Dark Side","timestamp":"2014-11-05T03:20:24Z"},{"ns":0,"title":"Something old","timestamp":"2015-01-11T14:56:50Z"},{"ns":0,"title":"Something About You","timestamp":"2014-03-16T02:07:01Z"},{"ns":0,"title":"Thirtysomething","timestamp":"2014-11-29T18:16:30Z"},{"ns":0,"title":"Say Something","timestamp":"2014-10-21T06:22:11Z"},{"ns":0,"title":"Something Else","timestamp":"2014-12-17T16:00:22Z"},{"ns":0,"title":"Dayton, Ohio\u201319 Something and 5","timestamp":"2013-12-30T17:00:49Z"},{"ns":0,"title":"Something Outa Nothing","timestamp":"2014-12-26T22:45:13Z"}]}}
   *
   * we have some formatting work to do
   * @param store
   * @param primaryType
   * @param rawPayload
   * @param recordId
   */
  extractSingle: function(store, primaryType, rawPayload, recordId) {
    Ember.Logger.info(rawPayload);
    var newPayload = {};
    var warnings = [];
    var results = [];
    //everything should be stored under the name of the model you are serializing into
    newPayload.wiki = {
      //add id's to make things easier to reference
      id: recordId,
      totalResults: rawPayload.query.searchinfo.totalhits,
      results: [],
      warnings: []
    };
    //build out the warnings returned from wikipedia
    if(rawPayload.warnings) {
      for (var key in rawPayload.warnings) {
        var obj = rawPayload.warnings[key];
        for (var prop in obj) {
          // important check that this is objects own property
          // not from prototype prop inherited
          if(obj.hasOwnProperty(prop)){
            warnings.push({id: this.generateUUID(), type:key, message: obj[prop]});
          }
        }
      }
    }
    //now add the references to our main payload, ember data will connect the wikiwarning objects via their id
    warnings.forEach(function(item){
      newPayload.wiki.warnings.push(item.id);
    });

    //build out our seach results
    if(rawPayload.query.search){
      rawPayload.query.search.forEach(function(item){
        var searchitem = {
          id: this.generateUUID(),
          title:item.title,
          summary: item.snippet,
          timestamp: item.timestamp
        };
        results.push(searchitem);
      }.bind(this));
    }
    //now add the references to our main payload, ember data will connect the wikiitem objects via their id
    results.forEach(function(item){
      newPayload.wiki.results.push(item.id);
    });

    //now build the complete json payload, remember to pluralize them!
    //also notice the json key matches the name of the data model
    newPayload.wikiitems = results;
    newPayload.wikiwarnings = warnings;

    // now pass it off to the default functions.
    return this._super(store, primaryType, newPayload, recordId);
  },
  extractArray: function(store, primaryType, rawPayload, recordId) {
    Ember.Logger.info(rawPayload);
    return this._super(store, primaryType, rawPayload, recordId);
  }

});
