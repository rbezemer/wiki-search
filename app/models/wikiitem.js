import DS from 'ember-data';

export default DS.Model.extend({
  title:DS.attr('string'),
  summary:DS.attr('string'),
  timestamp: DS.attr('string')
  
});
