
//=================================================================+
// Alert users if they have old email that will be purged
//   by  Joe Chrysler
//   for Dennis Hughes
//   @   Saginaw Valley State University
//   in  March 2011
//=================================================================+

// Initialize the Zimlet Framework  --  helpful
//=================================================================+
  function zmJanitor() {} 
  zmJanitor.prototype               = new ZmZimletBase();
  zmJanitor.prototype.constructor   = zmJanitor;
  zmJanitor.prototype.init          = function() { this._displayDialog(); };


// Send AJAX request
//   zimbra stores usernames with @domain, ldap stores them without
//   the @... inconsistencies abound. ye be warned.
//=================================================================+
  zmJanitor.prototype._displayDialog = function() {
    var username        = appCtxt.get(ZmSetting.USERNAME).split("@")[0];
    var _types          = AjxVector();
    var yearAgo         = this._buildHistoricalDate(365);
    var ninetyDaysAgo   = this._buildHistoricalDate(90);
    _types.add("MESSAGE");

    appCtxt.getSearchController().search({
      query:      'before:' + yearAgo,
      userText:   true,
      limit:      9999,
      types:      _types,
      noRender:   true,
      callback:   _rpcCallback;
  };

  zmJanitor.prototype._buildHistoricalDate = function(days) {
    var todayDate           = new Date();
    var todayStart          = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());
    var history             = new Date(todayStart.getTime() - (days * 24 * 3600 * 1000));
    var history_normalized  = this._normalizeDate(history.getMonth()+1, history.getDate(), history.getFullYear());

    return history_normalized;
  };


// Check the AJAX result
//   the first line of output is old emails, second is old unreads
//=================================================================+
zmJanitor.prototype._rpcCallback = function(response) {
  alert (response.text);
  /*var answer      = response.text.split("\n");*/
  /*var oldEmails   = answer[0];*/
  /*var oldUnreads  = answer[1];*/
  /*var message     = "You have " + oldEmails + " emails that are almost a year old.<br />"*/
  /*+ "and " + oldUnreads + " unread emails that are almost 3 months old.<br />"*/
  /*+ "To conserve space, we will be automatically deleting these messages<br />"*/
  /*+ "within the next couple of weeks.  Save any important messages to your<br />"*/
  /*+ "own PC some time this week.";*/

  /*var style = DwtMessageDialog.INFO_STYLE;*/

  /*this._dialog =  appCtxt.getMsgDialog();*/
  /*this._dialog.reset();*/
  /*this._dialog.setMessage(message, style);*/
  /*this._dialog.popup();*/
}
