/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from 'ember';
import Control from 'furnace-forms/components/input';
import Placeholder from 'furnace-forms/mixins/placeholder';

/**
 * Text input control component
 * 
 * @class Text
 * @namespace Furnace.Forms.Components
 * @extends Furnace.Forms.Components.Input
 */
export default Control.extend(Placeholder,{
	_showDelayedMessages : false,
	
	_delayedMessageTimer : null,
	
	_delayedMessageObserver : function() {
		if(this._delayedMessageTimer) {
			Ember.run.cancel(this._delayedMessageTimer);
		}
		if(this._showDelayedMessages) {
			this.set('_showDelayedMessages',false);
		}
		if(this.hasFocus) {
			this._delayedMessageTimer=Ember.run.later(this,function() {
				this.set('_showDelayedMessages',true);
			},2000);
		}
	}.observes('value,hasFocus'),
	
	_reset:function() {
		this._super();
		if(this._delayedMessageTimer) {
			Ember.run.cancel(this._delayedMessageTimer);
		}
	},
	
	willDestroy : function() {
		if(this._delayedMessageTimer) {
			Ember.run.cancel(this._delayedMessageTimer);
		}
		this._super();
	}
	
});