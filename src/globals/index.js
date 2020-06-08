/**
 *          .::GLOBALS::.
 * ALL DATA THAT SHOULD BE AVAILABLE EVERYWHERE
 * 
 */
import _ from 'lodash';
import modules from './modules';
_.mapKeys(modules, (value, name) => {
    global[name] = value;
})

import vars from './vars';
global.globals = vars;