<table class="table table-striped latest-data">
  <tbody>
    {{each $data as tr}}
    <tr>
      <td class="dbname">{{tr.dbname}}</td>

      <td class="query-count">
        <span>
          {{tr.lastSample.nbQueries }}
        </span>
      </td>

      {{each tr.lastSample.topFiveQueries as td}}
      <td>
        {{td.formatElapsed }}
        <div class="popover left">
          <div class="popover-content">{{td.query }}</div>
          <div class="arrow"></div>
        </div>
      </td>
      {{/each}}
    </tr>
    {{/each}}
  </tbody>
</table>

