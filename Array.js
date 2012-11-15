/*

  Array.prototype.stats 
  
  JavaScript Array Prototype Statistics Library
    Version: 0.3 (Experimental)
    Date: 11/2012
 
*/

// TODO: it might be good to have the average/median/mode calculated at the same time.
// TODO: need to remove the elements from the dataset that are not valid (null/undefined/non numbers)
function Median(dataset) {
  var median = dataset.sort(function(a, b) {return true ? a < b : false;});
  var result = null;
  if(median.length % 2 == 0) {
    result = (median[median.length/2-1]+median[median.length/2])/2;
    return result;
  } else {
    result = median[(median.length-1)/2]
    return result;
  }
}

// TODO : needs updating
function AbsMedian(dataset) {
  var abs = dataset.map(Math.abs);
  var median = abs.sort(function(a, b) {return true ? a < b : false;});
  var result = null;
  if(median.length % 2 == 0) {
    result = (median[median.length/2-1]+median[median.length/2])/2;
    return result;
  } else {
    result = median[(median.length-1)/2]
    return result;
  }
}

// note to self: null and 0 are the same in javascript unless you do !==
function Primary(dataset) {
  var total = 0;
  var abstotal = 0;
  var geometric = dataset[0];
  var count = 0;
  for (var i = 0; i < dataset.length; i++) {
    if(!isNaN(dataset[i]) && dataset[i] !== "" && dataset[i] !== null){
      total += dataset[i];
      abstotal += Math.abs(dataset[i]);
      geometric = dataset[i] * geometric; 
      count++;
    }
  }
  return {total: total, abs: abstotal, count: count, average : total/count, geomean : Math.pow(geometric, 1/count)};
}

// note to self: null and 0 are the same in javascript unless you do !==
function Mean(dataset) {
  if(!isNaN(dataset[0]) && dataset[0] !== "" && dataset[0] !== null){
    var total = dataset[0];
    var abs = Math.abs(dataset[0]);
    var average = dataset[0];
    var quadratic = dataset[0]; // quadratic mean = RMS (root mean square)
    var geometric = dataset[0]; // geometric mean = power(a*b*c*...n, 1/n)
    var harmonic = dataset[0]; // harmonic mean = n / (1/a + 1/b + ... 1/n)
    var count = 1;
  } 
  else {
    var total = 0;
    var abs = 0;
    var average = 0;
    var geomean = 0;
    var harmonic = 0;
    var count = 0;
  }
  if(dataset.length > 1) {
    var remainder = Mean(dataset.split(1, dataset.length));
    total += remainder.total;
    abs += remainder.abs;
    count += remainder.count;
    average = total/count;
    quadratic = Math.sqrt(remainder.quadratic/count);
    geometric = Math.pow(result.geometric * geometric, 1/count);
    harmonic = count / (1/result.harmonic + 1/harmonic); // todo check for divide by 0 error
    result = {total: dataset[0] + Primary(dataset.split(1, dataset.length), abs: abstotal, count: count, average : total/count, geomean : Math.pow(geometric, 1/count)};
  } else {
    return {total: total, abs: abs, count: count, average : average, geomean : geomean};
  }
}

// meddev : median absolute deviation
// Wikipedia Example: Consider the data (1, 1, 2, 2, 4, 6, 9). 
// It has a median value of 2. The absolute deviations about 2 
// are (1, 1, 0, 0, 2, 4, 7) which in turn have a median value of 1 
// (because the sorted absolute deviations are (0, 0, 1, 1, 2, 4, 7)). 
// So the median absolute deviation for this data is 1.
function Deviations(dataset, median, avg) {
  var total = 0;
  var count = 0;
  var deviations = [];
  var absdeviations = [];
  var std = 0;
  for(var i = 0; i < dataset.length; i++) {
    if(!isNaN(dataset[i]) && dataset[i] !== "" && dataset[i] !== null){
      absdeviations.push(Math.abs(dataset[i]-median));
      deviations.push(Math.abs(dataset[i]-avg));
      total = Math.abs(dataset[i]-avg) + total;
      std = (dataset[i]-avg) * (dataset[i]-avg) + std;
      count++;
    }
  }
  var meddev = Median(absdeviations);
  return {absdev : total/count, meddev : meddev, stddev: Math.sqrt(std/count), deviation : total, variance : std/count}; 
}

// Mode() 
// Wikipedia: The mode is the number that appears most often in a set of numbers.
// The mode of a discrete probability distribution is the value x at which its probability mass function takes its maximum value. In other words, it is the value that is most likely to be sampled.
// The mode of a continuous probability distribution is the value x at which its probability density function has its maximum value, so, informally speaking, the mode is at the peak.
function Mode(dataset, average) {
  var mode = dataset[0];
  for (var i = 1; i < dataset.length; i++) {
    if(Math.abs(dataset[i]-average) < Math.abs(mode-average)) {
      mode=dataset[i];
    }
  }
  return null; // TODO. 
}

// TODO: this function needs to be rewritten to 
// return {absdev : function etc...} so that each element is only accessed when requested and not preprocessed
// TODO: the median needs to be checked more carefully and filtered or re .map for each element if it is not a valid element it needs to be removed
Array.prototype.stats = function () {
  var prime = Primary(this);
  this.total = prime.total; // sum of all the values in the array
  this.abs = prime.abs;
  this.count = prime.count; // we are using the count rather then dataset.length because some of the value maybe non numbers
  this.average = prime.average; // simple average
  this.geomean = prime.geomean; // geometric mean (A x B x C)^1/n (where n is the number of elements in this case 3)
  this.median = Median(this); // Median is the middle number and is used for robust statistics
  this.mode = Mode(this, this.average); // Mode is the most common number and is also used in robust statistics
  var dev = Deviations(this, this.median, this.average);
  this.deviation = dev.deviation; // the sum of the absolute values of the diffrences from the average
  this.absdev = dev.absdev; // the absolution deviation (average absolute deviation) is MAYBE more robust then the standard deviation
  this.stddev = dev.stddev; // square root of the average of the sum of the squares of the data
  this.meddev = dev.meddev; 
  this.variance = dev.variance; // http://en.wikipedia.org/wiki/Variance sum of the squres of the deviations divided by the total elements
  this.medvariation = this.meddev/this.median; // 
  this.variation = this.stddev/this.average; // http://en.wikipedia.org/wiki/Coefficient_of_variation
  this.absvariation = this.stddev/(this.abs/this.count);
  this.absmedian = AbsMedian(this);
  if(this.absmedian == 0) {
    this.medabsvariation = this.meddev; // CAREFULL / TODO Requires Further Research
  } else {
    this.medabsvariation = this.meddev/this.absmedian;
  }
  this.beta = null; // TODO
  this.alpha = null; // TODO
  this.deviation = dev.deviation;
}