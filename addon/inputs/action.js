/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Input from 'furnace-forms/components/input';

/**
 * Action control component
 * 
 * @class Action
 * @namespace Furnace.Forms.Components
 * @extends Furnace.Forms.Components.Abstract
 */
export default Input.extend({
	
	
	submit: false,
	
	actions : {
		click:  function() {	
			if(!this.get('isEnabled'))
				return;
			if(this.get('submit')===true) {
				this.get('targetObject').send('_submit',this._name);
			}
			else {
				this.get('targetObject').send(this._name,this._panel);
			}
		}
	},
	
	
});