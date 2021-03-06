/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Control from './abstract';
import Ember from 'ember';

import getName from 'furnace-forms/utils/get-name';
import ControlSupport from 'furnace-forms/mixins/controls/control-support';

import Proxy from 'furnace-forms/proxy';
/**
 * Panel control component proxy 
 * 
 * @class Panel
 * @namespace Furnace.Forms.Controls
 * @extends Furnace.Forms.Controls.Abstract
 * @protected
 */
export default Control.extend(ControlSupport,{
	_component : 'panel',
	
	'for' : null,
	
	modelName: Ember.computed.alias('_modelName'),
	
	init: function() {
//		if(this['for']===null) {
//			if(this.get('_panel.for.'+this._name)) {
//				this.reopen({
//					'for': Ember.computed.alias('_panel.for.'+this._name)
//				});
//			} else {
//				this.reopen({
//					'for': Ember.computed.alias('_panel.for')
//				});
//			}
//		}
		this._super();		
		if(this._panel && this.get('for')===this.get('_panel.for')) {
			this.set('_path',this.get('_panel._path'));
		}	
		if(this.get('_panel') && !this.get('_panel.isEnabled')) {
			this.setEnabled(false);
		}
	},
	
	actions: {
		apply:function() {
			this._apply();
		},
		reset : function(action) {
			this._reset();
		},
	},
	
	_modelName : Ember.computed('for',function(key,value) {
		if(value)  {
			return value;
		}	
		if(this.get('for')===this.get('_panel.for')) {
			return this.get('_panel._modelName');
		}
		else if(this.get('for')) {
			return getName(this.get('for'));
		}
		else {
			return null;
		}
	}),
	
	_targetName : function() {
		if(this.get('targetObject')) {
			return getName(this.get('targetObject'));
		}
		else {
			return null;
		}
	}.property('targetObject'),
	
	caption : null,
	
	_apply:function() {
		this._super();
		this.get('inputControls').invoke('_apply');
		if((!this._form || this.get('for')!==this._form.get('for')) && this.get('for') instanceof Proxy) {
			this.get('for')._apply();
		}
	},
	
	_reset:function(modelChanged) {
		this._super(modelChanged);
	},
	
}).reopenClass({
	
	generate : function(mixins,options) {
		var options=options || {};
		mixins=mixins || [];	
		if(!options['for']) {
			if(options._panel && options._panel._isFormOption) {
				options['for']=Ember.computed.alias('_panel.for');
			} else if(options._panel.get('for.'+options._name)) {
				options['for']=Ember.computed.alias('_panel.for.'+options._name);
			} else {
				options['for']=Ember.computed.alias('_panel.for');						
			}
		}
		mixins.push(options);
		var typeKey=this.typeKey;
		var component = this.extend.apply(this,mixins);
		component.typeKey=typeKey;
		return component;
	}
});