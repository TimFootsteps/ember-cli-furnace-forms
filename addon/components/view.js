/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from 'ember';
import Control from './abstract';

/**
 * Input control component
 * 
 * @class Input
 * @namespace Furnace.Forms.Components
 * @extends Furnace.Forms.Components.Abstract
 */
export default Control.extend({
	defaultLayout: 'forms/view',
	
	layoutName: function() {
		if(!this.get('container')) {
			return null;
		}
		if(this.constructor.typeKey) {
			var layoutName=this.constructor.typeKey.replace(/\./g,'/');
			if(layoutName===this.constructor.typeKey) {
				layoutName = 'forms/'+layoutName;
			} else {
				layoutName = layoutName+'/input';
			}
			if(this.get('container').lookup('template:'+layoutName)) {
				return layoutName;
			}
		}
		return this.defaultLayout;
	}.property(),
	
	init:function() {
		this._super();
		// If we do not have a name, we're an anonymous option without a counterpart in 
		if(this.get('_name')) {
			if(this.get('_panel.for.'+this.get('_name'))!==undefined) {	
				this.reopen({
					value:Ember.computed.alias('_panel.for.'+this.get('_name'))
				});
			}
			else {
				this.reopen({
					value:Ember.computed.alias('_panel.for')
				});
			}
			
		}				
		
	},
});