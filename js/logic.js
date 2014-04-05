'use strict';

(function ($) {
  $.getJSON('structure.json', function (structure) {
    document.body.innerHTML = getHTMLTable(structure);
  });
}(window.jQuery));

var nth = ['First', 'Second', 'Third', 'Fourth', 'Fifth'];

function getHTMLTable(structure) {
  var results = getTable(structure),
    html = '<table class="table"><thead><tr>',
    i, j, l, m;

  for (i = 0, l = countInputs(structure); i < l; i++) {
    html += '<td>' + nth[i] + '</td>';
  }

  html += '<td>Output</td></tr></thead>';

  for (i = 0, l = results.length; i < l; i++) {
    html += '<tr>';

    for (j = 0, m = results[i].input.length; j < m; j++) {
      html += '<td>' + results[i].input[j] + '</td>';
    }

    html += '<td>' + results[i].output + '</td></tr>';
  }

  html += '</table>';
  return html;
}

function getTable(structure) {
  var inputs = countInputs(structure),
    variations = Math.pow(2, inputs),
    results = [];

  for (var i = 0; i < variations; i++) {
    var args = pad(i.toString(2), inputs).split('').map(charToBool);
    results.push({
      input: [].concat(args),
      output: evalLogic(structure, args)
    });
  }

  return results;
}

function pad (str, len) {
  var toAdd = len - str.length;

  for (var i = 0; i < toAdd; i++) {
    str = '0' + str;
  }

  return str;
}

function charToBool(char) {
  return char !== '0';
}

function countInputs(structure) {
  if (structure.gate === 'input') {
    return 1;
  }

  var total = 0;

  for (var i = 0, l = structure.inputs.length; i < l; i++) {
    total += countInputs(structure.inputs[i]);
  }

  return total;
}

function evalLogic(structure, args) {
  if (structure.gate === 'input') {
    return args.shift();
  }

  var gate = gates[structure.gate];

  if (!gate) {
    throw new Error('No such gate: ' + structure.gate);
  }

  if (gate.length !== structure.inputs.length) {
    throw new Error('Wrong number of inputs to gate ' + structure.gate);
  }

  var gateArgs = [];
  for (var i = 0, l = gate.length; i < l; i++) {
    gateArgs.push(evalLogic(structure.inputs[i], args));
  }

  return gate.apply(gates, gateArgs);
}

var gates = {
  and: function (a, b) {
    return a && b;
  },
  or: function (a, b) {
    return a || b;
  },
  not: function (a) {
    return !a;
  },
  nand: function (a, b) {
    return gates.not(gates.and(a, b));
  },
  nor: function (a, b) {
    return gates.not(gates.or(a, b));
  },
  xor: function (a, b) {
    return gates.and(gates.or(a, b), gates.nand(a, b));
  },
  xnor: function (a, b) {
    return gates.not(gates.xor(a, b));
  }
};
