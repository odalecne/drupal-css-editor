/*jslint nomen: true, plusplus: true, todo: true, white: true, browser: true, indent: 2 */

jQuery(function($) {
  'use strict';

  // Unobstrusive syntax highlighting
  var $textarea = $('#css-editor-textarea');

  var createEditor= function() {
    var editor = CodeMirror.fromTextArea($textarea[0], { lineNumbers : true, extraKeys : {"Ctrl-Space": "autocomplete"} });
    editor.on('change', function(obj) { autoPreview(); });
    return editor;
  };

  var editor = createEditor();

  $('div.CodeMirror').after('<input type="checkbox" id="css-editor-toggle-editor" /> <label for="css-editor-toggle-editor">' + Drupal.t('Use plain text editor') + '</label>');

  $('#css-editor-toggle-editor').click(function() {
    if ($(this).is(':checked')) {
      editor.toTextArea();
    }
    else {
      editor = createEditor();
    }
  });

  // Preview
  $('div.CodeMirror').after('<input type="checkbox" id="css-editor-toggle-preview" checked="checked" /> <label for="css-editor-toggle-preview">' + Drupal.t('Enable auto preview') + '</label>');
  var $preview = $('#css-editor-preview');

  $preview.before('<div id="css-editor-preview-path-wrapper"><label for="css-editor-preview-path">' + Drupal.t('Preview path:') + '</label> <input type="text" id="css-editor-preview-path" size="60" /></div>');
  var $previewSettings = $('#css-editor-preview-path-wrapper');

  $('#css-editor-toggle-preview').click(function() {
    if ($(this).is(':checked')) {
      $preview.show();
      $previewSettings.show();
      autoPreview();
    }
    else {
      $preview.hide();
      $previewSettings.hide();
    }
  });

  $textarea.keyup(function() { autoPreview(); });

  $preview.load(function() { autoPreview(); });

  $('#css-editor-preview-path').blur(function() {
    $preview.attr('src', drupalSettings.CSSEditor.frontPage.replace('?', '/' + $(this).val() + '?'));
  });

  var autoPreview = function() {
    if ($('#css-editor-toggle-preview').is(':checked')) {
      var value = ($('#css-editor-toggle-editor').is(':checked') ? $textarea.val() : editor.getValue());
      var id = 'css-editor-preview-style';
      var $css = $preview.contents().find('#' + id);
      if ($css.length) {
        $css.html(value);
      }
      else {
        $preview.contents().find('head').append($('<style type="text/css" id="' + id + '">' + value + '</style>'));
      }
    }
  };

});
