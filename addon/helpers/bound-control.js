/**
@module ember
@submodule ember-htmlbars
*/
import Ember from "ember"; // Ember.warn, Ember.assert
import BoundComponentView from 'furnace-forms/utils/bound-control-view';

var isStream=Ember.__loader.require('ember-metal/streams/utils')['isStream'];
var read=Ember.__loader.require('ember-metal/streams/utils')['read'];
var readComponentFactory=Ember.__loader.require('ember-views/streams/utils')['readComponentFactory'];
var EmberError =Ember.__loader.require('ember-metal/error')['default'];
var mergeViewBindings =Ember.__loader.require('ember-htmlbars/system/merge-view-bindings')['default'];
var appendTemplatedView =Ember.__loader.require('ember-htmlbars/system/append-templated-view')['default'];

/**
  The `{{component}}` helper lets you add instances of `Ember.Component` to a
  template. See [Ember.Component](/api/classes/Ember.Component.html) for
  additional information on how a `Component` functions.
  `{{component}}`'s primary use is for cases where you want to dynamically
  change which type of component is rendered as the state of your application
  changes.
  The provided block will be applied as the template for the component.
  Given an empty `<body>` the following template:
  ```handlebars
  {{! application.hbs }}
  {{component infographicComponentName}}
  ```
  And the following application code
  ```javascript
  App = Ember.Application.create();
  App.ApplicationController = Ember.Controller.extend({
    infographicComponentName: function() {
      if (this.get('isMarketOpen')) {
        return "live-updating-chart";
      } else {
        return "market-close-summary";
      }
    }.property('isMarketOpen')
  });
  ```
  The `live-updating-chart` component will be appended when `isMarketOpen` is
  `true`, and the `market-close-summary` component will be appended when
  `isMarketOpen` is `false`. If the value changes while the app is running,
  the component will be automatically swapped out accordingly.
  Note: You should not use this helper when you are consistently rendering the same
  component. In that case, use standard component syntax, for example:
  ```handlebars
  {{! application.hbs }}
  {{live-updating-chart}}
  ```
  @method component
  @since 1.11.0
  @for Ember.Handlebars.helpers
*/
export default function controlHelper(params, hash, options, env) {
  Ember.assert(
    "The `component` helper expects exactly one argument, plus name/property values.",
    params.length === 1
  );

  var view = env.data.view;
  var componentNameParam = params[0];
  var container = view.container || read(view._keywords.view).container;

  var props = {
    helperName: options.helperName || 'component'
  };
  if (options.template) {
    props.template = options.template;
  }

  var viewClass;
  if (isStream(componentNameParam)) {
    viewClass = BoundComponentView;
    props = { _boundComponentOptions: Ember.merge(hash, props) };
    props._boundComponentOptions.componentNameStream = componentNameParam;
  } else {
    viewClass = readComponentFactory(componentNameParam, container);
    if (!viewClass) {
      throw new EmberError('HTMLBars error: Could not find component named "' + componentNameParam + '".');
    }
    mergeViewBindings(view, props, hash);
  }

  appendTemplatedView(view, options.morph, viewClass, props);
}