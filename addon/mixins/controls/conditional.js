import Ember from 'ember';
export default Ember.Mixin.create({
	_condition : false,	
	_conditionFn : null,
	_conditionProps :null,
	
	init:function() {
		this._super();
		if(typeof this._conditionFn==='function') {
			this.reopen({
				_condition:Ember.computed(this._conditionProps+',_form.for',this._conditionFn)
			});
			// Initialize the condition so observers get notified and our condition will observe its condition properties
			this.get('_condition');
		}
	},
	
	hasPrerequisites : Ember.computed.alias('_condition'),

	conditionProperties: Ember.computed('_conditionProps',function() {
		if(!this._conditionProps)
			return null;
		return this._conditionProps.split(',');
	}).readOnly(),
});