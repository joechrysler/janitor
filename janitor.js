
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
    var username    = appCtxt.get(ZmSetting.USERNAME).split("@")[0];
    var jspUrl      = this.getResource("33.jsp") + "?username=" + username;
    var callback    = new AjxCallback(this, this._rpcCallback);

    AjxRpc.invoke(null, jspUrl, null, callback, true, 60*1000*1000);
  };


// Check the AJAX result
//   the first line of output is old emails, second is old unreads
//=================================================================+
zmJanitor.prototype._rpcCallback = function() {
  /*appCtxt.getAppController().setStatusMsg(response.success + "<br />" + response.text);*/

  /*var style = DwtMessageDialog.INFO_STYLE;*/
  /*var msg   = "Hello world!";*/

  /*if (response.success) {*/
  /*msg = response.text;*/
  /*}*/
  /*msg = msg + response.success;*/

  /*this._dialog =  appCtxt.getMsgDialog();*/
  /*this._dialog.reset();*/
  /*this._dialog.setMessage(msg, style);*/
  /*this._dialog.popup();*/

  var answer      = response.text.split("\n");
  var oldEmails   = answer[0];
  var oldUnreads  = answer[1];
  var message     = "You have " + oldEmails + " emails that are almost a year old.<br />"
    + "and " + oldUnreads + " unread emails that are almost 3 months old.<br />"
    + "To conserve space, we will be automatically deleting these messages<br />"
    + "within the next couple of weeks.  Save any important messages to your<br />"
    + "own PC some time this week.";

  var warningAnimation = [ZmToast.FADE_IN,
      ZmToast.PAUSE,
      ZmToast.PAUSE,
      ZmToast.PAUSE,
      ZmToast.PAUSE,
      ZmToast.PAUSE,
      ZmToast.PAUSE,
      ZmToast.PAUSE,
      ZmToast.PAUSE,
      ZmToast.FADE_OUT];

  appCtxt.getAppController().setStatusMsg("Hello");
  if (oldEmails != 0 && oldUnreads != 0) {
    appCtxt.getAppController().setStatusMsg(warningMessage, ZmStatusView.LEVEL_CRITICAL, null, warningAnimation);
  }
}
