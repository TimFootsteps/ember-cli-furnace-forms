/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from 'ember';
import Control from './abstract';


/**
 * Input control component proxy 
 * 
 * @class Input
 * @namespace Furnace.Forms.Controls
 * @extends Furnace.Forms.Controls.Abstract
 * @protected
 */
export default Control.extend({
	_component : 'view',
	
	_componentType : 'view',
	
	init : function() {
		this._super();
		// If we do not have a name, we're an anonymous option without a counterpart in 
		if(this.get('_name')) {
			this.reopen({
				value:Ember.computed.alias('_panel.for.'+this.get('_name'))
			});
			
		}			
	},



	getComponentClass : function() {
		var componentClass=null;
		componentClass = this._super();
		if(!componentClass) {
			this.layoutName=this._component.replace(/\./g,'/');
			this._component='view';
			this._componentType='forms';
			return this.getComponentClass();
		}
		return componentClass;
	},
	
});