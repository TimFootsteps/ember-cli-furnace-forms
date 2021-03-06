import Ember from 'ember';

var get=Ember.get;
var set=Ember.set;
export default Ember.Mixin.create({
	
	checked: false,

	inputId:null,
	
	init: function() {
		this._super();
		
		this.on('change', this, this._updateElementValue);
	},

	_updateElementValue: function() {
		 Ember.run.next(this, function() {
			 if(this.$('#'+get(this,'inputId')))
				set(this, 'checked', this.$('#'+get(this,'inputId')).prop('checked'));
		 });
	},
	
	didInsertElement : function() {
		this._super();
		Ember.run.next(this, function() {
			var input = this.$('#'+get(this,'inputId'));
			if(input)
				input.prop('checked',this.get('checked'));
		});
		
		
	}
})