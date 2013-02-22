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

module('the formFor helper', {
  setup: function() {
    container = new Ember.Container();
    container.optionsForType('template', { instantiate: false });
    container.resolver = function(fullName) {
      var name = fullName.split(':')[1];
      return Ember.TEMPLATES[name];
    };
    model = Model.create({
      firstName: 'Brian',
      lastName: 'Cardarella',
      errors: Ember.Object.create()
    });
    controller = Ember.Controller.create();
    controller.set('content', model);
    controller.set('count', 0);
    controller.set('submit', function() { this.set('count', this.get('count') + 1); });
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

var assertHTML = function(view, expectedHTML) {
  var html = view.$().html();

  // IE 8 (and prior?) add the \r\n
  html = html.replace(/<script[^>]*><\/script>/ig, '').replace(/[\r\n]/g, '');

  equal(html, expectedHTML);
};

test('renders a form element', function() {
  view = Ember.View.create({
    template: templateFor('{{#formFor controller}}{{/formFor}}'),
    controller: controller
  });
  append(view);
  ok(view.$().find('form').get(0));
});

test('submitting with invalid model does not call submit action on controller', function() {
  valid = false;
  view = Ember.View.create({
    template: templateFor('{{#formFor controller}}{{/formFor}}'),
    container: container,
    controller: controller
  });
  append(view);
  Ember.run(function() {
    view._childViews[1].trigger('submit');
  });
  equal(controller.get('count'), 0);
});

test('submitting with valid model calls submit action on controller', function() {
  valid = true;
  view = Ember.View.create({
    template: templateFor('{{#formFor controller}}{{/formFor}}'),
    container: container,
    controller: controller
  });
  append(view);
  Ember.run(function() {
    view._childViews[1].trigger('submit');
  });
  equal(controller.get('count'), 1);
});

test('submitting with model that does not have validate method', function() {
  valid = true;
  view = Ember.View.create({
    template: templateFor('{{#formFor controller}}{{/formFor}}'),
    container: container,
    controller: controller
  });
  append(view);
  Ember.run(function() {
    view._childViews[1].trigger('submit');
  });
  equal(controller.get('count'), 1);
});
