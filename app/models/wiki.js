import DS from 'ember-data';

export default DS.Model.extend({
  totalResults: DS.attr('number'),
  results: DS.hasMany('wikiitem'),
  warnings:DS.hasMany('wikiwarning')
});
