var model, Model, view, container, controller, valid;
var templateFor = function(template) {
  return Ember.Handlebars.compile(template);
};
var original_lookup = Ember.lookup, lookup;
Model = Ember.Object.extend({
  validate: function() {
    return valid;
  },
});

module('textField helper', {
  setup: function() {
    model = Model.create({
      firstName: 'Brian',
    });
    controller = Ember.ObjectController.create();
    controller.set('content', model);
  },
  teardown: function() {
    Ember.run(function() {
      view.destroy();
      view = null;
    });
    Ember.lookup = original_lookup;
  }
});

var append = function(view) {
  Ember.run(function() {
    view.appendTo('#qunit-fixture');
  });
};

test('renders a text field', function() {
  view = Ember.View.create({
    template: templateFor('{{textField firstName}}'),
    controller: controller
  });
  append(view);
  equal(view.$().find('input').val(), 'Brian');
  equal(view.$().find('input').prop('type'), 'text');
});
