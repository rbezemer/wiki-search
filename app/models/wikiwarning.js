import DS from 'ember-data';

export default DS.Model.extend({
  type: DS.attr('string'),
  message: DS.attr('string')
});
