function Partition(boundaries, userData) {
    
    boundaries.sort(function(a, b) {
        if(a < b) {
            return -1;
        }
        else if(a > b) {
            return 1;
        }
        else {
            return 0;
        }
    });
    
    var instance = {
        span: function() {
            return boundaries[boundaries.length - 1] - boundaries[0];
        },
        atProgress: function(progress) {
            return instance.at(boundaries[0] + progress * instance.span());
        },
        at: function(x) {

            var low = 0;
            var high = boundaries.length-1;
            while(high - low > 1) {
                var middle = Math.round((low + high) / 2);
                if(boundaries[middle] < x) {
                    low = middle;
                }
                else if(boundaries[middle] >= x) {
                    high = middle;
                }
            }
            return {
                index: low,
                value: userData[low]
            };
        }
    };

    return instance;
};

Partition.fromSizedSegments = function(sizedSegments) {
    var boundaries = [0];
    sizedSegments.forEach(function(sizedSegment) {
        boundaries.push(boundaries[boundaries.length-1] + sizedSegment.size);
    });
    return Partition(boundaries, sizedSegments);
}

module.exports = Partition;

/******** test ********/
if (require.main === module) {

    console.error('Testing...');

    var assert = require('assert');
    
    var p = Partition([0,  4,  9,  11,  11.5,  30],
                            ['a','b','c', 'd',   'e']);
    
    assert(p.at(0) === 'a');
    assert(p.at(1) === 'a');
    assert(p.at(4) === 'a');
    assert(p.at(8) === 'b');
    assert(p.at(11) === 'c');
    assert(p.at(11.1) === 'd');
    assert(p.at(28) === 'e');
    assert(p.at(30) === 'e');

    console.error('Passed!');
}
