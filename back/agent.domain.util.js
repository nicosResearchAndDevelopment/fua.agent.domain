const
    _util = require('@fua/core.util'),
    util  = exports = {
        ..._util,
        assert: _util.Assert('agent.domain')
    };

util.isNonEmptyString = _util.StringValidator(/^\S+$/);

util.pause = function (seconds) {
    return new Promise((resolve) => {
        if (seconds >= 0) setTimeout(resolve, 1e3 * seconds);
        else setImmediate(resolve);
    });
};

Object.freeze(util);
module.exports = util;
