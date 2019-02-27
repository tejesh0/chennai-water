(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.g1 = global.g1 || {})));
}(this, (function (exports) { 'use strict';

var version = "0.14.0";

var template_ = "<div class=\"position-relative\"><div class=\"formhandler\"><div class=\"note\"></div><div class=\"formhandler-table-header d-flex justify-content-between mb-2\"><div class=\"d-flex flex-wrap\"><div class=\"edit\"></div><div class=\"add\"></div><div class=\"count\"></div><div class=\"page\"></div><div class=\"size\"></div></div><div class=\"d-flex\"><div class=\"filters\"></div><div class=\"export\"></div></div></div><div class=\"<%- (options.table == 'grid') ? 'table_grid' : 'table' %>\"></div></div><div class=\"loader pos-cc d-none\"><div class=\"fa fa-spinner fa-spin fa-3x fa-fw\"></div><span class=\"sr-only\">Loading...</span></div></div><div class=\"modal formhandler-table-modal\" id=\"fh-modal-<%- idcount %>\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"fh-label-<%- idcount %>\" aria-hidden=\"true\"><div class=\"modal-dialog modal-sm\" role=\"document\"><div class=\"modal-content\"><form class=\"formhandler-table-modal-form modal-body\"><label id=\"fh-label-<%- idcount %>\" for=\"formhandler-table-modal-value\">Value</label><p><input class=\"form-control\" name=\"filter_input\"></p><div><button type=\"button\" class=\"btn btn-sm btn-secondary mr-1\" data-dismiss=\"modal\">Cancel</button><button type=\"submit\" class=\"btn btn-sm btn-primary mr-1\">Apply filter</button><a class=\"btn btn-sm btn-danger remove-action urlfilter\" data-dismiss=\"modal\" data-target=\"#\" href=\"#\">Remove filter</a></div></form></div></div></div><div class=\"modal formhandler-unique-table-modal\" id=\"fh-unique-modal-<%- idcount %>\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"fh-unique-label-<%- idcount %>\" aria-hidden=\"true\"><div class=\"modal-dialog modal-sm\" role=\"document\"><div class=\"modal-content\"><form class=\"formhandler-table-modal-form modal-body p-3\"><div><input class=\"form-control mb-2\" placeholder=\"search...\" autocomplete=\"off\" type=\"search\" data-search=\"data-label\" data-target=\".fh-unique .fh-label-unique-values\" data-hide-class=\"d-none\"><div class=\"fh-unique overflow-auto border p-2\" style=\"max-height: 30vh; min-height: 30vh\"></div><div class=\"mt-2\"><button type=\"submit\" class=\"btn btn-sm btn-primary mr-1\">ok</button><button type=\"button\" class=\"btn btn-sm btn-secondary mr-1\" data-dismiss=\"modal\">Cancel</button></div></div></form></div></div></div>";
var template_checkbox = "<label for=\"<%- id %>\" data-label=\"<%= label %>\" class=\"<%- labelClass %>\"><input type=\"checkbox\" name=\"<%- name %>\" id=\"<%- id %>\" class=\"<%- inputClass %>\" value=\"<%- value %>\" <%- checked ? \"checked\": \"\" %>> <%= label %> </label>";
var template_table = "<%\n  var filtered_cols = args['_c'] && args['_c'].length != options.columns.length ?\n                      options.columns.filter(function(col) { return args['_c'].indexOf('-' + col.name) < 0 }) :\n                      options.columns\n  var cols = options.columns.length ? filtered_cols : meta.columns;\n  cols = cols.filter(function(col) { return col.hide !== true})\n  var form_id = idcount\n%> <table class=\"table table-sm table-striped\"><thead> <% _.each(cols, function(colinfo) {\n        col_defaults(colinfo, data)\n        var menu_item = false\n        var col_id = idcount++\n        var qsort = parse('?')\n        var isSorted = _.includes(args['_sort'], colinfo.name) ? {op: '', cls: 'table-primary'} : _.includes(args['_sort'], '-' + colinfo.name) ? {op: '-', cls: 'table-danger'} : {}\n      %> <th class=\"<%- isSorted.cls %>\" data-col=\"<%- colinfo.name %>\"><div class=\"dropdown\"><a href=\"#\" class=\"dropdown-toggle text-nowrap\" id=\"fh-dd-<%- col_id %>\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\"> <%- colinfo.title || colinfo.name %> </a><div class=\"dropdown-menu\" aria-labelledby=\"fh-dd-<%- col_id %>\"> <% _.each(colinfo.sort, function(title, op) { menu_item = true\n              qsort = qsort.update({_sort: args['_sort'] || []})\n              if (!_.isEmpty(isSorted))\n                qsort = qsort.update({_sort: [colinfo.name, '-' + colinfo.name]}, 'del')\n              var active = _.includes(args['_sort'], op + colinfo.name) %> <a class=\"dropdown-item urlfilter <%- active ? 'active': '' %>\" href=\"<%- qsort.update({_sort: [op + colinfo.name]}, active ? 'del': 'add').toString() %>\"> <%- title %> </a> <% }) %> <% if (menu_item) { %> <div class=\"dropdown-divider\"></div> <% menu_item = false } %> <% _.each(colinfo.filters, function(title, op) { menu_item = true %> <a class=\"dropdown-item <%= colinfo.name + op in args ? 'active' : '' %>\" href=\"#\" data-op=\"<%- op %>\" data-toggle=\"modal\" data-target=\"#fh-modal-<%- form_id %>\"> <%- title %> </a> <% }) %> <% if (menu_item) { menu_item = false %><div class=\"dropdown-divider\"></div><% } %> <% if (colinfo.unique) { menu_item = true %> <a class=\"dropdown-item\" href=\"#\" data-toggle=\"modal\" data-target=\"#fh-unique-modal-<%- form_id %>\">Filter by values...</a> <% } %> <% if (menu_item) {\n              menu_item = false %> <div class=\"dropdown-divider\"></div> <% } %> <% if (colinfo.hideable) { %> <a class=\"dropdown-item urlfilter\" href=\"?_c=-<%- encodeURIComponent(colinfo.name) %>\" data-mode=\"add\">Hide</a> <% } %> </div></div></th> <% }) %> </thead><tbody> <% if (isAdd) { %> <tr class=\"new-row\"> <% _.each(cols, function(colinfo) {\n          if (!colinfo.template) { %> <td data-key=\"<%- colinfo.name %>\"> <% var isEditable = colinfo.editable === undefined ? true : colinfo.editable %> <%= _.template(templates['template_editable'])({isEditable: isEditable, val: undefined}) %> </td> <% } else { %> <td></td> <% } %> <% }) %> </tr> <% } %> <% if (options.rowTemplate) { %> <% _.each(data, function(row, rowIndex) { %> <%= typeof options.rowTemplate == 'function' ? options.rowTemplate({row: row, data: data, index: rowIndex}) : _.template(options.rowTemplate)({row: row, data: data, index: rowIndex}) %> <% }) %> <% } else {%> <% _.each(data, function(row, rowIndex) { %> <tr data-val=\"<%- JSON.stringify(row) %>\" data-row=\"<%- rowIndex %>\"> <% _.each(cols, function(colinfo) { %> <% var fmt = typeof(colinfo.format),\n            val = row[colinfo.name],\n            isEditable = colinfo.editable === undefined ? true : colinfo.editable,\n            disp = fmt == \"function\" ?\n              colinfo.format({name: colinfo.name, value: val, index: rowIndex, row: row, data:data }) :\n            fmt === \"string\" && colinfo.type === \"number\" ?\n              numeral(val).format(colinfo.format) :\n            fmt === \"string\" && colinfo.type === \"date\" ?\n              moment(val).format(colinfo.format):\n              val,\n            col_link\n          %> <% if (!isEdit && 'link' in colinfo)  var col_link = typeof colinfo.link == 'function' ? colinfo.link({name: colinfo.name, value: val, format: disp, index: rowIndex, row: row, data: data}) : _.template(colinfo.link)({name: colinfo.name, value: val, format: disp, index: rowIndex, row: row, data: data}) %> <% if (colinfo.template) { %> <%= typeof colinfo.template == 'function' ? colinfo.template({name: colinfo.name, value: val, format: disp, link: col_link, index: rowIndex, row: row, data: data}) : _.template(colinfo.template)(({name: colinfo.name, value: val, format: disp, link: col_link, index: rowIndex, row: row, data: data})) %> <% } else if (col_link) { %> <td><a href=\"<%- col_link %>\" target=\"_blank\"> <%= disp %> </a></td> <% } else if (isEdit && isEditable) { %> <td data-key=\"<%- colinfo.name %>\"> <%= _.template(templates['template_editable'])({isEditable: isEditable, val: val}) %> </td> <% } else { %> <td><a class=\"urlfilter\" href=\"?<%- encodeURIComponent(colinfo.name) %>=<%- encodeURIComponent(val) %>&_offset=\"> <%= disp %> </a></td> <% } %> <% }) %> </tr> <% }) %> <% } %> </tbody></table>";
var template_editable = "<% if (isEditable.input == 'select') { %> <select <% for (key in isEditable.attrs) { %> <%= key + '=\"' + isEditable.attrs[key] + '\"' %> <% } %> class=\"form-control form-control-sm\"><option value=\"\" disabled selected>-- select --</option> <% _.each(isEditable.options, function(item) { %> <option <%- val && val === item ? 'selected': null %> value=\"<%- item %>\"> <%- item %> </option> <% }) %> </select> <% } else if (isEditable.input == 'radio') { %> <% _.each(isEditable.options, function(item) { %> <input type=\"radio\" <%- val && val === item ? 'checked': null %> value=\"<%- item %>\" <% for (key in isEditable.attrs) { %> <%= key + '=\"' + isEditable.attrs[key] + '\"' %> <% } %> class=\"form-control form-control-sm\"> <%- item %> <br> <% }) %> <% } else { %> <input type=\"<%- isEditable.input || 'text' %>\" value=\"<%- val %>\" <% for (key in isEditable.attrs) { %> <%= key + '=\"' + isEditable.attrs[key] + '\"' %> <% } %> class=\"form-control form-control-sm\"> <% } %>";
var template_page = "<% var page = 1 + Math.floor(meta.offset / meta.limit),\n      last_page = 'count' in meta ? Math.floor((meta.count + meta.limit - 1) / meta.limit) : meta.rows < meta.limit ? page : null,\n      lo = Math.max(page - 2, 1),\n      hi = last_page !== null ? Math.min(last_page, page + 2) : page + 2 %> <ul class=\"pagination pagination-sm mr-2\"><li class=\"page-item <%- page <= 1 ? 'disabled' : '' %>\"><a class=\"page-link\" href=\"?_offset=<%- meta.offset - meta.limit %>\">Previous</a></li> <% if (lo > 1) { %> <li class=\"page-item\"><a class=\"page-link\" href=\"?_offset=\">1</a></li> <% if (lo > 2) { %> <li class=\"page-item disabled\"><a class=\"page-link\" href=\"#\">...</a></li> <% } %> <% } %> <% _.each(_.range(lo, hi + 1), function(pg) { %> <li class=\"page-item <%- pg == page ? 'active' : '' %>\"><a class=\"page-link\" href=\"?_offset=<%- meta.limit * (pg - 1) || '' %>\"> <%- pg %> </a></li> <% }) %> <% if ('count' in meta) { %> <% if (hi + 1 < last_page) { %> <li class=\"page-item disabled\"><a class=\"page-link\" href=\"#\">...</a></li> <% } %> <% if (hi < last_page || lo > hi) { %> <li class=\"page-item\"><a class=\"page-link\" href=\"?_offset=<%- meta.limit * (last_page - 1) %>\"> <%- last_page %> </a></li> <% } %> <% } %> <li class=\"page-item <%- (last_page === null) || (page < last_page) ? '' : 'disabled' %>\"><a class=\"page-link\" href=\"?_offset=<%- meta.offset + meta.limit %>\">Next</a></li></ul>";
var template_size = "<% if (meta.limit) { %> <div class=\"btn-group btn-group-sm mr-2\" role=\"group\"><button id=\"formhandler-size-<%- idcount++ %>\" type=\"button\" class=\"btn btn-light btn-sm dropdown-toggle\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\"> <%- meta.limit %> rows</button><div class=\"dropdown-menu\" aria-labelledby=\"formhandler-size-<%- idcount %>\"><a class=\"dropdown-item urlfilter\" href=\"?_limit=\">Default</a> <% _.each(options.sizeValues, function(size) { %> <a class=\"dropdown-item <%- meta.limit == size ? 'active' : '' %> urlfilter\" href=\"?_limit=<%- size %>\"> <%- size %> </a> <% }) %> <a class=\"dropdown-item <%- meta.limit == meta.count ? 'active' : '' %> urlfilter\" href=\"?_limit=<%- meta.count %>\"> <%- meta.count %> </a></div></div> <% } %>";
var template_count = "<% if ('count' in meta) { %> <span class=\"btn btn-sm btn-light mr-2\"> <%- meta.count %> rows</span> <% } %>";
var template_edit = "<button type=\"submit\" class=\"btn btn-success mr-2 btn-sm edit-btn\">Edit</button>";
var template_add = "<button type=\"button\" class=\"btn btn-success mr-2 btn-sm add-btn\">Add</button>";
var template_export = "<div class=\"btn-group btn-group-sm\" role=\"group\"><button id=\"formhandler-export-<%- idcount++ %>\" type=\"button\" class=\"btn btn-light btn-sm dropdown-toggle\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">Export as</button><div class=\"dropdown-menu dropdown-menu-right\" aria-labelledby=\"formhandler-export-<%- idcount %>\"> <% _.each(options.exportFormats, function(label, key) { %> <a class=\"dropdown-item\" href=\"<%- parse(options.src).update(args).update({_format: key}) %>\"> <%- label %> </a> <% }) %> </div></div>";
var template_filters = "<div class=\"p-1\"><%\n  var qparts = parse('?')\n  _.each(args['_c'], function(col_name) {\n    qparts.update({_c: col_name}, 'add')\n    var hide_col = col_name[0] == '-'\n    var display_name = hide_col ? col_name.slice(1) : col_name %> <a href=\"?_c=<%- encodeURIComponent(col_name) %>\" data-mode=\"del\" class=\"badge badge-pill <%- hide_col ? 'badge-dark' : 'badge-danger' %> urlfilter\" title=\"<%- hide_col ? 'Show' : 'Hide' %> column <%- display_name %>\"> <%- display_name %> </a> <% })\n  _.each(args, function(list_values, key) {\n    if (key.charAt(0) !== '_' && key !== 'c') {\n      _.each(args[key], function(col_name) {\n        var update = {}\n        update[key] = col_name\n        qparts.update(update, 'add') %> <a href=\"?<%- encodeURIComponent(key) %>=<%- encodeURIComponent(col_name) %>\" data-mode=\"del\" class=\"badge badge-pill badge-dark urlfilter\" title=\"Clear <%- key %> filter\"> <%- key %> = <%- col_name %> </a> <% })\n    }\n  })\n  qparts = qparts.toString()\n  if (qparts && qparts != '?') { %> <a href=\"?<%- qparts.slice(1) %>\" class=\"badge badge-pill badge-danger urlfilter\" data-mode=\"del\" title=\"Clear all filters\">×</a> <% } %> </div>";
var template_error = "<div class=\"alert alert-warning alert-dismissible\" role=\"alert\"> <%- message %> <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">×</span></button></div>";
var template_table_grid = "<%\n  var filtered_cols = args['_c'] && args['_c'].length != options.columns.length ?\n                      options.columns.filter(function(col) { return args['_c'].indexOf('-' + col.name) < 0 }) :\n                      options.columns\n  var cols = options.columns.length ? filtered_cols : meta.columns\n  var form_id = idcount, img\n  if (options.rowTemplate) {\n    _.each(data, function(row, rowIndex) { %> <%= typeof options.rowTemplate == 'function' ? options.rowTemplate({row: row, index: rowIndex, data: data}) : _.template(options.rowTemplate)({row: row, data: data, index: rowIndex}) %> <% })\n} else { %> <div class=\"formhandler-grid row\"> <% _.each(data, function(row, rowIndex) { %> <div class=\"col-sm-3 <%= options.classes || 'formhandler-grid-cell d-inline-block p-3 box-shadow' %>\"><div class=\"thumbnail\"> <% img = options.icon ? ((typeof(options.icon) == 'function' ? options.icon({row: row, data: data, index: rowIndex}) : options.icon)) : 'fa fa-home' %> <% if (img.indexOf('fa ') >= 0) { %> <i class=\"<%= img %>\"></i> <% } else { %> <img class=\"img img-responsive\" src=\"<%= img %>\"> <% } %> <div class=\"caption\"> <% _.each(cols, function(colinfo) {\n              var fmt = typeof(colinfo.format),\n                  val = row[colinfo.name],\n                  disp = (fmt == \"function\" ? colinfo.format({index: rowIndex, name: colinfo.name, value: val, row: row, data:data }) :\n                          fmt === \"string\" && colinfo.type === \"number\" ? numeral(val).format(colinfo.format) :\n                          fmt === \"string\" && colinfo.type === \"date\" ? moment(val).format(colinfo.format) :\n                          val) %> <div><strong><%= colinfo.name %></strong>: <% if ('link' in colinfo) {\n                    var col_link = typeof colinfo.link == 'function' ? colinfo.link({row: row, value: val, index: rowIndex, name: colinfo.name, data: data, format: disp}) : _.template(colinfo.link)({row: row, value: val, index: rowIndex, name: colinfo.name, data: data, format: disp}) %> <a href=\"<%- col_link %>\" target=\"_blank\"><%= disp %></a> <% } else { %> <a class=\"urlfilter\" href=\"?<%- encodeURIComponent(colinfo.name) %>=<%- encodeURIComponent(val) %>&_offset=\"> <%= disp %> </a> <% } %> </div> <% }) %> </div></div></div> <% }) %> </div> <% } %>";

var default_templates = Object.freeze({
	template_: template_,
	template_checkbox: template_checkbox,
	template_table: template_table,
	template_editable: template_editable,
	template_page: template_page,
	template_size: template_size,
	template_count: template_count,
	template_edit: template_edit,
	template_add: template_add,
	template_export: template_export,
	template_filters: template_filters,
	template_error: template_error,
	template_table_grid: template_table_grid
});

/*
  url.parse() provides results consistent with window.location.

  0 href                Full URL source
  1 protocol            http, https, etc
  2 origin              username:password@hostname:port
  4 username            username
  5 password            password
  - host                NOT IMPLEMENTED
  6 hostname            hostname
  7 port                port
  9 pathname            full path, excluding hash
  12 search              search parameters
  13 hash                url fragment

  The following are not part of window.location, but provided anyway.

  3 userinfo            username:password
  8 relative:           Everything after origin
  10 directory:          Directory part of pathname
  11 file:               File part of pathname
    - searchKey           search as an ordered dict of strings
    - searchList          search as an ordered dict of arrays
  */

var
    _url_parse_key    = ['href','protocol','origin','userinfo','username','password','hostname','port','relative','pathname','directory','file','search','hash'],
    _url_parse_qname  = ['searchKey', 'searchList'],
    _url_parse_strict = /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,  // eslint-disable-line
    _url_parse_search = /(?:^|&)([^&=]*)=?([^&]*)/g;

var _decode_uri_component = function(s) { return decodeURIComponent(s.replace(/\+/g, '%20')) },
    _encode_uri_component = encodeURIComponent;

function parse(str) {
  /* Based on parseUri 1.2.2: http://blog.stevenlevithan.com/archives/parseuri
    MIT License
  */
  var uri = {
        toString: unparse,
        join: join,
        update: update
      },
      m   = _url_parse_strict.exec(str || ''),
      i   = 14;

  while (i--) uri[_url_parse_key[i]] = m[i] || '';

  var search_key = uri[_url_parse_qname[0]] = {},
      search_list = uri[_url_parse_qname[1]] = {};
  uri[_url_parse_key[12]].replace(_url_parse_search, function ($0, key, val) {
    if (key) {
      key = _decode_uri_component(key);
      val = _decode_uri_component(val);
      search_key[key] = val;
      search_list[key] = search_list[key] || [];
      search_list[key].push(val);
    }
  });

  return uri
}


// Converts the URL parts back into the original URL.
function unparse(self) {
  self = self || this;
  var protocol    = self[_url_parse_key[1]] || 'http',
      username    = self[_url_parse_key[4]],
      password    = self[_url_parse_key[5]],
      hostname    = self[_url_parse_key[6]],
      port        = self[_url_parse_key[7]],
      pathname    = self[_url_parse_key[9]],
      search      = self[_url_parse_key[12]],
      hash        = self[_url_parse_key[13]],
      search_key  = self[_url_parse_qname[0]],
      search_list = self[_url_parse_qname[1]],
      parts = hostname ? [protocol, '://'] : [],
      qparts = [],
      key, vals, i, l;
  if (username) {
    parts.push(username);
    if (password) parts.push(':', password);
    parts.push('@');
  }
  parts.push(hostname);
  if (port) parts.push(':', port);
  parts.push(pathname || (hostname ? '/' : ''));
  if (search) {
    parts.push('?', search);
  } else {
    if (search_list) {
      for (key in search_list) {
        for (i=0, vals=search_list[key], l=vals.length; i<l; i++) {
          qparts.push(_encode_uri_component(key) + '=' + _encode_uri_component(vals[i]));
        }
        if (!l) qparts.push(key);
      }
    } else if (search_key) {
      for (key in search_key) {
        qparts.push(_encode_uri_component(key) + '=' + _encode_uri_component(search_key[key]));
      }
    }
    if (qparts.length) parts.push('?', qparts.join('&'));
  }
  if (hash) parts.push('#', hash);

  return parts.join('')
}


function join(urlstr, options) {
  options = options || {};
  var self = this,
      sources = self[_url_parse_key[9]].split('/'), // self.pathname.split
      ptr     = sources.length - 1,                 // Points to last element
      url     = parse(urlstr),
      targets = url.pathname.split('/'),
      l       = targets.length,
      i,
      frag;

  if (typeof options.query == 'undefined')
    options.query = true;
  if (typeof options.hash == 'undefined')
    options.hash = true;

  for (i=0; i<14; i++) {
    if (i == 9) continue                      // Ignore path
    if (i == 12 && !options.query) continue   // Ignore search parameters
    if (i == 13 && !options.hash) continue    // Ignore url fragment
    if (url[_url_parse_key[i]]) self[_url_parse_key[i]] = url[_url_parse_key[i]];
  }
  if (options.query && url[_url_parse_key[12]]) {  // Copy search parameters
    self[_url_parse_qname[0]] = url[_url_parse_qname[0]];
    self[_url_parse_qname[1]] = url[_url_parse_qname[1]];
  }
  for (i=0; i < l; i++) {
    frag = targets[i];
    if (frag == '.') {
      sources[ptr] = '';
    } else if (frag == '..') {
      sources[--ptr] = '';
    } else if (frag === '') {
      // Ignore blank urlstr
      if (l > 1) {
        // Leading slash clears the URL
        if (!i) {
          sources[0] = frag;
          ptr = 1;
        }
        // Trailing slash is appended
        if (i == l - 1) sources[ptr] = frag;
      }
    } else {
      sources[ptr] = frag;
      if (i < l - 1) ptr++;
    }
  }

  // Set .pathname, .directory, .file.
  var path = self[_url_parse_key[9]] = sources.slice(0, ptr + 1).join('/'),
      parts = path.split(/\//),
      relative = [path];
  if (self[_url_parse_key[12]]) relative.push('?', self[_url_parse_key[12]]);
  if (self[_url_parse_key[13]]) relative.push('#', self[_url_parse_key[13]]);
  self[_url_parse_key[8]] = relative.join('');   // relative
  self[_url_parse_key[10]] = parts.slice(0, parts.length - 1).join('/') + '/';   // directory
  self[_url_parse_key[11]] = parts[parts.length - 1];  // file

  return self
}


function update(args, mode) {
  var self = this,
      search_key = self[_url_parse_qname[0]],
      search_list = self[_url_parse_qname[1]],
      qparts = [],
      modes = {},
      key, val, i, l, hash, search_list_key, result;

  if (mode) {
    // Ensure that mode is a string
    mode = '' + mode;
    // If the mode is like a=add&b=toggle, treat it like URL search params and
    // convert it into a dictionary
    if (mode.match(/[&=]/))
      modes = parse('?' + mode).searchKey;
    // If the mode is just a string like add, del, toggle, apply it to all keys
    else
      for (key in args)
        modes[key] = mode;
  }

  for (key in args) {
    val = args[key];
    if (val === null) {
      search_list[key] = [];
    } else {
      if (!Array.isArray(val)) val = [val];
      if (!modes[key])
        search_list[key] = val;
      else {
        // Ensure that search_list[key] exists
        if (!(key in search_list)) search_list[key] = [];

        // Prepare a hash for lookup
        for (hash={}, i=0, l=val.length; i<l; i++)
          hash[val[i].toString()] = 1;

        // Ensure that mode is a string
        mode = '' + modes[key];

        if (mode.match(/add/i))
          search_list[key] = search_list[key].concat(val);

        // mode=del deletes all matching values
        else if (mode.match(/del/i)) {
          for (result=[], search_list_key=search_list[key], i=0, l=search_list_key.length; i<l; i++) {
            if (!hash[search_list_key[i]])
              result.push(search_list_key[i]);
          }
          search_list[key] = result;
        }

        // mode=toggle deletes matching values, adds the rest
        else if (mode.match(/toggle/i)) {
          for (result=[], search_list_key=search_list[key], i=0, l=search_list_key.length; i<l; i++) {
            if (hash[search_list_key[i]])
              hash[search_list_key[i]] = 2; // Mark it as present
            else
              result.push(search_list_key[i]);
          }
          // Append the unmarked values
          for (val in hash)
            if (hash[val] == 1)
              result.push(val);
          search_list[key] = result;
        }
      }
    }
    if (search_list[key].length === 0) {
      delete search_key[key];
      delete search_list[key];
    } else {
      search_key[key] = search_list[key][search_list[key].length - 1];
    }
  }
  for (key in search_list) {
    val = search_list[key];
    for (i=0, l=val.length; i<l; i++) {
      qparts.push(_encode_uri_component(key) + '=' + _encode_uri_component(val[i]));
    }
  }
  self.search = qparts.join('&');
  return self
}

function namespace$1(search, name) {
  // Return an object with all keys in search that begin with `<name>:` or
  // do not have a `:` in them.
  // If name is false-y, return search
  if (!name)
    return search
  var result = {};
  for (var key in search) {
    var parts = key.split(':');
    if (parts.length == 1)
      result[parts[0]] = search[key];
    else if (parts[0] === name)
      result[parts[1]] = search[key];
  }
  return result
}

// state_transition[old_state][current_type] -> new_state
// type: undefined and type: null are mapped to state 'null', i.e. missing values
var state_transitions = {
  'null': {
    'null': { state: 'null' },
    'date': { state: 'date' },
    'number': { state: 'number' },
    'boolean': { state: 'boolean' },
    'string': { state: 'string' },
    'object': { state: 'object' },
    'mixed': { state: 'mixed', end: true }
  },
  'date': {
    'null': { state: 'date' },
    'undefined': { state: 'date' },
    'date': { state: 'date' },
    'default': { state: 'mixed', end: true }
  },
  'number': {
    'null': { state: 'number' },
    'undefined': { state: 'number' },
    'number': { state: 'number' },
    'default': { state: 'mixed', end: true }
  },
  'boolean': {
    'null': { state: 'boolean' },
    'undefined': { state: 'boolean' },
    'boolean': { state: 'boolean' },
    'default': { state: 'mixed', end: true }
  },
  'string': {
    'null': { state: 'string' },
    'undefined': { state: 'string' },
    'string': { state: 'string' },
    'default': { state: 'mixed', end: true }
  },
  'object': {
    'null': { state: 'object' },
    'object': { state: 'object' },
    'undefined': { state: 'object' },
    'default': { state: 'mixed', end: true }
  },
  'mixed': {
    'default': { state: 'mixed', end: true }
  }
};


function types(data, options) {
  var result = {};
  if (!data || !data.length)
    return result

  options = options || {};
  options.convert = options.convert || false;
  options.limit = options.limit || 1000;
  var limit = (options.limit < data.length) ? options.limit : data.length;
  var ignore = options.ignore = options.ignore || [null, undefined];
  var columns = Object.keys(data[0]);

  for (var columnIndex = 0; columnIndex < columns.length; columnIndex++) {
    var column = columns[columnIndex];
    var result_type = 'null';
    for (var index = 0; index < limit; index++) {
      var row = data[index];
      var value = row[column];

      if (columnIndex == 0) {
        Object.keys(data[index]).forEach(function (value) {
          if (columns.indexOf(value) == -1)
            columns.push(value);
        });
      }

      // Ignore if the value is missing
      if (!(column in row))
        continue
      // Ignore values that are in the ignore list
      if (ignore.indexOf(value) >= 0)
        continue
      // Identify type (date, object, number, boolean, string, undefined, null)
      var type = typeof value;
      if (value === undefined || value === null)
        type = 'null';
      else if (type == 'object' && !isNaN(Date.parse(value)))
        type = 'date';
      else if (options.convert) {
        // We use parseFloat AND isFinite because
        // parseFloat('2018-01') is 2018 but isFinite('2018-01') is false
        // Also, 'NaN', 'Infinity' and '-Infinity' should be treated as numbers
        if ((!isNaN(parseFloat(value)) && isFinite(value)) || ['NaN', 'Infinity', '-Infinity'].indexOf(value) >= 0)
          type = 'number';
        else if (!isNaN(Date.parse(value)))
          type = 'date';
        else if (['true', 'false'].indexOf(value) != -1)
          type = 'boolean';
      }

      // Apply the state change
      var state_transition = state_transitions[type];
      var change = state_transition[result_type] || state_transition['default'];
      result_type = change['state'];
      if (change['end'])
        break
    }
    result[column] = result_type;
  }
  return result
}

function isEqual(value, compare_with, criteria_satisfied) {
  // to handle: ( ...Shape!&... ) or ( ...&Shape&... )
  if (!value) {
    return criteria_satisfied ? (compare_with == null) : (compare_with != null)
  }
  return value.indexOf(compare_with) != -1 ? !criteria_satisfied : criteria_satisfied
}

function greater_than(value, compare_with, include_equals) {
  if ((isNaN(compare_with) && Date.parse(compare_with))) {
    compare_with = Date.parse(compare_with);
  }
  if ((isNaN(value) && Date.parse(value))) {
    value = Date.parse(value);
  }
  return include_equals ? (compare_with >= value) : (compare_with > value)
}
var operators = {
  '=': function (value, compare_with) {
    return isEqual(value, compare_with, false)
  },
  '!': function (value, compare_with) {
    return isEqual(value, compare_with, true)
  },
  '>': function (value, compare_with) {
    return greater_than(value, compare_with, false)
  },
  '<': function (value, compare_with) {
    return greater_than(compare_with, value, false)
  },
  '>~': function (value, compare_with) {
    return greater_than(value, compare_with, true)
  },
  '<~': function (value, compare_with) {
    return greater_than(compare_with, value, true)
  },
  '~': function (value, compare_with) {
    return isEqual(compare_with, value[0], false)
  },
  '!~': function (value, compare_with) {
    return isEqual(compare_with, value[0], true)
  }
};

var sorting = {
  'string': function (value, compare_with, order) {
    if (!order) order = 'asc';
    // swap if 'desc'
    if (order == 'desc')
      value = [compare_with, compare_with = value][0];

    return value.localeCompare(compare_with)
  },
  'number': function (value, compare_with, order) {
    if (!order) order = 'asc';
    // swap if 'desc'
    if (order == 'desc')
      value = [compare_with, compare_with = value][0];

    return value - compare_with
  }
};

function clone_pluck(source, include_keys, exclude_keys) {
  if (include_keys.length == 0) include_keys = Object.keys(source);
  var new_obj = {};
  include_keys.forEach(function (key) {
    if (exclude_keys.indexOf(key) < 0) new_obj[key] = source[key];
  });
  return new_obj
}



function datafilter(data, filters, dataset_name) {
  filters = filters || [];

  var result = data;
  var operator, value;

  // url namespace sanitize
  filters = namespace$1(filters, dataset_name);

  var data_types = types(data, { convert: true });

  // apply WHERE clause
  for (var key in filters) {
    if (key[0] == '_') continue
    var operator_index = (key.match(/(!|>|>~|<|<~|~|!~)$/)) ? key.match(/(!|>|>~|<|<~|~|!~)$/).index : key.length;
    operator = (key.slice(operator_index) != '') ? key.slice(operator_index) : '=';
    value = (filters[key][0] != "") ? filters[key] : null;

    var col = key.slice(0, operator_index);
    if (data_types[col] == 'number') {
      value = value.map(function(val) { return parseFloat(val)});
    } else if (data_types[col] == 'boolean') {
      value = value.map(function(val){ return String(val) == 'true' ? true : false});
    } else if (data_types[col] == 'date') {
      value = value.map(function(val) { return Date.parse(val) });
    }

    result = result.filter(function (row) {
      return (typeof row[col] != 'undefined') ? operators[operator](value, row[col]) : true
    });
  }

  var offset = parseInt(filters['_offset']) || 0;
  var limit = parseInt(filters['_limit']) || 1000;

  result = result.slice(offset, (offset + limit));

  // apply SELECT clause
  if (filters['_c']) {
    var exclude_cols = [], include_cols = [];
    filters['_c'].forEach(function (column) {
      column[0] == '-' ? exclude_cols.push(column.slice(1)) : include_cols.push(column);
    });
    result = result.map(function (row) {
      return clone_pluck(row, include_cols, exclude_cols)
    });
  }

  if (filters['_sort']) {
    result.sort(function (a, b) {
      var swap_rows = false;
      filters['_sort'].forEach(function (sort) {
        var order = (sort[0] == '-') ? 'desc' : 'asc';
        if (sort[0] == '-') sort = sort.substr(1);
        if (typeof a[sort] == 'undefined') return
        // if sort.column evaluates to false, it will proceed with evaluating || expression
        var type = (isNaN(a[sort])) ? 'string' : 'number';
        swap_rows = swap_rows || sorting[type](a[sort], b[sort], order);
      });
      return swap_rows
    });
  }

  return result
}

// Import HTML sections as variables using rollup-plugin-htmlparts.js.

// Render components in this order. The empty component is the root component.
var components = ['', 'table', 'edit', 'add', 'page', 'size', 'count', 'export', 'filters', 'error', 'table_grid'];
var default_options = {
  table: true,
  edit: false,
  add: false,
  page: true,
  pageSize: 100,
  size: true,
  sizeValues: [10, 20, 50, 100, 500, 1000],
  count: true,
  export: true,
  exportFormats: {
    xlsx: 'Excel',
    csv: 'CSV',
    json: 'JSON',
    html: 'HTML'
  },
  filters: true,
  onhashchange: true
};
var meta_headers = ['filters', 'ignored', 'excluded', 'sort', 'offset', 'limit', 'count'];

var default_filters = {
  text: { '': 'Equals...', '!': 'Does not equal...', '~': 'Contains...', '!~': 'Does not contain...' },
  number: { '': 'Equals...', '!': 'Does not equal...', '<': 'Less than...', '>': 'Greater than...' },
  date: { '': 'Equals...', '!': 'Does not equal...', '<': 'Before...', '>': 'After...' }
};

// Set default values for column specifications
// function col_defaults(colinfo, data) {
function col_defaults(colinfo) {
  // Sort defaults
  if (!('sort' in colinfo) || colinfo.sort === true)
    colinfo.sort = { '': 'Sort ascending', '-': 'Sort descending' };
  else if (typeof colinfo.sort != 'object')
    colinfo.sort = {};

  // Type defaults
  colinfo.type = colinfo.type || 'text';

  // Filters defaults
  if (!('filters' in colinfo) || (colinfo.filters === true))
    colinfo.filters = default_filters[colinfo.type];

  // Hideable defaults
  if (!('hideable' in colinfo))
    colinfo.hideable = true;

  // Hide defaults
  if (!('hide' in colinfo))
    colinfo.hide = false;
}


function formhandler(js_options) {
  if (!js_options)
    js_options = {};

  this.each(function () {
    var $this = $(this);
    // Convert all .urlfilter classes into url filters that update location.hash
    $this.urlfilter({
      selector: '.urlfilter, .page-link',
      target: '#',
      remove: true                          // auto-remove empty values
    });

    // Pre-process options
    var options = $.extend({}, default_options, js_options, $this.data());

    if (!options.columns)
      options.columns = [];
    else if (typeof options.columns == 'string')
      options.columns = _.map(options.columns.split(/\s*,\s*/), function (col) { return { name: col } });

    // Compile all templates
    var template = {};
    _.each(components, function (name) {
      var tmpl = options[name ? name + 'Template' : 'template'] || default_templates['template_' + name] || 'NA';
      template[name] = _.template(tmpl);
    });

    function draw_table(data, args, meta) {
      // Add metadata
      meta.rows = data.length;
      meta.columns = data.length ? _.map(data[0], function (val, col) { return { name: col } }) : [];

      // If any column name is '*', show all columns
      var star_col = _.find(options.columns, function (o) { return o['name'] === '*' });
      if (star_col) {
        var action_header_cols = _.cloneDeep(meta.columns);
        _.map(options.columns, function (option_col) {
          var found = _.find(meta.columns, function (o) { return o['name'] === option_col.name });
          if (!found && option_col.name !== '*')
            action_header_cols.push(option_col);
        });

        action_header_cols = _.map(action_header_cols, function (col) {
          var options_col = _.find(options.columns, function (o) { return o['name'] === col.name });
          return options_col ? options_col : $.extend({}, star_col, col)
        });
      }

      options.columns = action_header_cols ? action_header_cols : options.columns;

      // Render all components into respective targets
      var template_data = {
        data: data,
        meta: meta,
        args: args,
        options: options,
        idcount: 0,
        parse: parse,
        col_defaults: col_defaults,
        isEdit: false,
        isAdd: false,
        templates: default_templates
      };
      // Store template_data in $this
      $this.data('formhandler', template_data);

      _.each(components, function (name) {
        render_template(name, template_data, options, $this, template);
      });
      if (options.add)
        addHandler($this, template_data, options, template);
      if (options.edit)
        editHandler($this, template_data, options, template);
    }

    function render() {
      var url_args = parse(location.hash.replace(/^#/, '')).searchList;
      url_args = namespace$1(url_args, options.name);
      // Create arguments passed to the FormHandler. Override with the user URL args
      var args = _.extend({
        c: options.columns.map(function (d) { return d.name }),
        _limit: options.pageSize,
        _format: 'json',
        _meta: 'y'
      }, url_args);
      $('.loader', $this).removeClass('d-none');

      function done(data, status, xhr) {
        var meta = {};
        _.each(meta_headers, function (header) {
          var val = xhr ? xhr.getResponseHeader('Fh-Data-' + header) : null;
          if (val !== null)
            meta[header] = JSON.parse(val);
        });
        if (typeof options.transform == 'function') {
          var result = options.transform({ data: data, meta: meta, options: options, args: args }) || {};
          data = 'data' in result ? result.data : data;
          meta = 'meta' in result ? result.meta : meta;
        }

        // To support data-src that doesn't poin to formhandler url pattern
        if (_.isEmpty(meta) && options.page && options.size) {
          meta['offset'] = args._offset ? parseInt(args._offset) : 0;
          meta['limit'] = parseInt(args._limit);
          meta['count'] = data.length;
          data = datafilter(data, args);
        }

        draw_table(data, args, meta);
        $this.trigger({ type: 'load', formdata: data, meta: meta, args: args, options: options });
      }

      if (options.data && typeof (options.data) == 'object') {
        options.edit = false;
        options.add = false;
        done(options.data);
      }
      else {
        $.ajax(options.src, {
          dataType: 'json',
          data: args,
          traditional: true
        }).done(done)
          .always(function () { $('.loader', $this).addClass('d-none'); })
          .fail(failHandler.bind(this, $this, template));
      }
    }

    modalHandler($this);

    actionHandler($this, options, template);

    // Re-render every time the URL changes
    if (options.onhashchange)
      $(window).on('hashchange', render);
    // Initialize
    render();
  });

  return this
}

function modalHandler($this) {
  //  Handle modal dialog
  var currentKey;
  $this
    .on('shown.bs.modal', '.formhandler-table-modal', function (e) {
      var $el = $(e.relatedTarget);
      var template_data = $this.data('formhandler');
      var op = $el.data('op');
      var col = $el.closest('[data-col]').data('col');
      var val = '';
      // If there is a value, show it, and allow user to remove the filter
      if (template_data.args[col + op]) {
        val = template_data.args[col + op].join(',');
        $('.remove-action', this).attr('href', '?' + col + op + '=').show();
      } else
        $('.remove-action', this).hide();
      $('input', this).val(val).attr('name', col + op).focus();
      $('label', this).text($el.text());
    })
    .on('shown.bs.modal', '.formhandler-unique-table-modal', function (e) {
      var $el = $(e.relatedTarget);
      var col = $el.closest('[data-col]').data('col');

      // if content already rendered for current col, and same col modal is opened
      if (currentKey == col && $.trim($('.fh-unique', $this).html())) return

      var template_data = $this.data('formhandler');
      currentKey = col;
      // render checkboxes for unique items of column
      var unique_values = _.find(template_data.options.columns, function (item) { return item.name == col }).unique;

      var default_ticks = parse('?' + location.hash.replace(/^#\?/, '')).searchList[col];
      var modal_data = [];
      modal_data.push({ label: 'All', id: 'fh-select-all', labelClass: 'd-block', inputClass: 'fh-select-all mr-2', checked: false, value: '', name: '' });

      unique_values.sort().map(function (unique_value, index) {
        var checked = false;
        if (default_ticks && default_ticks.indexOf(unique_value) >= 0) checked = true;
        modal_data.push({
          label: unique_value, value: unique_value, name: col, labelClass: 'fh-label-unique-values',
          id: col + index, checked: checked, inputClass: 'fh-unique-values mr-2'
        });
      });

      var modal_content = '';
      modal_data.map(function (checkbox_item) {
        modal_content += '<div>' + _.template(template_checkbox)(checkbox_item) + '</div>';
      });

      $('.fh-unique', $('.formhandler-unique-table-modal', $this)).html('').append(modal_content);

      checkbox_state_toggle_selectall('.fh-select-all', true)();
      $('.fh-unique-values', $this).on('change', checkbox_state_toggle_selectall('.fh-select-all', true));
      $('.fh-select-all', $this).on('change', checkbox_state_toggle_selectall('.fh-label-unique-values:not(.d-none) input.fh-unique-values', false));

      function checkbox_state_toggle_selectall(selector, checked) {
        return function () {
          var visible_checkboxes = $('.fh-unique .fh-label-unique-values:not(.d-none)', $this);
          if ($('.fh-unique-values:checked', visible_checkboxes).length == visible_checkboxes.length) {
            $(selector, $this).prop('checked', checked);
          } else {
            $(selector, $this).prop('checked', !checked);
          }
        }
      }

      // Enable search box only if g1.search is loaded
      if (jQuery.fn.search) {
        $('.formhandler-unique-table-modal').search();
        $('input[type="search"]', $this).trigger('search');
        $('input[type="search"]', $this).on('shown.g.search', checkbox_state_toggle_selectall('.fh-select-all', true));
      }
      else {
        $('input[type="search"]', $this).remove();
      }
    })
    .on('submit', 'form.formhandler-table-modal-form', function (e) {
      e.preventDefault();
      var url = parse(location.hash.replace(/^#/, ''));
      var form_serialized = $(e.currentTarget).serialize();
      if (form_serialized === '')
        url.update(url.searchList, currentKey+ '=del');
      else
        url.update(parse('?' + $(e.currentTarget).serialize()).searchList);

      $(this).closest('.modal').modal('hide');
      window.location.hash = '#' + url.update(url.searchList, '_offset=del');
    });
}

function render_template(name, data, options, $this, template) {
  // Disable components if required. But root component '' is always displayed
  if (name && !options[name])
    return

  var target;
  // The root '' component is rendered into $this.
  if (!name)
    target = $this;
  else {
    // Rest are rendered into .<component-name> under $this

    if (options[name] == 'grid') name = 'table_grid';
    var selector = options[name + 'Target'] || '.' + name;
    target = $(selector, $this);
    // But if they don't exist, treat the selector as a global selecctor
    if (target.length == 0)
      target = $(selector);
  }
  target.html(template[name](data));
}


function addHandler($this, template_data, options, template) {

  $('.add button', $this)
    .on('click', function () {
      var add_btn = $('.add button', $this);
      var edit_btn = $('.edit button', $this);
      if (add_btn.html().toLowerCase() == 'save') {
        add_btn.html('Add');
        edit_btn.prop('disabled', false);
        var columns_data = $('.new-row td[data-key]');

        $('.loader', $this).removeClass('d-none');
        var data = {};

        $.each(columns_data, function (key, column) {
          data[column.getAttribute('data-key')] = $(column).children().val();
        });
        // if no changes made to new empty celled row, rerender the table.
        if (!_.some(data)) {
          $('.loader', $this).addClass('d-none');
          template_data.isAdd = false;
          render_template('table', template_data, options, $this, template);
          return
        }

        $.ajax(options.src, {
          method: 'POST',
          dataType: 'json',
          data: data
        }).done(function () {
          template_data.data.unshift(data);
          template_data.isAdd = false;
          render_template('table', template_data, options, $this, template);
          if (options.add.done) options.add.done();
        }).always(function () { $('.loader', $this).addClass('d-none'); })
          .fail(failHandler.bind(this, $this, template));
      } else if (add_btn.html().toLowerCase() == 'add') {
        add_btn.html('Save');
        edit_btn.prop('disabled', true);
        template_data.isAdd = true;
        render_template('table', template_data, options, $this, template);
        add_edit_events($this, add_btn);
      }
    });
}

function editHandler($this, template_data, options, template) {
  $('.edit button', $this)
    .on('click', function () {
      var edit_btn = $('.edit button', $this);
      var add_btn = $('.add button', $this);
      if (edit_btn.html().toLowerCase() == 'save') {
        edit_btn.html('Edit'); // TODO: remove hardcoding of name Edit
        add_btn.prop('disabled', false);
        var edited_rows = $('.edited-row');
        if (edited_rows.length > 0)
          $('.loader', $this).removeClass('d-none');

        var all_ajax = [];
        $.each(edited_rows, function (key, edited_row) {
          var data = JSON.parse(edited_row.getAttribute('data-val'));
          var rowIndex = edited_row.getAttribute('data-row');
          for (key in data) {
            // TODO: refactor to identify editable columns other than using data-key attrs on <td> tag
            var editable_element = $('td[data-key="' + (remove_quotes(key)) + '"] :input', $(edited_row));
            if (editable_element.length) {
              data[key] = template_data['data'][rowIndex][key] = editable_element.val();
            }
          }
          all_ajax.push(
            $.ajax(options.src, {
              method: 'PUT',
              dataType: 'json',
              data: data
            }).fail(failHandler.bind(this, $this, template))
              .always(function () {
                $('.loader', $this).addClass('d-none');
                if (options.add.editFunction) options.add.editFunction();
              })
          );
        });
        $.when.apply($, all_ajax).then(function () {
          $('.loader', $this).addClass('d-none');
          if (options.edit.done) options.edit.done();
        });
        template_data.isEdit = false;
        render_template('table', template_data, options, $this, template);
      } else if (edit_btn.html().toLowerCase() == 'edit') {
        edit_btn.html('Save'); // TODO: remove hardcoding of name Save
        add_btn.prop('disabled', true);
        template_data.isEdit = true;
        render_template('table', template_data, options, $this, template);
        add_edit_events($this, edit_btn);
        $this.trigger({ type: 'editmode' });
      }
    });
}

function actionHandler($this, options, template) {
  var default_actions = {
    'delete': function (arg) {
      return $.ajax(options.src, { method: 'DELETE', dataType: 'json', data: arg.row })
        .done(function () { $('tr[data-row="' + arg.index + '"]', $this).remove(); })
    }
  };
  $this.on('click', '[data-action]', function () {
    var arg = {
      row: $(this).closest('[data-val]').data('val'),
      index: $(this).closest('[data-row]').data('row'),
      notify: notify.bind(this, $this, template)
    };
    var action = $(this).data('action');

    var method = (options.actions && (options.actions.filter(function (each_action) { return action in each_action }).length > 0))
      ? options.actions.filter(function (each_action) { return action in each_action })[0][action]
      : default_actions[action];

    var deferred = method(arg);
    if (deferred && deferred.always) {
      $('.loader', $this).removeClass('d-none');
      deferred
        .always(function () { $('.loader', $this).addClass('d-none'); })
        .fail(failHandler.bind(this, $this, template));
    }
  });
}


function remove_quotes(str) {
  return str.toString().replace(/["']/g, '')
}

function notify($this, template, message) {
  var $note = $('.note', $this);
  if (!$note.length)
    $note = $('<div class="note"></div>').appendTo($this);
  $note.html(template['error']({ message: message }));
}

function failHandler($this, template, xhr, status, message) {
  var error = status + ': ' + message;
  if (xhr.readyState == 0)
    error += ' (cannot connect to server)';
  notify($this, template, error);
}


function add_edit_events($this, save_btn) {
  $('tbody :input', $this)
    // When the user types something, mark the row as changed
    .on('change', function () {
      $(this).parents('tr').addClass('edited-row');
    })
    // When the user presses Enter, click on the "Save" button
    .on('keypress', function (e) {
      if (e.keyCode == 13) {
        $(this).blur();      // Remove focus so that change / .edited-row is triggered
        save_btn.trigger('click');
      }
    })
    // Focus on the first element
    .eq(0).focus();
}

// jQuery utilities.

// Returns true if data attribute is present
//    But if the value is "false", "off", "n" or "no" in any case, returns false (like YAML)
// Returns default_value if data attribute is missing
function hasdata($node, key, default_value) {
  var val = $node.data(key);
  if (typeof val == 'undefined' || val === false || val === null)
    return default_value
  if (typeof val == 'string' && val.match(/^(false|off|n|no)$/i))
    return false
  return true
}

var container_options = {
  attr: 'href',
  event: 'click change submit',
  selector: '.urlfilter',
  src: 'src'
};
var event_namespace =  '.urlfilter';

function urlfilter(options) {
  var $self = this;
  // If there are no elements in the selection, exit silently
  if ($self.length == 0)
    return
  var doc = $self[0].ownerDocument;
  var settings = $.extend({}, container_options, options || {}, this.dataset);
  var default_remove = settings.remove || hasdata($self, 'remove');
  var events = settings.event.split(/\s+/).map(function (v) { return v + event_namespace }).join(' ');
  // options.location and options.history are used purely for testing
  var loc = settings.location || (doc.defaultView || doc.parentWindow).location;
  var hist = settings.history || (doc.defaultView || doc.parentWindow).history;
  return $self
    .on(events, settings.selector, function (e) {
      var $this = $(this),
          mode = $this.data('mode') || settings.mode,
          target = $this.data('target') || settings.target,
          src = $this.data('src') || settings.src,
          remove = hasdata($this, 'remove', default_remove),
          href;
      if (e.type == 'change' || $(e.target).is(':input:not(:button)')) {
        var key = encodeURIComponent($this.attr('id') || $this.attr('name'));
        var val = encodeURIComponent($this.val());
        href = '?' + key + '=' + val;
      }
      else if (e.type == 'submit' || $(e.target).is('form')) {
        e.preventDefault();
        href = '?' + $this.serialize();
      }
      else if (e.type == 'click') {
        if ($(e.target).is('a'))
          e.preventDefault();
        href = $this.attr(settings.attr);
      } else
        return

      var url = parse(href),
          q = url.searchList;

      function target_url(url) {
        var result = parse(url)
          .join(href, { query: false, hash: false })
          .update(q, mode);
        if (remove) {
          var missing_keys = {};
          for (var key in result.searchKey)
            if (result.searchKey[key] === '')
              missing_keys[key] = null;
          result.update(missing_keys);
        }
        return result.toString()
      }

      // If the target is...       the URL is get/set at
      // ------------------------  ---------------------
      // unspecified (=> window)   location.href
      // 'pushState'               location.href
      // '#'                       location.hash
      // anything else             $(target).data(src)
      if (!target)
        loc.href = target_url(loc.href);
      else if (target == '#')
        loc.hash = target_url(loc.hash.replace(/^#/, ''));
      else if (target.match(/^pushstate$/i))
        hist.pushState({}, '', target_url(loc.href));
      else {
        $(target).each(function () {
          var $target = $(this);
          var url = target_url($target.attr(src));
          $target.attr(src, url).load(url, function () {
            $target.trigger({ type: 'load', url: url });
          });
        });
      }
      $this.trigger({ type: 'urlfilter', url: url });
    })
}

var url = {
  parse: parse,
  unparse: unparse,
  join: join,
  update: update
};

if (typeof jQuery != 'undefined') {
  jQuery.extend(jQuery.fn, {
    urlfilter: urlfilter
  });
}

if (typeof jQuery != 'undefined') {
  jQuery.extend(jQuery.fn, {
    formhandler: formhandler
  });
}

exports.version = version;
exports.url = url;

Object.defineProperty(exports, '__esModule', { value: true });

})));
