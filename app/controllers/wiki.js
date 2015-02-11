import Ember from 'ember';

export default Ember.Controller.extend({
  searchTerm:"something",
  actions:{
    searchWiki: function(){
      Ember.Logger.debug('Searching for : '+this.get('searchTerm'));
      this.store.find('wiki', this.get('searchTerm')).then(function(data){
        this.set('model', data);
      }.bind(this));

    }
  }
});
