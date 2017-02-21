module.exports = function(data) {
  var html = '<table class="table table-striped latest-data"><tbody>'
  for (var i = 0; i < data.length; i++) {
    var tr = data[i]
    html += '<tr><td class="dbname">' + tr.dbname + '</td><td class="query-count"><span>' + tr.lastSample.nbQueries +  '</span></td>' 
    for (var j = 0; j < tr.lastSample.topFiveQueries.length; j++) {
      var td = tr.lastSample.topFiveQueries[j];
      html += '<td>' + td.formatElapsed + '<div class="popover left"><div class="popover-content">' + td.query + '</div><div class="arrow"></div></div></td>'
    }
    html += '</tr>'
  }
  html += '</tbody></table>'
  return html;
}

// module.exports = function(data) {
//   var html = ['<table class="table table-striped latest-data"><tbody>']
//   for (var i = 0; i < data.length; i++) {
//     var tr = data[i]
//     html.push('<tr><td class="dbname">' + tr.dbname + '</td><td class="query-count"><span>' + tr.lastSample.nbQueries +  '</span></td>')
//     for (var j = 0; j < tr.lastSample.topFiveQueries.length; j++) {
//       var td = tr.lastSample.topFiveQueries[j];
//       html.push('<td>' + td.formatElapsed + '<div class="popover left"><div class="popover-content">' + td.query + '</div><div class="arrow"></div></div></td>')
//     }
//     html.push('</tr>')
//   }
//   html.push('</tbody></table>')
//   return html.join('');
// }
