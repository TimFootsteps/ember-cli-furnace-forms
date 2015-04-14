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
	_component : 'text',
	
	caption : null,
	
	extendHash: function(hash) {
		var ret=this._super(hash);	
		ret.caption=this.caption;
		return ret;
	}
});