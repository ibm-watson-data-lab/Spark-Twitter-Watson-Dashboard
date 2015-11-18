import React         from 'react';
import Mozaik        from 'mozaik/browser';
import sparkTwitterComponents	from './mozaik-ext-sparkTwitterComponents'


const MozaikComponent = Mozaik.Component.Mozaik;
const ConfigActions   = Mozaik.Actions.Config;

var extensions = {
    sparkTwitter: sparkTwitterComponents
};

Mozaik.Registry.addExtensions(extensions);

React.render(<MozaikComponent />, document.getElementById('mozaik'));

ConfigActions.loadConfig();