/**
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from "ember";
import getName from 'furnace-forms/utils/get-name';
import boundControl from './bound-control';

/**
 * @method f-control
 * @for Furnace.Forms.helpers
 * @param {Furnace.Forms.Control.Abstract} ControlProxy
 * @param {Hash} options
 * @return {String} HTML string  
 */
export default function controlHelper(params, hash, options, env) {
	Ember.assert('You need to specify a control from your form',params[0]);
	var view = env.data.view;
	var control =params[0].value();
	var dynamic=hash['dynamic']!==undefined ? hash['dynamic'] : false;
	
	if(dynamic)
		delete hash['dynamic'];
	
	Ember.assert('Control not found',control);
	if(dynamic) {
		Ember.assert('A dynamic control display is required but the component helper is not avaiable!',env.helpers.component!==undefined);
		boundControl.call(this,[params[0]],hash,options,env);
	}
	else {
		if(!control._component) {			
			control._component=view.get('controller.optionType');
		}
		var component = control.getComponentClass();
		hash.control=control;
		hash._debugContainerKey = component + control.get('_name');
		Ember.warn('Control ('+control._name+') does not specify a component, nothing will be rendered',component);
		if(!component)
			return;
		env.helpers.view.helperFunction.call(this,[component],hash,options,env);
	}
}
