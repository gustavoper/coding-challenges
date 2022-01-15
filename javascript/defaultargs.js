/**
 *  DefaultArguments implementation as expected
 */
 function defaultArguments(func, opt) {
    
    if (func === undefined) {
        return;
    }
    /**
     * 
     * Removing all comments from args, strings regex, etc
     * @param {*} str 
     * @returns Array
     */
    function sanitizeString(str) {
        
        var uid = '_' + +new Date(), 
        arrCleaned = [];
        let cleanedIndex = 0;
        
        return (
            str.replace(/(['"])(\\\1|.)+?\1/g, function(match) {
                arrCleaned[cleanedIndex] = match;
                return (uid + '') + cleanedIndex++;
            })
            .replace(/([^\/])(\/(?!\*|\/)(\\\/|.)+?\/[gim]{0,3})/g, function(match, $first, $second) {
                arrCleaned[cleanedIndex] = $second;
                return $first + (uid + '') + cleanedIndex++;
            })
            .replace(/\/\/.*?\/?\*.+?(?=\n|\r|$)|\/\*[\s\S]*?\/\/[\s\S]*?\*\//g, '')
            .replace(/\/\/.+?(?=\n|\r|$)|\/\*[\s\S]+?\*\//g, '')
            .replace(RegExp('\\/\\*[\\s\\S]+' + uid + '\\d+', 'g'), '')
            .replace(RegExp(uid + '(\\d+)', 'g'), function(match, n) {
                return arrCleaned[n];
            })
        );
    
    }
    
    var strf = func.toString();
    var regFunc = /\(([^)]+)\)/;
    var comment = /(\/\*[\w\'\s\r\n\*]*\*\/)|(\/\/[\w \']*)|(\<![\-\-\s\w\>\/]*\>)/g;
    if (regFunc.exec(strf) == null) {
        return func;
    }
    
    var nestedFunc = [];

    var sanitizedStr = sanitizeString(strf);
    nestedFunc = regFunc.exec(sanitizedStr)[1].split(',');

    if (strf.match(comment) == null) {
        nestedFunc = regFunc.exec(strf)[1].split(',');
    }
    var opt = opt || {};
    var result = result || {};
    
    nestedFunc.forEach(function(nestedFuncValue, index) {
        nestedFuncValue = nestedFuncValue.trim();
        if (opt.hasOwnProperty(nestedFuncValue)) {
            result[nestedFuncValue] = opt[nestedFuncValue];
        } else if (nestedFuncValue == 'arg') {
            for (i in opt) {
                if (opt.hasOwnProperty(i)) {
                    result[i] = opt[i];
                }
            }
        }
    });
    
    return function(arg) {
        
        var argsArray = Array.prototype.slice.call(arguments);
        var finalResult = [];
        
        if (nestedFunc == 'arg') {
            argsArray.forEach(function(value, index) {
                if (isNaN(value)) {
                    return NaN;
                }
                result[index] = value
            });
        }
        argsArray.forEach(function(value, index) {
            result[nestedFunc[index]] = value;
        });
        
        for (i in result) {
            if (result.hasOwnProperty(i)) {
                delete finalResult;
                finalResult.push(result[i]);
            }
        }
        if (arg == undefined && Object.keys(result).length == 0) {
            return NaN;
        }
        return func.apply(this, finalResult);
    }
}