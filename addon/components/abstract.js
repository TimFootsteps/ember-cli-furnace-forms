/**
 * Provides Form and input features.
 *
 * @module furnace
 * @submodule furnace-forms
 */
import Ember from 'ember';
import Control from 'furnace-forms/controls/abstract';

/**
 * Abstract control component 
 * 
 * @class Abstract
 * @namespace Furnace.Forms.Components
 * @extends Ember.Component
 */
export default Ember.Component.extend({
	tagName: 'control',
	
	classNameBindings: ['_validClass','_focusClass','_enabledClass','control._name','_controlClasses','_typeClass'],
	
	control: null,
	
	_focusClass : function() {
		if(this.get('_focus')===true) {
			return 'focus';
		}
		return null;
	}.property('_focus'),
	
	caption: Ember.computed.alias('control.caption'),
	
	actions: {
		focus:function() {
			this.setFocus(true);
		},
		
		blur:function() {
			this.setFocus(false);
		},
		
	},
	
	setFocus: function(focus) {
		if(focus!=this._focus) {
			this.set('_focus',focus);
			this.set('hasFocus',focus);
		}
		
	},
			
	_focus:false,
	
	hasFocus: false,
	
	/**
	 * The name for the control
	 * @property _name
	 * @type String
	 * @private
	 */
	name : Ember.computed.alias('control._name'),
	
	/**
	 * The form to which the control belongs
	 * @property _form
	 * @type Furnace.Validation.Components.Form
	 * @private
	 */
//	_form : null,
	
	/**
	 * The panel to which the control belongs
	 * @property _panel
	 * @type Furnace.Validation.Components.Panel
	 * @private
	 */
//	_panel : null,
	
	/**
	 * The path for the control
	 * @property _path
	 * @type String
	 * @private
	 */
//	_path : null,
	
	/**
	 * CSS class for validity
	 * @property _validClass
	 * @type String
	 * @private
	 */
	_validClass : function() {
		var valid=this.get('isValid');
		if(valid===false) {
			return 'invalid';
		}
		else if(valid===true) {
			return 'valid';
		}
	}.property('isValid'),
	
	/**
	 * CSS class for enabled
	 * @property _enabledClass
	 * @type String
	 * @private
	 */
	_enabledClass : function() {
		if(this.get('isEnabled')===false) {
			return 'disabled';
		}
		return null;
	}.property('isEnabled'),
	
	
	/**
	 * Whether the control is enabled or not (alias for private property _enabled)
	 * @property isEnabled
	 * @type Boolean
	 * @default true
	 */
	isEnabled: true,
	
	
	
	
			
	/**
	 * Whether the input is valid
	 * @property _valid
	 * @type Boolean
	 * @default: null
	 * @private
	 */
//	_valid: null,

	/**
	 * Whether the control is valid or not (alias for private property _valid)
	 * @property isValid
	 * @type Boolean
	 * @default null
	 */
	isValid: null,
	
	
	
//	_dirty:false,
	
	isDirty:  false,
	
	
	
	notifyChange: function() {
		this.get('control').notifyChange();
	},
	
	
	/**
	 * Get the path for the component
	 * @method _getPath
	 * @type String
	 * @private
	 */
	
	
	
	
	/**
	 * CSS classes determined by validation errors, warnings and notices
	 * @property _controlClasses
	 * @type String
	 * @private
	 */
	_controlClasses : function() {
		var classes=[];
		if(this.get('hasError')) {
			classes.push('error');
		} 
		if(this.get('hasWarning')) {
			classes.push('warning');
		}
		if(this.get('hasNotice')) {
			classes.push('notice');
		}		
		return classes.join(" ");
	}.property('hasError,hasWarning,hasNotice'),
	
	
	hasError: false,
	
	hasWarning: false,
	
	hasNotice: false,
	
	init : function() {
		this._super();
		this.set('_controlMessages',Ember.A());
		Ember.assert('A form component ('+this+') initialized without a control!',this.control);
		this.control.registerComponent(this);
		this.set('target',this.control);
	},
	
	_enabledObserver: function() {
		if(this.get('isEnabled') && (this.hasError || this.hasWarning || this.hasNotice)) {
			this.set('_showMessages',true);
		}
		else {
			this.set('_showMessages',false);
		}
	}.observes('isEnabled'),
	
	_showDelayedMessages : true,
	
	_showMessages : false,
	
	_controlMessages : null,
	
//	_errors : Ember.computed.filterBy('_controlMessages','type','error'),
//	
//	_warnings : Ember.computed.filterBy('_controlMessages','type','warning'),
//
//	_notices : Ember.computed.filterBy('_controlMessages','type','notice'),
	
	_controlMessageObserver : function() {
		var messages=this.__controlMessages;
		var source = null;
		
		var focus=this.get('_focus');
		if(!focus) {
			source= this.get('control._controlMessages').filter(function(message) {
				if(message.display==="focus")
					return false;
				return true;
			});
		} else {
			var showDelayed=this.get('_showDelayedMessages');
			source= this.get('control._controlMessages').filter(function(message) {
				if(message.display==="immediate")
					return true;
				if(showDelayed && message.display==='delayed') 
					return true;
				if(focus && message.display==='focus') 
					return true;
				return false;
			});
		}
		this.control._updateMessages(source,this._controlMessages);
		
		this.set('hasError',this._controlMessages.findBy('type','error')!==undefined);
		this.set('hasWarning',this._controlMessages.findBy('type','warning')!==undefined);
		this.set('hasNotice',this._controlMessages.findBy('type','notice')!==undefined);
		
		
		if(this.get('isEnabled') && (this.hasError || this.hasWarning || this.hasNotice)) {
			this.set('_showMessages',true);
		}
		else {
			this.set('_showMessages',false);
		}
		
		this.propertyDidChange('_controlMessages');
		this.propertyDidChange('_showMessages');
	}.observes('_focus,_showDelayedMessages'),
	
	
	defaultLayout : Ember.computed.alias('tagName'),
	
	/**
	 * @TODO: Fix layoutname resolution, it is a mess
	 * Layoutnames:
	 * 
	 * - Ofcourse component override
	 * - Control specified layoutName
	 * - Form modelName, path or default layout (model.property or model.text)
	 * - Form modelName and component type (model.text) ???
	 * - Something weird with the constructor typekey.
	 * - Finally defaultLayout (panel, text)
	 */
	
	layoutName: function() {
		var layoutName=null;
		if(!this.get('container')) {
			return null;
		}
		if(this.control.get('layoutName')) {
			return this.control.get('layoutName');
		}
		layoutName=(this.get('control._form._modelName')+'.'+(this.control._path ? this.control._path : this.get('defaultLayout'))).replace(/\./g,'/');
		if(this.get('container').lookup('template:'+layoutName)) {
			return layoutName;
		}
		
		if(this.constructor.typeKey) {
			layoutName=(this.get('control._form._modelName')+'.'+this.constructor.typeKey).replace(/\./g,'/');
			if(this.get('container').lookup('template:'+layoutName)) {
				return layoutName;
			}
			layoutName=this.constructor.typeKey.replace(/\./g,'/');
			if(layoutName===this.constructor.typeKey) {
				layoutName = 'forms/'+layoutName;
			} else {
				layoutName = layoutName+'/input';
			}
			if(this.get('container').lookup('template:'+layoutName)) {
				return layoutName;
			}
		}
		return this.get('defaultLayout');
	}.property(),
	
	_focusObserver : function(sender,key) {		
		this.set('_showDelayedMessages',false);
	}.observes('_focus'),
	
	hasPrerequisites : Ember.computed.alias('control.hasPrerequisites'),
	
	willDestroy : function() {
		this.control.unregisterComponent(this);
		this._super();
//		if(this.get('targetObject.'+this._name) instanceof Control) {
//			this.set('targetObject.'+this._name+'.content',null);
//		}
//		this._unregisterControl ? this._unregisterControl(this) : this._form._unregisterControl(this);
	},
	
	getStore: function() {
		return this.get('control.store');
	},
	
	getFor: function(key) {
		return this.control.getFor(key);
	}
	
	
	
});