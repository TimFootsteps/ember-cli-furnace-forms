import Control from './abstract';
import Component from 'furnace-forms/components/form';

export default Control.extend().reopenClass({
	_component: null,
	
	generate : function(options) {
		options=options || {};	
		if(!options['for']) {
			options['for']=options._panel['for'].get(options._name);
		}
		var _options={
			_name: options._name,
			_panel: options._panel,
			_form: options._form,
			_component: options._component.extend(options)
		};
		return this.extend(_options).create();
	}
});