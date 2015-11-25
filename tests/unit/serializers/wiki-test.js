import { moduleForModel, test } from 'ember-qunit';

moduleForModel('wiki', 'Unit | Serializer | wiki', {
  // Specify the other units that are required for this test.
  needs: ['serializer:wiki']
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  var record = this.subject();

  var serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});
