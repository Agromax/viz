// var d = require('adiff');
// var rs = require('randomstring');


var lcs_m = function(str1, str2) {
  var currentOffset, i, j, k, l, length, m, matrix, offset, ref, ref1, ref2, results, sequence;
  if (!str1 || !str2) {
    return false;
  }
  sequence = "";
  length = 0;
  offset = 0;
  matrix = new Array(str1.length);
  for (i = k = 0, ref = str1.length; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
    matrix[i] = new Array(str2.length);
    for (j = l = 0, ref1 = str2.length; 0 <= ref1 ? l < ref1 : l > ref1; j = 0 <= ref1 ? ++l : --l) {
      matrix[i][j] = 0;
    }
  }
  results = [];
  for (i = m = 0, ref2 = str1.length; 0 <= ref2 ? m < ref2 : m > ref2; i = 0 <= ref2 ? ++m : --m) {
    results.push((function() {
      var n, ref3, results1;
      results1 = [];
      for (j = n = 0, ref3 = str2.length; 0 <= ref3 ? n < ref3 : n > ref3; j = 0 <= ref3 ? ++n : --n) {
        if (str1[i] !== str2[j]) {
          results1.push(matrix[i][j] = 0);
        } else {
          if (i === 0 || j === 0) {
            matrix[i][j] = 1;
          } else {
            matrix[i][j] = 1 + matrix[i - 1][j - 1];
          }
          if (matrix[i][j] > length) {
            currentOffset = i - matrix[i][j] + 1;
            length = matrix[i][j];
            if (offset === currentOffset) {
              results1.push(sequence += str1[i]);
            } else {
              sequence = str1.substr(currentOffset, i + 1 - currentOffset);
              results1.push(offset = currentOffset);
            }
          } else {
            results1.push(void 0);
          }
        }
      }
      return results1;
    })());
  }
  return results;
};




function lcs() {

	var a = null, b = null;
	if(arguments.length > 1)  {
		a = arguments[0];
		b = arguments[1];
	}

	var _mat = function(rows, cols) {
		var mat = [];
		for(var i=0; i<rows; i++) {
			var row = [];
			for(var j=0; j<cols; j++) {
				row.push(0);
			}
			mat.push(row);
		}
		return mat;
	};


	var _lcs = function() {
		var m 	= a.length;
		var n 	= b.length;
		var seq = _mat(m+1, n+1);	// create a matrix of size m x n

		var _a 	= a.split('');
		var _b  = b.split('');

		for(var i=0; i<=m; i++) {
			for(var j=0; j<=n; j++) {
				if(i===0 || j===0) {
					seq[i][j] = 0
				}
				else if(_a[i-1] === _b[j-1]) {
					seq[i][j] = seq[i-1][j-1] + 1;
				} else {
					seq[i][j] = Math.max(seq[i-1][j], seq[i][j-1]);
				}
			}
		}

		return seq[m][n];
	};

	if(a && b) {
		return _lcs();
	}

	return -1;
}


module.exports = lcs;