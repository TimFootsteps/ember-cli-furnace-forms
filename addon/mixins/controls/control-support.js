import Ember from 'ember';
import Action from 'furnace-forms/controls/action';
export default Ember.Mixin.create({
	_controls : null,
	
//	_path : null,
	
	init : function() {
		this._super();

		this._controls={};
	},
	
	controls: Ember.computed(function() {
		var ret = Ember.A();
		var self = this;
		this.constructor.eachComputedProperty(function(name, meta) {
			if (meta.type==='form-control') {
				ret.pushObject(self.get(name));
			}
		});
		return ret;
	}).readOnly(),
	
	inputControls: Ember.computed(function() {
		var ret = Ember.A();
		var self = this;
		this.constructor.eachComputedProperty(function(name, meta) {
			if (meta.type==='form-control' && !(self.get(name) instanceof Action)) {
				ret.pushObject(self.get(name));
			}
		});
		return ret;
	}).readOnly(),
	
	actionControls: Ember.computed(function() {
		var ret = Ember.A();
		var self = this;
		this.constructor.eachComputedProperty(function(name, meta) {
			if (meta.type==='form-control' && (self.get(name) instanceof Action)) {
				ret.pushObject(self.get(name));
			}
		});
		return ret;
	}).readOnly(),
	
//	_dirty : false,
//	
//	isDirty : false,
	
	setDirty : function(dirty) {
		Ember.run.once(this,function() {
			if(this._dirty!=dirty) {
				this.set('_dirty',dirty);
			}
			dirty=dirty || this.get('controls').filterBy('isDirty', true).get('length')>0;
			if(this.isDirty!=dirty) {
				this.setFlag('isDirty',dirty);
			}
		});
	},
	
	_controlDirtyObserver: Ember.observer('controls.@each.isDirty',function(){		
		this.setDirty(this._dirty);
	}),
	
//	_valid : null,
//	
//	isValid : null,
	
	setValid : function(valid) {
		Ember.run.once(this,function() {
			if(this.isDestroyed) {
				Ember.warn('Attempting to change validity of destroyed object '+this.toString());
				return;
			}
			if(this._valid!=valid) {				
				this.set('_valid',valid);
			}
			valid= valid!==false && this.get('controls').filterBy('isValid',false ).get('length')===0
			if(valid!=this.isValid) {
				this.setFlag('isValid',valid);
				this.notifyChange();
			}
		});
	},
	
	_controlValidObserver: Ember.observer('controls.@each.isValid',function(){
		this.setValid(this._valid);
	}),
	
//	willDestroy: function() {
//		this.get('controls').invoke('destroy');
//		this.set('_controls',null);
//		this._super();
//	}
	destroy : function() {
		this.get('controls').invoke('destroy');
		this._super();
	}
	
});